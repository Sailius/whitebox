<script lang="ts">
    // Importing types.
    import type { SuperValidated, Infer } from 'sveltekit-superforms';
    import type { SignSchema } from '$lib/form_schemas';
    import type { Instance, Props } from 'tippy.js';
    // Svelte / SvelteKit: https://kit.svelte.dev/.
    import { onMount } from 'svelte';
    // SuperForms: https://superforms.rocks/get-started.
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { superForm } from 'sveltekit-superforms';
    import { signSchema } from '$lib/form_schemas.js';
    // Tippy: https://atomiks.github.io/tippyjs/.
    import { createTippy, getErrorsBlock, standardTippy } from '$lib/UI/tippy';
    // Components.
    import Block from '$lib/UI/Blocks/Block.svelte';
    import CheckboxSvg from '$lib/UI/CheckboxEye.svelte';

    /**
     * isLogin prop values:
     *  Login page? --> true.
     *  Signup page? --> false (default).
     */
    export let isLogin = false;

    // Getting data from the server, using SuperForms.
    export let data: SuperValidated<Infer<SignSchema>>;

    /**
     * signSchema - validation schema for the form.
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
    const { form, errors, enhance, delayed } = superForm(data, {
        validators: zodClient(signSchema)
    });

    // We'll bind here from <svelte:window> to know the width of the screen.
    let screenWidth: number;
    // We'll bind here using 'bind:this' on actual username & password input nodes.
    let usernameNode: HTMLInputElement;
    let passwordNode: HTMLInputElement;
    // Here we're gonna put our feedback if sent data is invalid.
    let usernameTippy: Instance<Props>;
    let passwordTippy: Instance<Props>;
    let usernameTippyMobile: Instance<Props>;
    let passwordTippyMobile: Instance<Props>;
    // This value is bind to the checkbox.
    let showPassword: boolean;

    // Showing entered password to the user if checkbox is checked.
    $: if (passwordNode && showPassword === true) {
        passwordNode.type = 'text';
    } else if (passwordNode) {
        passwordNode.type = 'password';
    }

    /**
     * If tippy for username is defined and we have some errors:
     *  Putting errors info in tippy content then showing tippy.
     *
     * Tippy for username is defined but no errors - hide the tippy.
     *
     * Note: Tippys for mobile version go up / down, regular - left / right.
     *  We show only one version of tippy at a time.
     */

    $: if (usernameTippy && usernameTippyMobile && $errors.username) {
        let tippyContent = getErrorsBlock($errors.username);

        if (screenWidth > 768) {
            usernameTippyMobile.hide();
            usernameTippy.setContent(tippyContent);
            usernameTippy.show();
        } else {
            usernameTippy.hide();
            usernameTippyMobile.setContent(tippyContent);
            usernameTippyMobile.show();
        }
    } else if (usernameTippy && usernameTippyMobile) {
        usernameTippy.hide();
        usernameTippyMobile.hide();
    }

    // Same as above but for the password.
    $: if (passwordTippy && passwordTippyMobile && $errors.password) {
        let tippyContent = getErrorsBlock($errors.password);

        if (screenWidth > 768) {
            passwordTippyMobile.hide();
            passwordTippy.setContent(tippyContent);
            passwordTippy.show();
        } else {
            passwordTippy.hide();
            passwordTippyMobile.setContent(tippyContent);
            passwordTippyMobile.show();
        }
    } else if (passwordTippy && passwordTippyMobile) {
        passwordTippy.hide();
        passwordTippyMobile.hide();
    }

    // Creating tippys after username and password nodes are defined (mounted).
    onMount(() => {
        usernameTippy = createTippy(usernameNode, { ...standardTippy, placement: 'right' });
        passwordTippy = createTippy(passwordNode, { ...standardTippy, placement: 'left' });
        usernameTippyMobile = createTippy(usernameNode, { ...standardTippy, placement: 'top' });
        passwordTippyMobile = createTippy(passwordNode, { ...standardTippy, placement: 'bottom' });

        // Not forgetting to destroy tippys on return.
        return () => {
            usernameTippy.destroy();
            passwordTippy.destroy();
            usernameTippyMobile.destroy();
            passwordTippyMobile.destroy();
        };
    });
</script>

<!--
@component
This is basically a page that was turned into a component.
All due to similarity between sign up and login pages.
Used only on this routes: '/signup' - as is, '/login' - isLogin = true.

Set an attribute (must): data={data.form}.

Contains: form ||| { username, password } ||| action: default.
-->

<svelte:window bind:innerWidth={screenWidth} />

<Block widthPx500 heightFit mobile_width100 mobile_height100>
    <svelte:fragment>
        <div class="grid">
            <header>
                <div class="loader">
                    {#if $delayed}
                        <img src="/svg/spinner.svg" alt="spinner" />
                    {/if}
                </div>
                <span>{isLogin ? 'Log in' : 'Sign up'}</span>
            </header>
            <input
                type="text"
                placeholder="Username"
                form="sign"
                name="username"
                aria-invalid={$errors.username ? 'true' : undefined}
                bind:value={$form.username}
                bind:this={usernameNode}
                autocomplete="username"
                required
            />
            <div class="password_row">
                <input
                    type="password"
                    placeholder="Password"
                    form="sign"
                    name="password"
                    aria-invalid={$errors.password ? 'true' : undefined}
                    bind:value={$form.password}
                    bind:this={passwordNode}
                    autocomplete={isLogin ? 'current-password' : 'new-password'}
                    required
                />
                <div class="show_password">
                    <CheckboxSvg id="showPassword" bind:checked={showPassword} />
                </div>
            </div>
            <form class="submit_row" id="sign" method="post" use:enhance>
                <button disabled={!($form.username && $form.password) ?? false}>Continue...</button>
            </form>
            <div class="another_sign_page_row">
                <a href="/">Home page</a> /
                <a href={isLogin ? '/signup' : '/login'}>
                    {isLogin ? 'Sign Up' : 'Log In'}
                </a>
            </div>
        </div>
    </svelte:fragment>
</Block>

<style>
    .grid {
        display: grid;
        grid-template-rows: repeat(3, 3rem) 3rem 1rem;
    }

    header {
        grid-row: 1;
        position: relative;
        justify-self: center;
        align-self: center;
        font-weight: 600;
        font-size: 1.25rem;
    }

    header > .loader {
        position: absolute;
        left: -2rem;
        width: 1.5rem;
        height: 1.5rem;
    }

    input {
        width: 300px;
        justify-self: center;
        align-self: center;
        padding: 0 10px 0 30px;
    }

    input[name='username'] {
        grid-row: 2;
        background: url('/svg/account.svg') no-repeat left var(--color-bg-3);
        background-size: 2rem;
    }

    .password_row {
        grid-row: 3;
        justify-self: center;
        align-self: center;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: fit-content;
        width: fit-content;
    }

    .password_row > input[name='password'] {
        background: url('/svg/key.svg') no-repeat left var(--color-bg-3);
        background-size: 2rem;
    }

    .password_row > .show_password {
        position: absolute;
        width: fit-content;
        right: -2rem;
    }

    .submit_row {
        grid-row: 4;
        justify-self: center;
        align-self: center;
    }

    .submit_row > button {
        border-radius: 1rem 5rem 3rem 1.5rem / 1.5rem 1.5rem 1.5rem 1.5rem;
    }

    .another_sign_page_row {
        grid-row: 5;
        justify-self: center;
        align-self: center;
        text-align: center;
        width: fit-content;
        color: var(--color-fg-3);
        font-size: 0.65rem;
        user-select: none;
    }

    .another_sign_page_row > a {
        cursor: pointer;
        transition: 0.25s ease;
    }

    .another_sign_page_row > a:hover {
        color: var(--color-fg-2);
    }

    @media (max-width: 768px) {
        input {
            width: 200px !important;
        }
    }
</style>
