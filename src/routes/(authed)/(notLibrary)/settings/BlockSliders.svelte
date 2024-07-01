<script lang="ts">
    import { liveQuery } from 'dexie';
    import { idb } from '$lib/idb';
    import Block from '$lib/UI/Blocks/Block.svelte';
    import Slider from '$lib/UI/Slider.svelte';
    import { transparency } from './store';
    export let username: string = '';

    let once = false;
    let settings = liveQuery(() => idb.settings.where('username').equals(username).first());
    let backgroundIsPicture = true;
    let deskTreeView = false;

    $: if (!once && $settings) {
        once = true;
        backgroundIsPicture = $settings.background.isPicture;
        deskTreeView = $settings.treeView;
    }

    const toggleBgPicture = async () => {
        if ($settings) {
            const transparencyDifference = Math.abs($transparency - $settings.background.darkening);
            const timeForOneChange = 250 / transparencyDifference;
            const changeTransparency = () => {
                if ($transparency < $settings.background.darkening) {
                    $transparency++;
                    setTimeout(changeTransparency, timeForOneChange);
                } else if ($transparency > $settings.background.darkening) {
                    $transparency--;
                    setTimeout(changeTransparency, timeForOneChange);
                }
            };
            changeTransparency();
        }
        await idb.settings
            .where('username')
            .equals(username)
            .modify({ 'background.isPicture': backgroundIsPicture });
    };

    const toggleTreeView = async () => {
        await idb.settings.where('username').equals(username).modify({ treeView: deskTreeView });
    };
</script>

<Block heightRem12 grow>
    <svelte:fragment>
        <div class="settings">
            <Slider
                text={'Background as a picture'}
                bind:checked={backgroundIsPicture}
                onSlide={toggleBgPicture}
            />
            <Slider text={'Desk tree view'} bind:checked={deskTreeView} onSlide={toggleTreeView} />
        </div>
    </svelte:fragment>
</Block>

<style>
    .settings {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>
