<script>
    import Block from "$lib/UI/Blocks/Block.svelte";

</script>
<div class="description">
    <Block width100 heightFit>
        <svelte:fragment>
            <div class="description_content">
                <header>'Library' is just a convenient way to organise your notes</header>
                <p><span class="plus" />: add new shelf / book.</p>
                <p><span class="gear" />: rename or remove shelf / book.</p>
                <p><span class="star" />: place shelf on the separated segment at the top.</p>
                <p>——————————————————</p>
                <p>Shelfs can be closed and opened on click.</p>
                <p>You can search through notes:</p>
                <ol>
                    <li>1. Here (covering an entire library).</li>
                    <li>2. Covering only an opened book.</li>
                </ol>
            </div>
        </svelte:fragment>
    </Block>
</div>

<style>
    .description {
        grid-row: 1 / 4 span;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
    }

    .description_content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .description_content > header {
        place-self: center;
        font-size: 1.2rem;
    }

    .description_content > p {
        display: flex;
        align-items: center;
    }

    .gear, .plus, .star {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background-color: var(--color-fg-1);
    }

    .gear {
        mask-image: url(/svg/gear.svg);
        transform: scale(0.9);
    }

    .plus {
        mask-image: url(/svg/plus.svg);
        transform: scale(0.65);
    }

    .star {
        mask-image: url(/svg/star.svg);
        transform: scale(0.8);
    }

    ol {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding-left: 1rem;
    }
</style>