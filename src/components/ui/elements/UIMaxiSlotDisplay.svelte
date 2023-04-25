<script>
    import SLOT_TYPES from "data/slot-types.js"
    import SLOT_STATES from "data/slot-states.js"
    import UISlotConditions from "components/ui/elements/UISlotConditions.svelte"
    import UISlotModifiers from "components/ui/elements/UISlotModifiers.svelte"
    import interactive from "utility/interactive.js"
    import UISlotPrerequisites from "components/ui/elements/UISlotPrerequisites.svelte"
    import Trigger from "utility/trigger.js"

    export let id
    export let slot
    export let game

    $: tables = game?.state?.tables
    $: value = tables?.[slot.address]
    $: cssVariables = getSlotPosition(id)
    $: visible = value & SLOT_STATES.VISIBLE
    $: seen = value & SLOT_STATES.PREREQUISITES_MET
    $: available = (value & SLOT_STATES.UNLOCKABLE) === SLOT_STATES.UNLOCKABLE
    $: unlocked = value & SLOT_STATES.UNLOCKED
    $: enabled = value & SLOT_STATES.ENABLED
    $: cell = slot.type === SLOT_TYPES.CELL

    function positionVariables(x, y) {
        return `--row:${y};--column:${x}`
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

    function toggle() {
        if (!enabled || !slot.oneWay)
        Trigger("command-toggle-slot", slot.address)
    }

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
        <div class="title">{slot.address}</div>
        <div class="content">
            {#if unlocked}
                <UISlotModifiers {game} modifiers={slot.modifiers}/>
            {:else if seen}
                <UISlotConditions {game} conditions={slot.conditions}/>
            {:else}
                <UISlotPrerequisites {game} prerequisites={slot.prerequisites}/>
            {/if}
        </div>
    </div>
{/if}
<style>
    div.slot {
        background-color: #222222;
        grid-row: var(--row);
        grid-column: var(--column);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: stretch;
        flex-direction: column;
        transition: background-color 0.2s;
    }

    div.slot.seen {
        background-color: #442222;
    }

    div.slot.available {
        background-color: #227722;
        cursor: pointer;
    }

    div.slot.unlocked {
        background-color: #222277;
        cursor: pointer;
    }

    div.slot.enabled {
        background-color: #4444AA;
    }

    div.slot.enabled.oneway {
        background-color: #4444AA;
        cursor: default;
    }

    div.content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        flex-direction: column;
    }

</style>
