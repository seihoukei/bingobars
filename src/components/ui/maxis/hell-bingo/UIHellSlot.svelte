<script>
    import Trigger from "utility/trigger.js"
    import TABLES from "data/tables.js"
    import BingoTable from "game-classes/bingo-table.js"
    import {onDestroy, onMount} from "svelte"
    import UISlotConditions from "components/ui/maxis/table/UISlotConditions.svelte"
    import Codes from "game-classes/codes.js"

    export let game
    export let id

    let noise = ""

    $: values = game?.state?.values
    $: seenValues = game?.state?.seen

    $: slot = TABLES.HL.slots[id] ?? {}

    $: position = slot.position ?? [0, 0]
    $: positionVariables = `--row:${position[1]+1};--column:${position[0]+1};`
    $: line = slot.type !== BingoTable.SLOT_TYPES.CELL
    $: cssVariables = `${positionVariables}${noise}`

    $: seen = slot.conditions.length && slot.conditions.every(condition => condition.involved.every(codeSeen))

    function codeSeen(id) {
        const code = Codes.get(id)
        if (!code)
            return false

        if (code.type === Codes.TYPES.COUNTER) {
            return values[id] > 0
        }

        if (code.type === Codes.TYPES.VALUE) {
            if (!values[code.baseValue.codes.X_seen])
                return false

            return !code.derived || seenValues[id] || id === code.baseValue.id
        }

        return false
    }


    let noiseInterval = null
    onMount(() => {
        if (game?.state?.settings?.animateNoise) {
            noiseInterval = setInterval(() => {
                noise = `--noise-x:${(100 * Math.random()).toFixed(2)}em;--noise-y:${(100 * Math.random()).toFixed(2)}em;`
            }, 100)
        } else {
            noise = `--noise-x:${(100 * Math.random()).toFixed(2)}em;--noise-y:${(100 * Math.random()).toFixed(2)}em;`
        }
    })

    onDestroy(() => clearInterval(noiseInterval))

</script>

<div class="slot"
     class:line
     class:seen
     style={cssVariables}>
    {#if seen}
        <UISlotConditions {game} conditions={slot.conditions}/>
        {#if slot.bingoins}
            <div class="bingoins">
                <span class="bingoin-icon"></span> {slot.bingoins}
            </div>
        {/if}
    {/if}
</div>

<style>
    div.slot {
        position: relative;
        grid-row: var(--row);
        grid-column: var(--column);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border : 1px solid #440000;
        border-radius: 0.5em;
        background-image: url("../resources/noise/hell.png");
        background-position: var(--noise-x) var(--noise-y);
    }

    div.line {
        background-image: url("../resources/noise/hell_line.png");
    }

    div.slot.seen {
        background: #772222;
    }

    div.line.seen {
        background: #994444;
    }

    div.bingoins {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;
        padding: 0 0.2em;
    }

</style>
