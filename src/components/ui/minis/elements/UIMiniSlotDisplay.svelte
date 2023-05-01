<script>
    import SLOT_STATES from "data/slot-states"
    import SLOT_TYPES from "data/slot-types"

    export let id
    export let value
    export let slot

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
            const y = +id[1]
            return positionVariables(x, y)
        }
        if (slot.type === SLOT_TYPES.ROW) {
            const x = 7
            const y = +id[1]
            return positionVariables(x, y)
        }
        if (slot.type === SLOT_TYPES.COLUMN) {
            const x = +id[1] + 1
            const y = 6
            return positionVariables(x, y)
        }
        if (id === "DL") {
            return positionVariables(1, 6)
        }
        if (id === "DR") {
            return positionVariables(7, 6)
        }
    }

</script>

{#if visible}
    <div class="slot"
         class:seen
         class:available
         class:unlocked
         class:enabled
         class:cell
         style={cssVariables}>
    </div>
{/if}

<style>
    div.slot {
        background-color: #222222;
        grid-row: var(--row);
        grid-column: var(--column);
    }

    div.slot.seen {
        background-color: #442222;
    }

    div.slot.available {
        background-color: #22CC22;
    }

    div.slot.unlocked {
        background-color: #222277;
    }

    div.slot.enabled {
        background-color: #4444AA;
    }

    div.slot:not(.cell) {
        opacity: 0.6;
    }
</style>
