// Svelte / SvelteKit: https://kit.svelte.dev/.
import { fail, redirect } from '@sveltejs/kit';
// SuperForms: https://superforms.rocks/get-started.
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signSchema } from '$lib/form_schemas.js';
// Lucia v3 + drizzle orm: https://lucia-auth.com/ + https://orm.drizzle.team/.
import { generateIdFromEntropySize } from 'lucia';
import { argonSettings } from '$lib/server/consts';
import { db, pfpTable, userTable } from '$lib/server/db';
import { lucia } from '$lib/server/auth';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
// Rate Limiter: https://github.com/ciscoheat/sveltekit-rate-limiter.
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';
// zxcvbn: https://github.com/dropbox/zxcvbn.
import zxcvbn from 'zxcvbn';

// No rate limiting that depends on username, it's sign up page.
// Rate limits are quite harsh, because why on earth you would sign up often.
//  The counter rises only if submitted form is schema-valid & password passed zxcvbn.
const limiter = new RetryAfterRateLimiter({
    // Two requests from the same IP + User Agent allowed - then limit for 15m.
    IPUA: [2, '15m'],
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
        // First, we check how strong the password we've got is.
        const passwordCheck = zxcvbn(form.data.password.slice(0, 50), [form.data.username]);
        const passwordWarning = passwordCheck.feedback.warning;

        // And if it's relatively weak - set a error saying so.
        if (passwordCheck.score < 4) {
            return setError(
                form,
                'password',
                `${passwordWarning ? passwordWarning : 'Still weak! Probably related to username'}`
            );
        }

        // Second, if the form is schema-valid and password is decent...
        // We check if the username is already taken.
        const [existingUser] = await db
            .select()
            .from(userTable)
            .where(eq(userTable.username, form.data.username));

        if (existingUser) {
            return setError(form, 'username', 'This username is already taken');
        }

        // If it's not (for now, at least),
        //  We check if the user've made too many requests - limit him if that's the case.
        const status = await limiter.check(event);
        const forN = Math.ceil(status.retryAfter / 60);
        if (status.limited) {
            return setError(
                form,
                'username',
                `Wait ~${forN} ${forN === 1 ? 'minute' : 'minutes'}. Too many requests`
            );
        }

        // ...Everything seems fine here.
        // Let's generate userId and get the password hash.
        const userId = generateIdFromEntropySize(10);
        const passwordHash = await hash(form.data.password, argonSettings);

        // Creating a user.
        try {
            await db.transaction(async (tx) => {
                await tx.insert(userTable).values({
                    id: userId,
                    username: form.data.username,
                    passwordHash: passwordHash,
                    twoFactorSecret: null
                });

                await tx.insert(pfpTable).values({
                    userId: userId
                });
            });
        } catch (error) {
            return setError(form, 'username', 'Sorry, this username just got taken');
        }

        // ...So, we've made a user. Now, let's make a session.
        const session = await lucia.createSession(userId, {
            passedTwoFactor: false
        });
        // And set a session cookie.
        const sessionCookie = lucia.createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });

        // Basic sign up done.
        //  Now, redirect - so the user can set up the necessary 2factor.
        redirect(303, '/signup/factor');
    }
};
