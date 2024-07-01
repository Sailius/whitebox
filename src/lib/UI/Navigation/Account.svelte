<script lang="ts">
    export let angle = 45;
    export let color1 = '#999999ff';
    export let color2 = '#00000000';

    let account: HTMLDivElement;

    $: if (account) {
        account.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }
</script>

<div class="account" bind:this={account}>
    <div class="image" />
</div>

<style>
    .account {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        overflow: hidden;
        user-select: none;
    }

    .account > .image {
        height: 100%;
        width: 100%;
        mask: url(/svg/account.svg) no-repeat;
        background-color: var(--color-fg-2);
        transition: 0.25s ease;
    }

    .account:hover > .image {
        background-color: var(--color-fg-1);
    }
</style>
