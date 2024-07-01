import { db, pfpTable } from '$lib/server/db';
import { getOpacity } from '$lib/usefulFunctions';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
    // if (!event.locals.session?.passedTwoFactor) {
    //     redirect(307, '/login/factor');
    // }

    const [rawPfpBlock] = await db
        .select({
            angle: pfpTable.angle,
            color1: pfpTable.color1,
            color2: pfpTable.color2
        })
        .from(pfpTable)
        .where(eq(pfpTable.userId, event.locals.user!.id));

    const defaultPfpBlock = {
        angle: rawPfpBlock.angle,
        color1: rawPfpBlock.color1.slice(0, -2),
        color2: rawPfpBlock.color2.slice(0, -2),
        opacity1: getOpacity(rawPfpBlock.color1),
        opacity2: getOpacity(rawPfpBlock.color2)
    };

    return { defaultPfpBlock };
};
