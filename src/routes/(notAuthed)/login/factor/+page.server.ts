// Svelte / SvelteKit: https://kit.svelte.dev/.
import { fail, redirect } from '@sveltejs/kit';
// SuperForms: https://superforms.rocks/get-started.
import { setError, superValidate } from 'sveltekit-superforms';
import { factorCodeSchema } from '$lib/form_schemas.js';
import { zod } from 'sveltekit-superforms/adapters';
// Lucia v3 + drizzle orm: https://lucia-auth.com/ + https://orm.drizzle.team/.
import { db, userTable } from '$lib/server/db';
import { lucia } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
// + oslo: https://oslo.js.org/reference/encoding/.
import { decodeHex } from 'oslo/encoding';
import { TOTPController } from 'oslo/otp';
// Rate Limiter: https://github.com/ciscoheat/sveltekit-rate-limiter.
import { UsernameRateLimiter } from '$lib/server/limiters.js';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';

/**
 * ACTIONS ARE ALMOST FULLY COPY+PASTE FROM '/signup/factor/+page.server.ts'!
 *   - Why? Could just reference the original in '+page.svelte'.
 *   - Well... handle hook fully isolates each 2factor page, so can't reference anything else.
 *       (And I decided to keep this behaviour because it's quite convenient in every other way).
 *   - What are the differences then?
 *   - No section when we set 2factor to confirmed (user table). We know it at this point.
 *       And also 'throw new Error' part. We say that '2FA login went wrong.' not 'sign up'.
 *   - And that's it?
 *   - ...Yeah, that's it. Mmm, the limiter is a tiny bit different
 *       but only outside of actions (section right below this comment).
 */

//  The counter rises only if submitted form is schema-valid.
const limiter = new RetryAfterRateLimiter<{ username: string }>({
    // Five attempts to pass the factor for the same username allowed - then limit for 1h.
    plugins: [new UsernameRateLimiter([5, 'h'])],
    // Five requests from the same IP + User Agent allowed - then limit for 15m.
    IPUA: [5, '15m'],
    // Ten requests from the same IP allowed - then limit for 1h.
    IP: [10, 'h']
});

export const load = async () => {
    // Basically, turning on Super Forms.
    const form = await superValidate(zod(factorCodeSchema));

    // Unless you call the SvelteKit redirect or error functions,
    //  you should always return the { form, ..? } object to the client.
    return { form };
};

export const actions = {
    verifyCode: async (event) => {
        // Validating the form.
        const form = await superValidate(event.request, zod(factorCodeSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        // If submitted form is schema-valid...
        // First, let's check if the user've made too many requests - limit him if that's the case.
        const status = await limiter.check(event, { username: event.locals.user!.username });
        const forN = Math.ceil(status.retryAfter / 60);
        if (status.limited) {
            return setError(
                form,
                'code',
                `Wait ~${forN} ${forN === 1 ? 'minute' : 'minutes'}. Too many requests`
            );
        }

        // Second, let's get user's 2factor secret from the db.
        const [result] = await db
            .select({
                secret: userTable.twoFactorSecret
            })
            .from(userTable)
            .where(eq(userTable.id, event.locals.user!.id));

        // If somehow there is none - fail.
        if (!result.secret) {
            return fail(400, { form });
        }

        // ..So there is some.
        //  Let's check if what user sent to us can pass the validity test.
        const validOTP = await new TOTPController().verify(
            form.data.code.toString(),
            decodeHex(result.secret)
        );

        if (!validOTP) {
            return setError(form, 'code', 'Incorrect');
        }

        // Seems like 2factor is valid.
        try {
            // Now, invalidate current basic session.
            await lucia.invalidateSession(event.locals.session!.id);
            // And create new one with the info that user have passed 2factor.
            //  Not updating cookie, because using the same session id for recreation.
            await lucia.createSession(
                event.locals.session!.userId,
                { passedTwoFactor: true },
                { sessionId: event.locals.session!.id }
            );
        } catch (error) {
            throw new Error('2FA login went wrong.');
        }

        // Redirect our full-authed user to the home page.
        redirect(303, '/settings');
    },

    logout: async ({ cookies, locals }) => {
        // If no session somehow - fail.
        if (!locals.session) {
            return fail(401);
        }

        // So, there is session - let's invalidate it...
        await lucia.invalidateSession(locals.session.id);
        // And clear the session cookie.
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });

        // Everything is done - redirect to the login page (user is not authed now).
        redirect(303, '/login');
    }
};
