<div class="library">
    <div class="image" />
</div>

<style>
    .library {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3rem;
        height: 2rem;
        max-width: 3rem;
        max-height: 2rem;
        overflow: hidden;
        user-select: none;
    }

    .library > .image {
        height: 100%;
        width: 2rem;
        mask: url(/svg/openedBook.svg) no-repeat;
        background-color: var(--color-fg-2);
        transform: scale(1.45);
        transition: 0.25s ease;
    }

    .library:hover > .image {
        background-color: var(--color-fg-3);
    }
</style>
