<script lang="ts">
    import { page } from '$app/stores';
    import CheckboxShelf from '../CheckboxShelf.svelte';
    import BookList from '../BookList.svelte';
    import Description from '../Description.svelte';
    import BookContent from './BookContent.svelte';

    // export let data;

    let library = [
        {
            id: 1,
            open: true,
            starOrder: 1,
            text: 'Life',
            books: [
                {
                    id: 1,
                    href: '/library/dfg',
                    text: 'job'
                },
                {
                    id: 2,
                    href: '/library/sg',
                    text: 'hobby'
                }
            ]
        },
        {
            id: 2,
            open: false,
            starOrder: null,
            text: 'This one is in english',
            books: []
        }
    ];

    let deleteShelf = false;
</script>

<div class="grid">
    <div class="library">
        <header aria-current={$page.url.pathname === '/library'}>
            <a href="/library">~Library~</a>
            <button class="plus" />
        </header>
        {#each library as shelf (shelf.id)}
            <div class="shelf">
                <div class="shelfNameLine">
                    <CheckboxShelf
                        id={`shelf_${shelf.id}`}
                        text={shelf.text}
                        bind:checked={shelf.open}
                    />
                    <div class="points">
                        <button
                            on:click={() => {
                                shelf.starOrder = shelf.starOrder === null ? 1 : null;
                            }}
                            class:marked={shelf.starOrder}
                            class="star"
                        />
                        <button
                            class="gear"
                            on:click={() => {
                                deleteShelf = !deleteShelf;
                            }}
                        />
                        <button class="plus" class:deleteShelf />
                    </div>
                </div>
                <BookList {shelf} />
            </div>
        {/each}
    </div>
    <div class="content">
        {#if $page.url.pathname !== '/library'}
            <BookContent />
        {:else}
            <Description />
        {/if}
    </div>
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: 250px 1.5rem auto;
        grid-area: 1 / 1 / 3 span / 2 span;
    }

    .library {
        position: relative;
        grid-column: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        width: 100%;
        height: 100%;
        background-color: var(--color-bg-2);
        padding: 0.5rem;
    }

    .library > header {
        /* position: relative; */
        display: flex;
        align-self: center;
        color: var(--color-fg-3);
        transition: 0.25s ease;
    }

    .library > header > a {
        transition: 0.25s ease;
    }

    .library > header > .plus {
        position: absolute;
        right: 0.5rem;
    }

    .library > header[aria-current='true'] {
        color: var(--color-fg-1);
    }

    .library > header[aria-current='false'] > a:hover {
        color: var(--color-fg-2);
    }

    .shelf {
        display: flex;
        flex-direction: column;
        user-select: none;
    }

    .shelfNameLine {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        width: 100%;
        gap: 0.25rem;
    }

    .shelfNameLine:hover > .points {
        visibility: visible;
        opacity: 1;
    }

    .points {
        visibility: hidden;
        opacity: 0;
        display: flex;
        gap: 0.1rem;
        transition: 0.1s ease;
    }

    button {
        cursor: pointer;
        width: 1.1rem;
        height: 1.1rem;
        background-color: var(--color-fg-3);
        transition: 0.25s ease;
        padding: 0;
        border-radius: unset;
        box-shadow: none;
    }

    .gear:hover,
    .plus:hover,
    .star:hover {
        background-color: var(--color-fg-2);
    }

    .gear:hover {
        transform: rotate(-90deg) scale(0.9);
    }

    .gear {
        mask-image: url(/svg/gear.svg);
        transform: scale(0.9);
    }

    .plus {
        mask-image: url(/svg/plus.svg);
        transform: scale(0.65);
    }

    .plus.deleteShelf {
        background-color: var(--color-fg-red);
        transform: scale(0.7) rotate(-45deg);
    }

    .star {
        mask-image: url(/svg/star.svg);
        transform: scale(0.8);
    }

    .star.marked {
        background-color: var(--color-fg-1);
    }

    .content {
        grid-column: 3;
        display: grid;
        grid-template-rows: auto 0.25rem 100px 0.25rem;
    }
</style>
