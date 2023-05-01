<script>
    import UISlotConditions from "components/ui/maxis/elements/UISlotConditions.svelte"
    import UISlotModifiers from "components/ui/maxis/elements/UISlotModifiers.svelte"
    import UISlotPrerequisites from "components/ui/maxis/elements/UISlotPrerequisites.svelte"

    import FG_COLORS from "data/fg-colors"
    import SLOT_STATES from "data/slot-states"
    import SLOT_TYPES from "data/slot-types"

    import interactive from "utility/interactive"
    import Trigger from "utility/trigger"

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
    $: visible = value & SLOT_STATES.VISIBLE
    $: seen = value & SLOT_STATES.PREREQUISITES_MET
    $: available = (value & SLOT_STATES.UNLOCKABLE) === SLOT_STATES.UNLOCKABLE
    $: unlocked = value & SLOT_STATES.UNLOCKED
    $: involved = unlocked
              ? slot?.getInvolvedInModifiers() ?? []
              : slot?.getInvolvedInConditions() ?? []
    $: enabled = value & SLOT_STATES.ENABLED
    $: cssVariables = `${getSlotPosition(id)}${getSlotBackground(involved, seen, available, enabled, unlocked)}`
    $: cell = slot.type === SLOT_TYPES.CELL



    function positionVariables(x, y) {
        return `--row:${y};--column:${x};`
    }

    function getSlotPosition(id) {
        if (slot.type === SLOT_TYPES.CELL) {
            const x = +id[3] + 1
            const y = +id[1] + 1
            return positionVariables(x, y)
        }
        if (slot.type === SLOT_TYPES.ROW) {
            const x = 7
            const y = +id[1] + 1
            return positionVariables(x, y)
        }
        if (slot.type === SLOT_TYPES.COLUMN) {
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
    </div>
{/if}
<style>
    div.slot {
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
</style>
