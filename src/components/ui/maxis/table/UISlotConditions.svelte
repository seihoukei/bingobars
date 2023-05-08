<script>
    export let conditions = []
    export let game
    export let debug = 0
    export let custom = null

    $: values = game?.state?.values ?? {}
    $: visibleConditions = debug < 2 ? conditions.filter(x => !x.hidden) : conditions
</script>

{#if debug === 2}
    <div class="debug">
        C: {custom}
    </div>
{:else if debug === 1}
    {#each visibleConditions as condition}
        <div class="item nowrap" class:complete={condition.check(values)}>
            C: {condition.shortText}
        </div>
    {/each}
{:else}
    {#if custom}
        <div class="item">
            {custom}
        </div>
    {:else}
        {#each visibleConditions as condition}
            <div class="item nowrap" class:complete={condition.check(values)}>
                {condition.shortText}
            </div>
        {:else}
            <div class="item">
                {conditions.length ? "Hidden" : "Unconditional"}
            </div>
        {/each}
    {/if}
{/if}

<style>
    div.item {
        text-align: center;
        font-size: 1.4em;
        color: #FFAAAACC;
        white-space: nowrap;
    }

    div.item.nowrap {
        white-space: nowrap;
    }

    div.debug {
        text-align: center;
    }

    div.complete {
        color: #AAFFAACC;
    }
</style>
