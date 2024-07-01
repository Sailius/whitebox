<script lang="ts">
    // Importing types.
    import type { Instance, Props } from 'tippy.js';
    // Svelte / SvelteKit: https://kit.svelte.dev/.
    import { onMount } from 'svelte';
    import { enhance as svelteEnhance } from '$app/forms';
    // SuperForms: https://superforms.rocks/get-started.
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { factorCodeSchema } from '$lib/form_schemas.js';
    import { superForm } from 'sveltekit-superforms';
    // Tippy: https://atomiks.github.io/tippyjs/.
    import { createTippy, getErrorsBlock, standardTippy } from '$lib/UI/tippy.js';
    // QRCode: https://www.npmjs.com/package/qrcode.
    import QRCode from 'qrcode';
    // Components.
    import Block from '$lib/UI/Blocks/Block.svelte';

    // Data from the server.
    export let data;

    /**
     * factorCodeSchema - validation schema for the form.
     *
     *  form - using $form.param in form elements to bind to their values.
     *      This way they get seen and validated by SuperForms.
     *  errors - $errors.param show messages for the form element (param).
     *      This messages are tied (set) with steps of validation - user knows what went wrong.
     *  enhance - progressive enhancment by SuperForms.
     *      Check SvelteKit docs / tutorial to understand the principles.
     *      Tutorial: https://learn.svelte.dev/tutorial/progressive-enhancement.
     *  $delayed = 'true' if server isn't responding for 500ms.
     *      Amount of ms for this can be changed via: superForm(..., { ..., delayMS: number }).
     *      Usage: mount a spinner on true - active until user gets response.
     *
     *  validators -> client side validation by zodClient.
     *      Giving user an immidiate reaction on change. Not only on submission.
     *      Form element needs to fail validation at least once for this to activate.
     */
    const { form, errors, enhance, delayed } = superForm(data.form, {
        validators: zodClient(factorCodeSchema)
    });

    const qrPageUrlDataUrl = QRCode.toDataURL(data.factorQr, {
        // Refers to --color-bg-1 and --color-fg-1 in a dark theme.
        color: {
            dark: '#181819ff',
            light: '#eeeeeeff'
        }
    });

    // We'll bind here using 'bind:this' on an actual code-input node.
    let codeNode: HTMLInputElement;
    // Here we're gonna put our feedback if sent data is invalid.
    let codeTippy: Instance<Props>;

    /**
     * If tippy for username is defined and we have some errors:
     *  Putting errors info in tippy content then showing tippy.
     *
     *  Tippy for username is defined but no errors - hide the tippy.
     */

    $: if (codeTippy && $errors.code) {
        let tippyContent = getErrorsBlock($errors.code);

        codeTippy.setContent(tippyContent);
        codeTippy.show();
    } else if (codeTippy) {
        codeTippy.hide();
    }

    // Creating tippy after code node is defined (mounted).
    onMount(() => {
        codeTippy = createTippy(codeNode, { ...standardTippy, placement: 'left', maxWidth: 75 });

        // Not forgetting to destroy tippy on return.
        return () => {
            codeTippy.destroy();
        };
    });
</script>

<Block widthPx500 heightFit mobile_width100 mobile_height100>
    <svelte:fragment>
        <div class="grid">
            <h1>Scan the QR</h1>
            <h3>Use your Authenticator App</h3>
            <div class="qr_code">
                {#await qrPageUrlDataUrl then dataUrl}
                    <img src={dataUrl} alt="qr" width="180px" height="180px" />
                {/await}
            </div>
            <div>{data.factorBase}</div>
            <form class="verifyForm" method="post" action="?/verifyCode" use:enhance>
                <div class="loader">
                    {#if $delayed}
                        <img src="/svg/spinner.svg" alt="spinner" />
                    {/if}
                </div>
                <input
                    type="text"
                    name="code"
                    placeholder="Enter code from the app..."
                    bind:value={$form.code}
                    bind:this={codeNode}
                />
                <button />
            </form>
            <form class="logoutForm" method="post" action="?/logout" use:svelteEnhance>
                <button>...or just log out?</button>
            </form>
        </div>
    </svelte:fragment>
</Block>

<style>
    .grid {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .qr_code {
        width: 180px;
        height: 180px;
        border-radius: 1rem;
        overflow: hidden;
        user-select: none;
    }

    .verifyForm {
        position: relative;
        display: flex;
        flex-direction: row;
    }

    .verifyForm > .loader {
        position: absolute;
        left: -2rem;
        width: 1.5rem;
        height: 1.5rem;
    }

    .verifyForm > input[type='text'] {
        text-align: center;
    }

    .verifyForm > button {
        position: absolute;
        mask: url(/svg/sendRight.svg) no-repeat center;
        width: 2.5rem;
        top: 0;
        right: -2.5rem;
    }

    .logoutForm {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
        color: var(--color-fg-3);
    }

    .logoutForm > button {
        color: var(--color-fg-3);
        background-color: #00000000;
        padding: 0;
        transition: 0.25s ease;
    }

    .logoutForm > button:hover {
        color: var(--color-fg-2);
    }

    .logoutForm > button:active {
        transform: scale(1);
    }
</style>
