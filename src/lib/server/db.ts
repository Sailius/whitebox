// Node postgres: https://node-postgres.com/.
import pg from 'pg';
// Lucia v3 + drizzle orm: https://lucia-auth.com/ + https://orm.drizzle.team/.
import { boolean, pgTable, smallint, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
// Constants.
import { DB_NAME, DB_PORT, DB_HOST, DB_PASSWORD, DB_USER } from '$env/static/private';

// Read this: https://node-postgres.com/features/pooling.
const pool = new pg.Pool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: +DB_PORT,
    database: DB_NAME
});

// 'Activate' drizzle.
export const db = drizzle(pool);

// Tables:
export const userTable = pgTable('user', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    twoFactorSecret: text('two_factor_secret'),
    confirmedTwoFactor: boolean('confirmed_two_factor').notNull().default(false),
    reservedAt: timestamp('reserved_at', {
        withTimezone: true,
        mode: 'date'
    })
        .notNull()
        .defaultNow()
});

export const sessionTable = pgTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => userTable.id),
    passedTwoFactor: boolean('passed_two_factor').notNull(),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date'
    }).notNull()
});

export const pfpTable = pgTable('user_profile_picture', {
    userId: text('user_id')
        .primaryKey()
        .references(() => userTable.id),
    angle: smallint('angle').notNull().default(45),
    color1: text('color_1').notNull().default('#888888ff'),
    color2: text('color_2').notNull().default('#00000000')
});

export const libraryTable = pgTable(
    'user_shelfs',
    {
        shelfId: text('shelf_id').primaryKey(),
        userId: text('user_id')
            .notNull()
            .references(() => userTable.id),
        shelfName: text('shelf_name').notNull(),
        shelfOrder: smallint('shelf_order').notNull(),
        shelfStarOrder: smallint('shelf_star_order')
    },
    (table) => ({
        uniqueTogetherName: unique('uniqueName').on(table.userId, table.shelfName),
        uniqueTogetherOrder: unique('uniqueOrder').on(table.userId, table.shelfOrder)
    })
);

export const shelfTable = pgTable(
    'shelf_books',
    {
        bookId: text('book_id').primaryKey(),
        shelfId: text('shelf_id')
            .notNull()
            .references(() => libraryTable.shelfId),
        bookName: text('book_name').notNull(),
        bookOrder: smallint('shelf_order').notNull()
    },
    (table) => ({
        uniqueTogetherName: unique('uniqueName').on(table.shelfId, table.bookName),
        uniqueTogetherOrder: unique('uniqueOrder').on(table.shelfId, table.bookOrder)
    })
);

export const bookTable = pgTable('book_content', {
    noteId: text('note_id').primaryKey(),
    bookId: text('book_id')
        .notNull()
        .references(() => shelfTable.bookId),
    noteContent: text('note_content').notNull(),
    isPinned: boolean('is_pinned').notNull().default(false),
    createdAt: timestamp('created_at', {
        withTimezone: true,
        mode: 'date'
    })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', {
        withTimezone: true,
        mode: 'date'
    })
        .notNull()
        .defaultNow()
});

// Adapter for lucia-auth:
export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);
