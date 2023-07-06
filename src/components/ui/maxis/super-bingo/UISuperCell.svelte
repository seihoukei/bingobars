<script>
    import Trigger from "utility/trigger.js"
    import TABLES from "data/tables.js"

    import interactive from "utility/interactive.js"

    export let game
    export let x
    export let y
    export let change = 1
    export let availableBingoins = 0

    $: bingo = game?.state?.bingo ?? {}
    $: cost = TABLES.SB.costs[y][x]
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

    function minimize() {
        changeValue(-Infinity)
    }

    function decrease() {
        changeValue(-change)
    }

    function maximize() {
        changeValue(Infinity)
    }
</script>

<div class="slot" style={cssVariables}>
    {#if x === 2 && y === 2}
        <div class="free">FREE</div>
    {:else}
        <div class="button left"
             class:active={canDecrease}
             use:interactive
             on:basicaction={decrease}
             on:specialaction={minimize}
        >-</div>
        <div class="value">{value}</div>
        <div class="button right"
             class:active={canIncrease}
             use:interactive
             on:basicaction={increase}
             on:specialaction={maximize}
        >+</div>
        <div class="cost"><span class="bingoin-icon"></span> {cost}</div>
    {/if}
</div>

<style>
    div.slot {
        position : relative;
        grid-row: var(--row);
        grid-column: var(--column);

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-radius: 0.5em;
        overflow: hidden;

        background: #444477;

        z-index: 2;
    }

    div.value {
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 5em;
    }


    div.button {
        display: flex;
        align-items: center;
        justify-content: center;

        font-size : 2em;
        width: 1em;
        height: 2.5em;

        background-color: #6688AA;
        color : #CCCCCC;
        transition: background-color 0.2s;

        z-index: 2;
    }

    div.button.left {
        border-radius: 0 0.5em 0.5em 0;
    }
    div.button.right {
        border-radius: 0.5em 0 0 0.5em;
    }

    div.button.active:hover {
        background-color: #7799BB;
        cursor: pointer;
    }

    div.button:not(.active) {
        background-color: #444477;
        color: #222222;
    }

    div.cost {
        position : absolute;
        bottom : 0;
        left : 0;
        right: 0;

        font-size: 1.5em;

        display: flex;
        align-items: center;
        justify-content: center;

        z-index: 1;
    }

    div.free {
        flex : 1;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 3em;
    }
</style>
