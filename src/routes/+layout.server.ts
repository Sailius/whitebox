export const load = async ({ locals }) => {
    //  If there is a user with a basic session at least...
    if (locals.user) {
        // Pass username to the shared page data.
        return {
            username: locals.user.username
        };
    }
};
