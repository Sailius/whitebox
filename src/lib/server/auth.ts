// Svelte / SvelteKit: https://kit.svelte.dev/.
import { dev } from '$app/environment';
// Lucia v3: https://lucia-auth.com/.
import { Lucia } from 'lucia';
import { adapter } from '$lib/server/db';

// Setting lucia auth up.
export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // Set to `true` when using HTTPS!
            secure: !dev
        }
    },
    // This getters are usually a must-set to accompany the register interface.
    // They are tied with what kind of info is returned when validating session, for example.
    // Don't expose anything sensitive.
    getUserAttributes: (attributes: DatabaseUserAttributes) => {
        return {
            // Like password hash...
            username: attributes.username,
            // Or the secret of 2fa itself...
            //  Rather show whether if the user has set it up.
            confirmedTwoFactor: attributes.confirmedTwoFactor
        };
    },
    getSessionAttributes(attributes: DatabaseSessionAttributes) {
        return {
            passedTwoFactor: attributes.passedTwoFactor
        };
    }
});

/**
 * This one registers additional (outside of ones expected by lucia) attributes
 *  to users & sessions that lucia can get access to.
 *
 * For sessions... don't really hide anything?
 *      You should NOT have anything sensitive there in the first place.
 */
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
    }
}

interface DatabaseUserAttributes {
    username: string;
    confirmedTwoFactor: boolean;
}

interface DatabaseSessionAttributes {
    passedTwoFactor: boolean;
}
