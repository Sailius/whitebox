<script>
    import { page } from '$app/stores';
</script>

<div>
    <h1>{$page.status} {$page.error ? $page.error.message : ''}</h1>
    <h3><a href="/">Go to the home page...</a></h3>
</div>

<style>
    div {
        grid-area: 2 / 2 / 2 / 2;
        justify-self: center;
        align-self: center;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }

    h3 {
        color: var(--color-fg-3);
    }
</style>
