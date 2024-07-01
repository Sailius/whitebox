import Dexie, { type EntityTable } from 'dexie';

interface Settings {
    username: string;
    background: {
        isPicture: boolean;
        darkening: number;
    };
    treeView: boolean;
}

const idb = new Dexie('Local') as Dexie & {
    settings: EntityTable<
        Settings,
        'username' // Primary key "username" (for the typings only)
    >;
};

// Schema declaration:
idb.version(1).stores({
    settings: '&username' // primary key "username" (for the runtime!), no indexed stuff.
});

export type { Settings };

export { idb };
