<script>
    export let modifiers = []
    export let game
    export let debug = 0
    export let custom = null

    $: visibleModifiers = debug < 2 ? modifiers.filter(x => !x.hidden) : modifiers
</script>

{#if !debug}<div class="title">Modifiers:</div>{/if}
{#if custom && debug < 2}
    <div class="item">
        {custom}
    </div>
{:else}
    {#each visibleModifiers as modifier}
        <div class="item">
            {debug?"M: ":""}{modifier.shortText}
        </div>
    {/each}
{/if}