<!--
    In this layout we set the available space for a page-content to an entire screen.
    Usually (NOT sign pages) page-content space need to be restricted,
        leaving 2 grid-columns: one to set a gap between left corner and page-content,
        another - to place a navigation + set a gap between navigation and page-content.
-->

<script lang="ts">
    import { browser } from "$app/environment";

    let bodyNode: HTMLBodyElement | null;
    $: bodyNode = browser ? document.querySelector('body') : null;

    $: if (bodyNode) {
        bodyNode.classList.add('backgroundOnHide');
        setTimeout(() => {
            bodyNode.classList.remove('backgroundOnHide');
            bodyNode.classList.remove('picture');
        }, 400);
    }
</script>

<div class="sign">
    <slot />
</div>

<style>
    .sign {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-area: 1 / 1 / 3 span / 3 span;
    }
    .sign > :global(div) {
        place-self: center center;
    }
</style>
