<script>
    import BaseValue from "game-classes/base-value.js"
    import BASE_VALUES from "data/base-values.js"
    import BingoTable from "game-classes/bingo-table.js"
    import MainBingoTable from "game-classes/main-bingo-table.js"
    import TABLES from "data/tables.js"
    import interactive from "utility/interactive.js"
    import Trigger from "utility/trigger.js"
    import UICodeValue from "components/ui/maxis/codes/UICodeValue.svelte"

    export let game
    export let id

    const CALCULATOR_TAB = 18

    const valueCodeList = []
    const tableCodeList = []
    const tableList = ["TX", ...Object.entries(TABLES).filter(([_,x]) => x.type === BingoTable.TABLE_TYPES.BINGO).map(([x,_]) => x)]
    const variableList = ["X", "Y", "Z"]

    const codeTable = []
    for (const item of BaseValue.RELATED_VALUES) {
        if (BaseValue.VALUE_DESCRIPTIONS[item]?.hidden)
            continue
        const valueItems = Object.keys(BASE_VALUES).map(x => item.replace("X", x))
        codeTable.push(valueItems)
        valueCodeList.push(...valueItems)
    }
    let row = 0
    for(const item of Object.keys(MainBingoTable.COUNTERS)) {
        const tableItems = tableList.map(x => item.replace("~", x))
        codeTable.push([...tableItems, variableList[row] ?? "CALC"])
        tableCodeList.push(...tableItems)
        row++
    }
    valueCodeList.push(...variableList)

    function calculator() {
        Trigger("command-set-tab", CALCULATOR_TAB)
    }

    $: cssVariables = `grid-template-areas: ${codeTable.map(x => `"${x.join(" ")}"`).join(" ")}`

</script>

<div class="container table" style={cssVariables}>
    {#each valueCodeList as id}
        <UICodeValue {game} {id} />
    {/each}
    {#each tableCodeList as id}
        <UICodeValue {game} {id} table />
    {/each}
    <div class="calc button"
         use:interactive
         on:basicaction={calculator}
    >+-<br>×÷</div>
</div>

<style>
    div.container {
        position: absolute;
        left : 1rem;
        top : 1rem;
        right: 1rem;
        bottom: 1rem;

        display: grid;
        grid-template-rows: repeat(16, 1fr);
        grid-template-columns: repeat(7, 1fr);
        row-gap: 1rem;
        column-gap: 1rem;
        font-size: 1.9em;
    }

    div.button {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-area: CALC;
        border-radius: 0.25em;
        background-color: #440000;
        cursor : pointer;
        transition: background-color 0.2s;
        font-size: 2em;
    }

    div.button:hover {
        background-color: #772222;
    }

</style>
