<script lang="ts">
    import { afterUpdate } from 'svelte';

    export let form: string;
    export let colorName: string;
    export let opacityName: string;

    export let transparency: number = 0;
    export let color: string;

    let colorLabel: HTMLLabelElement;

    afterUpdate(() => {
        colorLabel.style.backgroundColor = color;
    });
</script>

<div class="color_pick">
    <label bind:this={colorLabel}>
        <input type="color" bind:value={color} {form} name={colorName} />
    </label>
    <input
        type="range"
        step={1}
        min={0}
        max={100}
        {form}
        name={opacityName}
        bind:value={transparency}
    />
    <input type="number" step={1} min={0} max={100} bind:value={transparency} />
</div>

<style>
    .color_pick {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    label {
        cursor: pointer;
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        box-shadow: inset 0 0 0.25rem #181819;
        background-color: #999;
    }

    label > input[type='color'] {
        visibility: hidden;
        width: 1.5rem;
        height: 1.5rem;
        margin-left: 1.5rem;
    }

    input[type='number'] {
        width: 3rem;
        text-align: center;
    }
</style>
