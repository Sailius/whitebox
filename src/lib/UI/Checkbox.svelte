<script lang="ts">
    export let id: string;
    export let text: string;
    export let form: string | undefined = undefined;
    export let name: string | undefined = undefined;
    export let checked = false;
</script>

<label>
    <input type="checkbox" {id} {form} {name} bind:checked />
    <span>{text}</span>
</label>

<style>
    label {
        cursor: pointer;
        display: flex;
        width: fit-content;
    }

    input {
        position: absolute;
        z-index: -1;
        opacity: 0;
    }

    span {
        display: inline-flex;
        align-items: center;
        color: var(--color-fg-3);
        font-size: 0.75rem;
        user-select: none;
        transition: 0.25s ease;
    }

    label > span::before {
        content: '';
        display: inline-block;
        width: 0.75rem;
        height: 0.75rem;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1.5px solid var(--color-bg-3);
        border-radius: 0.25em;
        margin-right: 0.5em;
        transition: 0.25s ease;
    }

    /* HOVER */
    label > input:not(:disabled):not(:checked) + span:hover::before {
        border-color: var(--color-fg-3);
    }

    /* CHECKED */
    label > input:checked + span::before {
        border-radius: 0.5em;
        border-color: var(--color-fg-1);
        background-color: var(--color-fg-1);
    }

    label > input:checked + span {
        color: var(--color-fg-2);
    }

    /* DISABLED */
    label > input:disabled + span::before {
        border-color: var(--color-contrast-bg-1);
    }
</style>
