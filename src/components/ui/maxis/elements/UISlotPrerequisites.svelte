<script>
    export let prerequisites = []
    export let game
    export let debug = false
</script>

{#if !debug}<div class="title">Requires:</div>{/if}
{#each prerequisites as prerequisite}
    <div class="item">
        {debug?"R: ":""}{prerequisite}
    </div>
{/each}

<style>
    div.item {
        text-align: center;
    }
</style>
