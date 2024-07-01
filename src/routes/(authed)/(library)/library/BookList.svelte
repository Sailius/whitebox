<script lang="ts">
    import { page } from "$app/stores";

    export let shelf: {
        id: number;
        open: boolean;
        text: string;
        books: {
            id: number;
            href: string;
            text: string;
        }[];
    };
</script>

<div class="books">
    {#each shelf.books as book (book.id)}
        {#if shelf.open || (!shelf.open && $page.url.pathname === book.href)}
            <a
                class="book"
                href={book.href}
                aria-current={$page.url.pathname === book.href}
            >
                <div class="book_image" />
                {book.text}
                <button class="gear_image" on:click={(e) => {
                    e.preventDefault();
                }}/>
            </a>
        {/if}
    {/each}
</div>

<style>
    .books {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-weight: 400;
        color: var(--color-fg-2);
        padding-top: 0.25rem;
    }

    .book {
        display: flex;
        align-items: center;
        position: relative;
        gap: 0.25rem;
        border-radius: 0.25rem;
        padding: 0 0.25rem;
    }

    .book:hover {
        background-color: var(--color-bg-3);
    }

    .book:hover > .gear_image {
        visibility: visible;
        opacity: 1;
    }

    .book[aria-current='true'] {
        background-color: var(--color-fg-1);
        color: var(--color-bg-1);
    }

    .book[aria-current='true'] > .book_image {
        background-color: var(--color-bg-1);
    }

    .book[aria-current='true'] > .gear_image {
        background-color: var(--color-bg-1);
    }

    .book_image {
        background-color: var(--color-fg-1);
        mask: url(/svg/book.svg);
        width: 0.75rem;
        height: 0.75rem;
    }

    .gear_image {
        cursor: pointer;
        visibility: hidden;
        opacity: 0;
        position: absolute;
        right: 0.25rem;
        width: 1.1rem;
        height: 1.1rem;
        background-color: var(--color-fg-3);
        mask-image: url(/svg/gear.svg);
        transform: scale(0.9);
        transition: background-color 0.25s ease, transform 0.25s ease;
        padding: 0;
        border-radius: unset;
        box-shadow: none;
    }

    .gear_image:hover {
        background-color: var(--color-fg-1);
        transform: rotate(-90deg) scale(0.9);
    }
</style>