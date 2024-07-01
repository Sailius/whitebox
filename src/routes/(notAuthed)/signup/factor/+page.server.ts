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
import { base32, encodeHex, decodeHex } from 'oslo/encoding';
import { createTOTPKeyURI, TOTPController } from 'oslo/otp';
// Rate Limiter: https://github.com/ciscoheat/sveltekit-rate-limiter.
import { UsernameRateLimiter } from '$lib/server/limiters.js';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';

//  The counter rises only if submitted form is schema-valid.
const limiter = new RetryAfterRateLimiter<{ username: string }>({
    // Five attempts to confirm the factor for the same username allowed - then limit for 15m.
    plugins: [new UsernameRateLimiter([5, '15m'])],
    // Five requests from the same IP + User Agent allowed - then limit for 15m.
    IPUA: [5, '15m'],
    // Ten requests from the same IP allowed - then limit for 1h.
    IP: [10, 'h']
});

export const load = async ({ locals }) => {
    // Basically, turning on Super Forms.
    const form = await superValidate(zod(factorCodeSchema));

    // Variable for the 2factor secret.
    let twoFactorSecret: Uint8Array;

    // Let's see if we've already created 2factor secret.
    const [existing] = await db
        .select({
            secret: userTable.twoFactorSecret
        })
        .from(userTable)
        .where(eq(userTable.id, locals.user!.id));

    /**
     *  If we have an existing (previously created) secret,
     *  we just put the decoded value from db to the twoFactorSecret variable.
     *
     *  And if we don't have an existing secret,
     *  we create twoFactorSecret and put it's encoded value to the db.
     */
    if (existing.secret) {
        twoFactorSecret = decodeHex(existing.secret);
    } else {
        twoFactorSecret = crypto.getRandomValues(new Uint8Array(20));
        await db
            .update(userTable)
            .set({ twoFactorSecret: encodeHex(twoFactorSecret) })
            .where(eq(userTable.id, locals.user!.id));
    }

    // Now, let's create TOTPKeyURI to pass it to the client,
    //  so it can render QR code from it and show it to the user.
    const factorQr = createTOTPKeyURI('Whitebox', locals.user!.username, twoFactorSecret);
    //  ...Here we pass the website's name-^

    // And here, let's encode 2factor secret in base32...
    //  So users that can't scan the QR could still set 2factor using this info.
    const factorBase = base32.encode(twoFactorSecret);

    /**
     * Returning all the info (for QR and for users that are unable to scan QR).
     *
     * // Unless you call the SvelteKit redirect or error functions,
     * //  you should always return the { form, ..? } object to the client.
     */
    return { form, factorQr, factorBase };
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

        //  Second, let's get user's 2factor secret from the db.
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
            // Let's update the user table, saying that 2factor is confirmed now.
            await db
                .update(userTable)
                .set({
                    confirmedTwoFactor: true
                })
                .where(eq(userTable.id, event.locals.user!.id));

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
            throw new Error('2FA sign up went wrong.');
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
