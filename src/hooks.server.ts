import { lucia } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

/** Check SvelteKit docs if you're not aware of how handle hook works.
 *      Link: https://kit.svelte.dev/docs/hooks.
 *  We use lucia v3 for authentication.
 *      Check https://lucia-auth.com/ for more info.
 */

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get(lucia.sessionCookieName);

    // True if we're on sign up or login page.
    const isSignPage = event.url.pathname === '/login' || event.url.pathname === '/signup';
    // True if we're on sign up |or| login |or| landing page.
    const isSignOrLandingPage = isSignPage || event.url.pathname === '/';
    // True if we're on a 2factor page (either register or trying to login).
    const isFactorPage =
        event.url.pathname === '/login/factor' || event.url.pathname === '/signup/factor';

    // No session in cookies?
    if (!sessionId) {
        // And we're not on a login / sign up page?
        if (!isSignOrLandingPage) {
            // Go and log in.
            redirect(307, '/login');
        }

        // We're on login / sign up page?
        //  Setting user & session in 'locals' to null...
        //  so if we for some reason access 'locals' on sign up / login page,
        //      we know that there is no user yet.
        event.locals.user = null;
        event.locals.session = null;
        // We kinda have to resolve here so the following code knows for sure...
        //  That the sessionId is present.
        return resolve(event);
    }

    // Okay, we have a session cookie.
    //  Let's check if it's valid.
    const { session, user } = await lucia.validateSession(sessionId);

    // User is obiously active now, so if the session expires soon - we renew it.
    if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });
    }

    // Oh, and in case session was invalid...
    if (!session) {
        // We clear session cookie on the client side.
        const sessionCookie = lucia.createBlankSessionCookie();
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });

        // And if we're not on a login / sign up page...
        if (!isSignOrLandingPage) {
            // Go and log in.
            redirect(307, '/login');
        }
    }

    // If we have basic session (yay).
    if (user && session) {
        const isFactorSet = user.confirmedTwoFactor;
        const isFactorPassed = session.passedTwoFactor;

        // But our twoFactor isn't set yet...
        if (!isFactorSet) {
            // And we're not on a setting page (to avoid endless redirect).
            if (event.url.pathname !== '/signup/factor') {
                // Go and set it.
                redirect(307, '/signup/factor');
            }
            // If our twoFactor is set
        } else {
            // But yet to be passed...
            if (!isFactorPassed) {
                //  And we're not on a passning page (to avoid endless redirect).
                if (event.url.pathname !== '/login/factor') {
                    // Go and pass it.
                    redirect(307, '/login/factor');
                }
                // If we fully passed 2FA.
            } else {
                // But for some reason on some of this sign or factor pages...
                if (isSignPage || isFactorPage) {
                    // Go to the home page.
                    redirect(307, '/settings');
                }
            }
        }
    }

    // We're not on the wrong page.
    //  We have at least basic session.

    // Passing user & session to 'locals'.
    event.locals.user = user;
    event.locals.session = session;

    return resolve(event);
};
