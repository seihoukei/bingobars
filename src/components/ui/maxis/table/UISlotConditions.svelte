<script>
    export let conditions = []
    export let game
    export let debug = 0
    export let custom = null

    $: visibleConditions = debug < 2 ? conditions.filter(x => !x.hidden) : conditions
</script>

{#if custom && debug < 2}
    <div class="item">
        {custom}
    </div>
{:else}
    {#each visibleConditions as condition}
        <div class="item">
            {debug?"C: ":""}{condition.shortText}
        </div>
    {:else}
        <div class="item">
            {conditions.length ? "Hidden" : "Unconditional"}
        </div>
    {/each}
{/if}

<style>
    div.item {
        text-align: center;
    }
</style>
