<script>
    import Trigger from "utility/trigger.js"
    import TABLES from "data/tables.js"

    export let game
    export let x
    export let y
    export let change = 1
    export let availableBingoins = 0

    export let line = false

    $: bingo = game?.state?.bingo ?? {}
    $: cost = TABLES.SB.costs[y]?.[x] ?? 0
    $: value = bingo?.field?.[y]?.[x] ?? 0
    $: cssVariables = `--row:${y + 1};--column:${x + 2};`

    $: canIncrease = availableBingoins >= change * cost
    $: canDecrease = value > 0

    function changeValue(change = 1) {
        Trigger("command-allocate-bingo-points", x, y, change)
    }

    function increase() {
        changeValue(change)
    }

    function decrease() {
        changeValue(-change)
    }
</script>

<div class="cell" class:line style={cssVariables}>
    {#if x === 2 && y === 2}
        <div class="free">FREE</div>
    {:else}
        <div class="change">
            <div class="button" class:active={canDecrease} on:click={decrease}>-</div>
            <div class="value">{value}</div>
            <div class="button" class:active={canIncrease} on:click={increase}>+</div>
        </div>
        <div class="cost"><span class="bingoin-icon"></span> {cost}</div>
    {/if}
</div>

<style>
    div.cell {
        background: #772222;
        grid-row: var(--row);
        grid-column: var(--column);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 0.5em;
    }

    div.cell.line {
        background-color: #442222;
    }

    div.change {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 7em;
    }

    div.value {
        font-size: 3em;
        display: flex;
        align-items: center;
        justify-content: center;
    }


    div.button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #6688AA;
        color : #000000;
        width: 1.5em;
        height: 1.5em;
        transition: background-color 0.2s;
    }

    div.button.active:hover {
        cursor: pointer;
        background-color: #7799BB;
    }

    div.button:not(.active) {
        background-color: #444444;
    }

    div.cost {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    div.free {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
    }

</style>
