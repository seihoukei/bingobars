<script>
    export let prerequisites = []
    export let debug = false
</script>

{#if debug}
    {#each prerequisites as prerequisite}
        <div class="debug">
            R: {prerequisite}
        </div>
    {/each}
{:else}
    <div class="title">Unlock</div>
    {#each prerequisites as prerequisite}
        <div class="item">
            {prerequisite}
        </div>
    {/each}
    <div class="title">to reveal</div>
{/if}

<style>
    div.title {
        font-size: 1.2em;
    }
    div.item {
        text-align: center;
        font-size: 1.5em;
    }

    div.debug {
        text-align: center;
    }
</style>
