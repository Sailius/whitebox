<script lang="ts">
    export let grow = false;
    export let widthPx500 = false;
    export let width100 = false;
    export let heightRem12 = false;
    export let heightFit = false;
    export let mobile_width100 = false;
    export let mobile_height100 = false;
</script>

<!--
@component
This is a block with 'bg-2' background and round corners.
Used for containing the main content on the page.

Content of the Block must be wrapped into a single div. This div's css should locate the content.

And the practice here is to wrap that main div with svelte:fragment.

Use attributes to set width, height and some other available properties of the Block.

Attributes with 'mobile_' prefix work for (max-width <= 768px).
-->

<div
    class:grow
    class:widthPx500
    class:width100
    class:heightRem12
    class:heightFit
    class:mobile_width100
    class:mobile_height100
>
    <slot />
</div>

<style>
    div {
        display: grid;
        align-items: center;
        min-width: fit-content;
        border-radius: 1rem;
        overflow: hidden;
        background-color: var(--color-bg-2);
        color: var(--color-fg-1);
        padding: 0.75rem;
    }

    .grow {
        flex-grow: 1;
    }

    .widthPx500 {
        width: 500px;
    }

    .width100 {
        width: 100%;
    }

    .heightRem12 {
        height: 12rem;
    }

    .heightFit {
        height: fit-content;
    }

    @media (max-width: 768px) {
        .mobile_width100 {
            width: 100% !important;
        }

        .mobile_height100 {
            height: 100% !important;
        }
    }
</style>
