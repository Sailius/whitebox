<script lang="ts">
    import SignUp from '../SignUp.svelte';

    export let data;
</script>

<SignUp isLogin={true} data={data.form} />
