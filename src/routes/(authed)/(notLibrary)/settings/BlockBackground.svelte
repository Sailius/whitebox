<script lang="ts">
    import { onMount } from 'svelte';
    import { liveQuery } from 'dexie';
    import { idb } from '$lib/idb';
    import { setOpacity } from '$lib/usefulFunctions';
    import Block from '$lib/UI/Blocks/Block.svelte';
    import { transparency } from './store';

    export let username: string = '';

    let once = false;
    let bodyDarkeningCoat: HTMLBodyElement;

    let settings = liveQuery(() => idb.settings.where('username').equals(username).first());

    $: if (!once && $settings) {
        once = true;
        $transparency = $settings.background.darkening;
    }

    const resetDarkening = () => {
        if ($settings) {
            const transparencyDifference = Math.abs($transparency - $settings.background.darkening);
            const timeForOneChange = 250 / transparencyDifference;
            const changeTransparency = () => {
                if ($transparency < $settings.background.darkening) {
                    $transparency++
                    setTimeout(changeTransparency, timeForOneChange);
                } else if ($transparency > $settings.background.darkening) {
                    $transparency--
                    setTimeout(changeTransparency, timeForOneChange);
                }
            }
            changeTransparency();
        }
    }

    const setDarkening = async () => {
        await idb.settings.where('username').equals(username!).modify(
            {"background.darkening": $transparency}
        );
    }

    $: if (bodyDarkeningCoat) {
        bodyDarkeningCoat.style.setProperty('--color-bg-coat', setOpacity('#000000', $transparency));
    }

    $: {
        $transparency = $transparency > 100 ? 100 : Math.floor($transparency);
        $transparency = $transparency < 0 ? 0 : $transparency;
    }

    onMount(() => {
        bodyDarkeningCoat = document.querySelector('body') as HTMLBodyElement;
    });
</script>

<Block heightRem12 grow>
    <svelte:fragment>
        <div class="grid">
            <header class:disable={
                !$settings?.background.isPicture ?? false}
            >Darken the background</header>
            <div class="content">
                <input
                    type="range"
                    step={1}
                    min={0}
                    max={100}
                    bind:value={$transparency}
                    disabled={!$settings?.background.isPicture ?? false}
                />
                <input
                    type="number"
                    step={1}
                    min={0}
                    max={100}
                    bind:value={$transparency}
                    disabled={!$settings?.background.isPicture ?? false}
                />
            </div>
            <div class="buttons">
                <button
                    disabled={(
                        $transparency === $settings?.background.darkening ||
                        !$settings?.background.isPicture) ?? false}
                    on:click={resetDarkening}
                >Reset</button>
                <button
                    disabled={(
                        $transparency === $settings?.background.darkening ||
                        !$settings?.background.isPicture) ?? false}
                    on:click={setDarkening}
                >Save</button>
            </div>
        </div>
    </svelte:fragment>
</Block>

<style>
    .grid {
        display: grid;
        grid-template-rows: 2.25rem auto 0.75rem 1.5rem;
        height: 100%;
    }

    header {
        grid-row: 1;
        align-self: center;
    }

    header.disable {
        color: var(--color-fg-3);
        user-select: none;
    }

    .content {
        grid-row: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    input[type='number'] {
        width: 3rem;
        text-align: center;
    }

    .buttons {
        grid-row: 4;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }
</style>
