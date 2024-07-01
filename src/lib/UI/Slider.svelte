<script lang="ts">
    export let text = '';

    export let checked = false;
    export let onSlide = () => {};

    let sliderNode: HTMLElement;

    const toggleOnEnter = (event: KeyboardEvent) => {
        if (event.key === "Enter" && sliderNode) {
            sliderNode.click();
        }
    }
</script>

{#if text !== ''}
    <div class="slider_with_text">
        <div>{text}</div>
        <label class="switch">
            <input type="checkbox" bind:checked on:change={onSlide} />
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
                class="slider"
                tabindex={0}
                bind:this={sliderNode}
                on:keypress={toggleOnEnter}
            ></span>
        </label>
    </div>
{:else}
    <label class="switch">
        <input type="checkbox" bind:checked on:change={onSlide}/>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
            class="slider"
            bind:this={sliderNode}
            on:keypress={toggleOnEnter}
        ></span>
    </label>
{/if}

<style>
    .slider_with_text {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.625rem;
        white-space: nowrap;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 3rem;
        height: 1.5rem;
    }

    .switch > input {
        display: none;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--color-contrast-bg-1);
        border-radius: 1.5rem;
        box-shadow: inset 0 0 0.25rem var(--color-bg-1);
        transition: 0.25s ease;
    }

    .slider:before {
        position: absolute;
        content: '';
        height: 1.25rem;
        width: 1.25rem;
        left: 0.125rem;
        bottom: 0.125rem;
        background-color: var(--color-contrast-bg-1);
        border-radius: 50%;
        box-shadow: inset 0 0 1rem var(--color-fg-1);
        transition: 0.25s ease;
    }

    .switch > input:checked + .slider {
        background-color: var(--color-bg-3);
    }

    .switch > input:checked + .slider:before {
        background-color: var(--color-bg-3);
        transform: translateX(1.5rem);
    }
</style>
