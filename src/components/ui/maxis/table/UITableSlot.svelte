<script>

    import FG_COLORS from "data/fg-colors"

    import interactive from "utility/interactive"
    import Trigger from "utility/trigger"
    import StringMaker from "utility/string-maker.js"
    import BingoTable from "game-classes/bingo-table.js"
    import UISlotPrerequisites from "components/ui/maxis/table/UISlotPrerequisites.svelte"
    import UISlotConditions from "components/ui/maxis/table/UISlotConditions.svelte"
    import UISlotModifiers from "components/ui/maxis/table/UISlotModifiers.svelte"

    export let id
    export let slot
    export let game

    let debug = 0

    if (import.meta.env.MODE === "development") {
        // 1 : see descriptions
        // 2 : raw formulas
        debug = 1
    }

    $: tables = game?.state?.tables
    $: value = tables?.[slot.address]
    $: visible = value & BingoTable.SLOT_STATES.VISIBLE
    $: seen = value & BingoTable.SLOT_STATES.PREREQUISITES_MET
    $: available = (value & BingoTable.SLOT_STATES.UNLOCKABLE) === BingoTable.SLOT_STATES.UNLOCKABLE
    $: unlocked = value & BingoTable.SLOT_STATES.UNLOCKED
    $: involved = unlocked
              ? slot?.getInvolvedInModifiers() ?? []
              : slot?.getInvolvedInConditions() ?? []
    $: enabled = value & BingoTable.SLOT_STATES.ENABLED
    $: cssVariables = `${getSlotPosition(id)}${getSlotBackground(involved, seen, available, enabled, unlocked)}`
    $: cell = slot.type === BingoTable.SLOT_TYPES.CELL

    $: unlockTimes = game?.state?.stats?.unlocks
    $: unlockTime = unlockTimes[slot.address] ?? 0


    function positionVariables(x, y) {
        return `--row:${y};--column:${x};`
    }

    function getSlotPosition(id) {
        if (slot.type === BingoTable.SLOT_TYPES.CELL) {
            const x = +id[3] + 1
            const y = +id[1] + 1
            return positionVariables(x, y)
        }
        if (slot.type === BingoTable.SLOT_TYPES.ROW) {
            const x = 7
            const y = +id[1] + 1
            return positionVariables(x, y)
        }
        if (slot.type === BingoTable.SLOT_TYPES.COLUMN) {
            const x = +id[1] + 1
            const y = 7
            return positionVariables(x, y)
        }
        if (id === "DL") {
            return positionVariables(1, 7)
        }
        if (id === "DR") {
            return positionVariables(7, 7)
        }
    }

    function getSlotBackground() {
        if (!seen)
            return `--background: #222222;`

        let mainBackground = "linear-gradient(to right, grey, grey)"
        let stateBackground = "linear-gradient(#222222)"

        if (involved.length == 1)
            mainBackground = mainBackground = `linear-gradient(to right, ${FG_COLORS[involved[0]]}, ${FG_COLORS[involved[0]]})`
        else
            mainBackground = mainBackground = `linear-gradient(to right, ${involved.map(x => FG_COLORS[x]).join(",")})`


        if (unlocked)
            return `--background: ${mainBackground};`

        stateBackground =
            available ? "linear-gradient(#227722FF, #22772288, #227722FF)" :
            "linear-gradient(#000000FF, #00000044, #00000088)"

        return `--background: ${stateBackground}, ${mainBackground};`
    }

    function toggle() {
        if (!enabled || !slot.oneWay)
        Trigger("command-toggle-slot", slot.address)
    }

    $: decoration =
        enabled ?
            slot.oneWay ? "" :
            "★" :
        unlocked ? "✰" :
        "🔒"

</script>
{#if visible}
    <div class="slot"
         class:seen
         class:available
         class:unlocked
         class:enabled
         class:cell
         class:oneway={slot.oneWay}
         style={cssVariables}
         use:interactive
         on:basicaction={toggle}
         on:specialaction
    >
        <div class="title">{decoration}{slot.address}{decoration}</div>
        <div class="content" class:debug>
            {#if debug}
                {#if slot.prerequisites?.length}
                    <UISlotPrerequisites {game} {debug} prerequisites={slot.prerequisites}/>
                {/if}
                {#if slot.conditions?.length}
                    <UISlotConditions {game} {debug} conditions={slot.conditions} custom={slot.conditionText}/>
                {/if}
                {#if slot.modifiers?.length}
                    <UISlotModifiers {game} {debug} modifiers={slot.modifiers} custom={slot.modifierText}/>
                {/if}
            {:else if unlocked}
                <UISlotModifiers {game} modifiers={slot.modifiers} custom={slot.modifierText}/>
            {:else if seen}
                <UISlotConditions {game} conditions={slot.conditions} custom={slot.conditionText}/>
            {:else}
                <UISlotPrerequisites {game} prerequisites={slot.prerequisites}/>
            {/if}
        </div>
        {#if slot.bingoins}
            <div class="bingoins">
                <span class="bingoin-icon"></span> {slot.bingoins}
            </div>
        {/if}
        <div class="time">{StringMaker.formatValue(unlockTime, {type:StringMaker.VALUE_FORMATS.TIME})}</div>
    </div>
{/if}
<style>
    div.slot {
        position: relative;
        background: var(--background);
        grid-row: var(--row);
        grid-column: var(--column);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: stretch;
        flex-direction: column;
        transition: background 0.2s;
    }

    div.slot.seen {
    }

    div.slot.available {
        cursor: pointer;
    }

    div.slot.unlocked {
        cursor: pointer;
    }

    div.slot.enabled {
        border : 0.2em solid white;
    }

    div.slot.enabled.oneway {
        border : 0.2em solid #BBBBBB;
        cursor: default;
    }

    div.content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        flex-direction: column;
    }

    div.content.debug {
        font-size: 0.7em;
    }

    div.bingoins {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.2em;
        right : 0;
        bottom : 0;
    }

    div.unlocked div.bingoins {
        opacity: 0.5;
    }

    div.time {
    }
</style>
