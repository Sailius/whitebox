<script lang="ts">
    export let id: string;
    export let text: string;
    export let checked = false;
</script>

<label>
    <input type="checkbox" {id} bind:checked />
    <span class="shelf_text">
        <span>{text}</span>
    </span>
</label>

<style>
    label {
        cursor: pointer;
        display: flex;
        min-width: 0;
        width: 100%;
    }

    input {
        position: absolute;
        z-index: -1;
        opacity: 0;
    }

    .shelf_text {
        display: inline-flex;
        align-items: center;
        font-weight: 700;
        color: var(--color-fg-3);
        user-select: none;
        overflow: hidden;
        transition: 0.25s ease;
    }

    .shelf_text > span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    label > .shelf_text::before {
        content: '';
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        flex-shrink: 0;
        flex-grow: 0;
        background-color: var(--color-fg-3);
        mask: url(/svg/shelf.svg);
        margin-right: 0.5em;
        transition: 0.25s ease;
    }

    /* HOVER */
    label:hover > input:not(:disabled):not(:checked) + .shelf_text::before {
        background-color: var(--color-fg-2);
    }

    label:hover > input:not(:disabled):not(:checked) + .shelf_text {
        color: var(--color-fg-2);
    }

    /* CHECKED */
    label > input:checked + .shelf_text::before {
        background-color: var(--color-fg-1);
    }

    label > input:checked + .shelf_text {
        color: var(--color-fg-1);
    }
</style>
