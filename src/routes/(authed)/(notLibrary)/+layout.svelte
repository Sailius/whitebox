<div class="page">
    <slot />
</div>

<style>
    .page {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1.25rem;
        grid-area: 2 / 2 / 2 / 2;
        flex-wrap: wrap;
    }
</style>
