// Svelte / SvelteKit: https://kit.svelte.dev/.
import { fail, redirect } from '@sveltejs/kit';
// SuperForms: https://superforms.rocks/get-started.
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signSchema } from '$lib/form_schemas.js';
// Lucia v3 + drizzle orm: https://lucia-auth.com/ + https://orm.drizzle.team/.
import { argonSettings } from '$lib/server/consts';
import { db, userTable } from '$lib/server/db';
import { lucia } from '$lib/server/auth';
import { verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
// Rate Limiter: https://github.com/ciscoheat/sveltekit-rate-limiter.
import { UsernameRateLimiter } from '$lib/server/limiters.js';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';

//  The counter rises only if submitted form is schema-valid.
const limiter = new RetryAfterRateLimiter<{ username: string }>({
    // Five requests to login for the same username allowed - then limit for 15m.
    plugins: [new UsernameRateLimiter([5, '15m'])],
    // Five requests from the same IP + User Agent allowed - then limit for 15m.
    IPUA: [5, '15m'],
    // Ten requests from the same IP allowed - then limit for 1h.
    IP: [10, 'h']
});

export const load = async () => {
    // Basically, turning on Super Forms.
    const form = await superValidate(zod(signSchema));

    // Unless you call the SvelteKit redirect or error functions,
    //  you should always return the { form, ..? } object to the client.
    return { form };
};

export const actions = {
    default: async (event) => {
        // Validating the form.
        const form = await superValidate(event.request, zod(signSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        // If submitted form is schema-valid...
        // First, let's check if the user've made too many requests - limit him if that's the case.
        const status = await limiter.check(event, { username: form.data.username });
        const forN = Math.ceil(status.retryAfter / 60);
        if (status.limited) {
            return setError(
                form,
                'username',
                `Wait ~${forN} ${forN === 1 ? 'minute' : 'minutes'}. Too many requests`
            );
        }

        // Everything seems fine for now.
        // Let's check if we have the user (with the username from the form) in the database.
        const [existingUser] = await db
            .select()
            .from(userTable)
            .where(eq(userTable.username, form.data.username));

        if (!existingUser) {
            return setError(
                form,
                'username',
                "Username doesn't exist or the password is incorrect"
            );
        }

        // Okay, we have such a user.
        // Let's see if the password we've got is valid.
        const validPassword = await verify(
            existingUser.passwordHash,
            form.data.password,
            argonSettings
        );

        if (!validPassword) {
            return setError(
                form,
                'username',
                "Username doesn't exist or the password is incorrect"
            );
        }

        // Yep, at this point, seems like everything is fine.
        // Let's create a session then.
        const session = await lucia.createSession(existingUser.id, {
            passedTwoFactor: false
        });
        // ...And don't forget to set a session cookie.
        const sessionCookie = lucia.createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });

        // Basic login is done.
        //  Now, redirect - user have to pass 2factor.
        //  If 2factor isn't set yet - handle hook will redirect to /signup/factor.
        redirect(303, '/login/factor');
    }
};
