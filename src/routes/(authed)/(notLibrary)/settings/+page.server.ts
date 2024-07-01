import { pfpSchema } from '$lib/form_schemas.js';
import { lucia } from '$lib/server/auth';
import { db, pfpTable } from '$lib/server/db';
import { setOpacity } from '$lib/usefulFunctions';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
    const { defaultPfpBlock } = await event.parent();

    const form = await superValidate(defaultPfpBlock, zod(pfpSchema));

    return { form, defaultPfpBlock };
};

export const actions = {
    setPfp: async (event) => {
        // Validating the form.
        const form = await superValidate(event.request, zod(pfpSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        await db
            .update(pfpTable)
            .set({
                angle: form.data.angle,
                color1: setOpacity(form.data.color1, form.data.opacity1),
                color2: setOpacity(form.data.color2, form.data.opacity2)
            })
            .where(eq(pfpTable.userId, event.locals.user!.id));
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
