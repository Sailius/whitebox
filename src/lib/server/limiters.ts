// Svelte / SvelteKit: https://kit.svelte.dev/.
import type { RequestEvent } from '@sveltejs/kit';
// Rate Limiter: https://github.com/ciscoheat/sveltekit-rate-limiter.
import type { Rate, RateLimiterPlugin } from 'sveltekit-rate-limiter/server';

// This limiter depends on the username that was passed.
export class UsernameRateLimiter implements RateLimiterPlugin {
    readonly rate: Rate;

    constructor(rate: Rate) {
        this.rate = rate;
    }

    async hash(_: RequestEvent, extraData: { username: string }) {
        return extraData.username;
    }
}
