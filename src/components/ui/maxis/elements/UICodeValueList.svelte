<script>
    import UICodeValue from "components/ui/maxis/elements/UICodeValue.svelte"

    import VALUES_PER_BASE from "data/values-per-base.js"
    import VALUES_PER_TABLE from "data/values-per-table.js"
    import VALUES from "data/values.js"

    export let game
    export let id
    export let table = false

    $: valueList = Object.keys(table ? VALUES_PER_TABLE : VALUES_PER_BASE).map(x => x.replace("~",id))
</script>

<div class="group">
    {#each valueList as value}
        {#if !VALUES[value]?.hidden}
            <UICodeValue {game} id={value} base={id} {table} />
        {/if}
    {/each}
</div>

<style>
    div.group {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        row-gap: 0.5em;
    }
</style>