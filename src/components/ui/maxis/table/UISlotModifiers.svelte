<script>
    export let modifiers = []
    export let debug = 0
    export let custom = null

    $: visibleModifiers = debug < 2 ? modifiers.filter(x => !x.hidden) : modifiers
</script>

{#if debug === 2}
    <div class="debug">
        M: {custom}
    </div>
{:else if debug === 1}
    {#each visibleModifiers as modifier}
        <div class="item nowrap">
            M: {modifier.shortText}
        </div>
    {/each}
{:else if custom}
    <div class="item">
        {custom}
    </div>
{:else}
    {#each visibleModifiers as modifier}
        <div class="item nowrap">
            {modifier.shortText}
        </div>
    {:else}
        <div class="item">
            {modifiers.length ? "Hidden" : "No effect"}
        </div>
    {/each}
{/if}

<style>
    div.item {
        text-align: center;
        font-size: 1.4em;
    }

    div.item.nowrap {
        white-space: nowrap;
    }

    div.debug {
        text-align: center;
    }
</style>
