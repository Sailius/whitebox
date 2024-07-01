<script lang="ts">
    import BlockAvatar from './BlockAvatar.svelte';
    import BlockBackground from './BlockBackground.svelte';
    import BlockSliders from './BlockSliders.svelte';
    import BlockLogout from './BlockLogout.svelte';
    
    export let data;
</script>

<BlockAvatar username={data.username} data={data.form} defaultData={data.defaultPfpBlock} />
<BlockBackground username={data.username} />
<BlockSliders username={data.username} />
<BlockLogout username={data.username}/>
