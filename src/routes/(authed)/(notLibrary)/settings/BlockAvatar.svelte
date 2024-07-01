<script lang="ts">
    import type { Infer, SuperValidated } from 'sveltekit-superforms';
    import type { PfpSchema } from '$lib/form_schemas';
    import { superForm } from 'sveltekit-superforms';
    import { setOpacity } from '$lib/usefulFunctions';
    import Block from '$lib/UI/Blocks/Block.svelte';
    import Account from '$lib/UI/Navigation/Account.svelte';
    import AvatarColorPicker from './AvatarColorPicker.svelte';

    export let username: string = '?';
    export let data: SuperValidated<Infer<PfpSchema>>;
    export let defaultData: {
        angle: number;
        color1: string;
        color2: string;
        opacity1: number;
        opacity2: number;
    };

    const { form, enhance } = superForm(data); // add delayed.

    const resetData = (event: Event) => {
        event.preventDefault();

        $form.angle = defaultData.angle;

        $form.color1 = defaultData.color1;
        $form.color2 = defaultData.color2;

        const difference1 = Math.abs($form.opacity1 - defaultData.opacity1);
        const difference2 = Math.abs($form.opacity2 - defaultData.opacity2);
        const timeForOneChange1 = 250 / difference1;
        const timeForOneChange2 = 250 / difference2;
        const changeTransparency1 = () => {
            if ($form.opacity1 < defaultData.opacity1) {
                $form.opacity1++;
                setTimeout(changeTransparency1, timeForOneChange1);
            } else if ($form.opacity1 > defaultData.opacity1) {
                $form.opacity1--;
                setTimeout(changeTransparency1, timeForOneChange1);
            }
        };

        const changeTransparency2 = () => {
            if ($form.opacity2 < defaultData.opacity2) {
                $form.opacity2++;
                setTimeout(changeTransparency2, timeForOneChange2);
            } else if ($form.opacity2 > defaultData.opacity2) {
                $form.opacity2--;
                setTimeout(changeTransparency2, timeForOneChange2);
            }
        };

        changeTransparency1();
        changeTransparency2();
    };

    let angle: number;
    let color1: string;
    let color2: string;

    $: {
        // as any as number is set so user can see a placeholder. Not always go to pre-set '0'.
        $form.angle =
            $form.angle !== Math.floor($form.angle) ? ('' as unknown as number) : $form.angle;
        $form.angle = $form.angle > 360 ? 360 : $form.angle;
        $form.angle = $form.angle < 0 ? 0 : $form.angle;
        angle = $form.angle;
    }

    $: {
        $form.opacity1 = $form.opacity1 > 100 ? 100 : Math.floor($form.opacity1);
        $form.opacity1 = $form.opacity1 < 0 ? 0 : $form.opacity1;
        $form.opacity2 = $form.opacity2 > 100 ? 100 : Math.floor($form.opacity2);
        $form.opacity2 = $form.opacity2 < 0 ? 0 : $form.opacity2;
        color1 = setOpacity($form.color1, $form.opacity1);
        color2 = setOpacity($form.color2, $form.opacity2);
    }
</script>

<Block heightRem12 grow>
    <svelte:fragment>
        <div class="grid">
            <div class="profile">
                <Account {angle} {color1} {color2} />
                {username}
            </div>
            <div class="change_pfp">
                <input
                    class="angle_pick"
                    type="number"
                    placeholder="Angle"
                    form={'setPfp'}
                    name={'angle'}
                    min={0}
                    max={360}
                    step={1}
                    bind:value={$form.angle}
                />
                <AvatarColorPicker
                    form={'setPfp'}
                    colorName={'color1'}
                    opacityName={'opacity1'}
                    bind:color={$form.color1}
                    bind:transparency={$form.opacity1}
                />
                <AvatarColorPicker
                    form={'setPfp'}
                    colorName={'color2'}
                    opacityName={'opacity2'}
                    bind:transparency={$form.opacity2}
                    bind:color={$form.color2}
                />
            </div>
            <form id="setPfp" class="buttons" method="post" action="?/setPfp" use:enhance>
                <button
                    disabled={(color1 === setOpacity(defaultData.color1, defaultData.opacity1) &&
                        color2 === setOpacity(defaultData.color2, defaultData.opacity2) &&
                        angle === defaultData.angle) ??
                        false}
                    on:click={resetData}>Reset</button
                >
                <button
                    disabled={(color1 === setOpacity(defaultData.color1, defaultData.opacity1) &&
                        color2 === setOpacity(defaultData.color2, defaultData.opacity2) &&
                        angle === defaultData.angle) ??
                        false}>Save</button
                >
            </form>
        </div>
    </svelte:fragment>
</Block>

<style>
    .grid {
        display: grid;
        grid-template-rows: 2.25rem auto 0.75rem 1.5rem;
        height: 100%;
    }

    .profile {
        grid-row: 1;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .change_pfp {
        grid-row: 2;
        display: grid;
    }

    .angle_pick {
        justify-self: center;
        width: 3.25rem;
        border-radius: 1.5rem;
        text-align: center;
    }

    .buttons {
        grid-row: 4;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }
</style>
