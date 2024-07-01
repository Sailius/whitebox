<script lang="ts">
    import { onMount } from 'svelte';

    export let id: string;
    export let form: string | undefined = undefined;
    export let checked = false;

    let eye: HTMLSpanElement;
    let applyAnimation = false;

    const scaleEye = (event: Event) => {
        applyAnimation = true;
        setTimeout(() => {
            applyAnimation = false;
        }, 500);
    };

    onMount(() => {
        eye.addEventListener('click', scaleEye);
        return () => {
            eye.removeEventListener('click', scaleEye);
        };
    });
</script>

<label class="checkbox">
    <input type="checkbox" {id} {form} bind:checked />
    <span bind:this={eye} class:applyAnimation />
</label>

<style>
    label {
        cursor: pointer;
        width: fit-content;
    }

    input {
        position: absolute;
        z-index: -1;
        opacity: 0;
    }

    span {
        display: flex;
        flex-shrink: 0;
        flex-grow: 0;
        width: 1.5rem;
        height: 1.5rem;
        align-items: center;
        background-color: var(--color-fg-1);
        mask-image: url(/svg/eye.svg);
        mask-size: 140%;
        mask-position: center;
        user-select: none;
        transition: 0.25s ease;
    }

    /* HOVER */
    label > input:not(:disabled):not(:checked) + span:hover {
        background-color: var(--color-fg-3);
    }

    /* CHECKED */
    label > input:checked + span {
        background-color: var(--color-fg-red);
    }

    /* DISABLED */
    label > input:disabled + span {
        background-color: var(--color-contrast-bg-1);
    }

    /* CLICKED ON */
    .applyAnimation {
        animation: animateEye 0.5s;
    }

    @keyframes animateEye {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(0.8);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
