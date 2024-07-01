<script lang="ts">
    import { browser } from '$app/environment';
    import Account from '$lib/UI/Navigation/Account.svelte';
    import Desks from '$lib/UI/Navigation/Desks.svelte';
    import Library from '$lib/UI/Navigation/Library.svelte';
    import Messages from '$lib/UI/Navigation/Messages.svelte';
    import Public from '$lib/UI/Navigation/Public.svelte';
    import { idb } from '$lib/idb.js';
    import { setOpacity } from '$lib/usefulFunctions';
    import { liveQuery } from 'dexie';
    import { onMount } from 'svelte';

    export let data;

    const setLocalSettings = async () => {
        try {
            const establishedSettings = await idb.settings.where({
                username: data.username
            }).first();

            if (!establishedSettings) { 
                await idb.settings.add({
                    username: data.username,
                    background: {
                        isPicture: true,
                        darkening: 75
                    },
                    treeView: false
                });
            }
        } catch (error) {
            console.log(error)
        }
    };
    
    let settings = liveQuery(() => idb.settings.where('username').equals(data.username!).first());

    $: bodyNode = browser ? document.querySelector('body') : null;

    $: {
        if ($settings && $settings.background.isPicture && bodyNode) {
            bodyNode.classList.add('picture');
            bodyNode.style.setProperty(
                '--color-bg-coat',
                setOpacity('#000000', $settings.background.darkening)
            );
        } else if ($settings && bodyNode) {
            bodyNode.classList.add('backgroundOnHide');
            setTimeout(() => {
                bodyNode.classList.remove('backgroundOnHide');
                !$settings.background.isPicture ? bodyNode.classList.remove('picture') : null;
            }, 400);
        }
    }

    onMount(() => {
        setLocalSettings();
    });
</script>

<nav>
    <a href="/settings" class="account">
        <Account
            angle={data.defaultPfpBlock.angle}
            color1={setOpacity(data.defaultPfpBlock.color1, data.defaultPfpBlock.opacity1)}
            color2={setOpacity(data.defaultPfpBlock.color2, data.defaultPfpBlock.opacity2)}
        />
    </a>
    <a href="/library">
        <Library />
    </a>
    <a href="/" class="desks">
        <Desks />
    </a>
    <a href="/" class="messages">
        <Messages />
    </a>
    <a href="/" class="public">
        <Public />
    </a>
</nav>

<slot />

<style>
    nav {
        position: fixed;
        right: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
        width: 3rem;
        height: 100%;
        background-color: var(--color-bg-2);
        padding: 0.625rem 0;
    }
</style>
