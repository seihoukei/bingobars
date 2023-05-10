<script>
    import UICodeValue from "components/ui/maxis/codes/UICodeValue.svelte"
    import Codes from "game-classes/codes.js"
    import BASE_VALUES from "data/base-values.js"
    import MainBingoTable from "game-classes/main-bingo-table.js"

    export let game
    export let id
    export let table = false

    $: valueList = table
        ? MainBingoTable.COUNTER_LIST.map(x => `${id}${x}`)
        : BASE_VALUES[id].codesList
</script>

<div class="group">
    {#each valueList as value}
        {#if !Codes.getCode(value)?.hidden}
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
