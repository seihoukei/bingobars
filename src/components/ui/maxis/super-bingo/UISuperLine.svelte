<script>
    import {afterUpdate, onMount} from "svelte"
    import Trigger from "utility/trigger.js"
    import TABLES from "data/tables.js"
    import interactive from "utility/interactive.js"

    const BLINK_ANIMATION = [{
        opacity : 0,
    }, {
        opacity: 0.2,
    }, {
        opacity: 0.0,
    }]

    const BLINK_DURATION = 300
    const BLINK_DELAY = 100

    export let game
    export let id

    let lastValue = 0

    $: bingo = game?.state?.bingo ?? {}
    $: value = bingo.levels?.[id] ?? {}
    $: data = TABLES.SB.slots[id] ?? {}
    $: [x,y] = data.position
    $: blinkTargets = [...(data.cells ?? []), [x-1, y]]
    $: blinkCells = []
    $: active = bingo?.active?.[id]
    $: modifier = data?.modifier ?? null
    $: target = modifier?.target ?? null
    $: effect = data.effect ?? `SB${id}`
    $: diplayEffect = target && game?.state?.seen?.[target]
        ? effect
        : "???"

    onMount(() => {
        lastValue = value
    })

    afterUpdate(() => {
        if (value !== lastValue) {
            blink()
        }
        lastValue = value
    })

    function positionStyle(x, y) {
        return `--row:${y + 1};--column:${x + 1};`
    }

    function blink() {
        blinkCells.forEach((cell, index) => {
            cell.animate(BLINK_ANIMATION, {
                duration : BLINK_DURATION,
                delay : index * BLINK_DELAY,
            })
        })
    }

    function toggle() {
        Trigger("command-toggle-bingo-line", id)
        blink()
    }

</script>

<div class="cell"
     class:active
     style={positionStyle(x, y)}
     use:interactive
     on:basicaction={toggle}
>
    <div class="level">{value}</div>
    <div class="name">{diplayEffect}</div>
</div>

{#each blinkTargets as [x, y], i}
    <div class="blink" style={positionStyle(x + 1, y)} bind:this={blinkCells[i]}> </div>
{/each}

<style>
    div.cell {
        background: #444400;
        grid-row: var(--row);
        grid-column: var(--column);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: stretch;
        flex-direction: column;
        border-radius: 0.5em;
    }

    div.cell.active {
        background: #999944;
    }

    div.cell:hover {
        cursor: pointer;
        background: #777744;
    }

    div.level {
        font-size: 5em;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    div.blink {
        grid-row: var(--row);
        grid-column: var(--column);
        pointer-events: none;
        opacity: 0;
        background-color: #FFFF44;
        z-index : 5;
        border-radius: 0.5em;
    }

</style>
