<script lang="ts">
    import { enhance } from '$app/forms';
    import { idb } from '$lib/idb';
    import Block from '$lib/UI/Blocks/Block.svelte';

    export let username: string = '';

    const clearIndexedDb = (event: SubmitEvent) => {
        event.preventDefault();
        idb.settings.delete(username);
        const formNode = event.target as HTMLFormElement;
        formNode.submit();
    };
</script>

<Block heightRem12 grow>
    <svelte:fragment>
        <div class="buttons">
            <form method="POST" action="?/logout" on:submit={clearIndexedDb} use:enhance>
                <button>Log out</button>
            </form>
        </div>
    </svelte:fragment>
</Block>

<style>
    .buttons {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    .buttons > form {
        width: fit-content;
    }
</style>
