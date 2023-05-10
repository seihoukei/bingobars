<script>
    import BingoTable from "game-classes/bingo-table.js"

    export let id
    export let slot
    export let game

    $: tables = game?.state?.tables
    $: state = tables?.[slot.code]

    $: visible = state & BingoTable.SLOT_STATES.VISIBLE
    $: seen = visible &&  state & BingoTable.SLOT_STATES.PREREQUISITES_MET
    $: available = seen && (state & BingoTable.SLOT_STATES.UNLOCKABLE) === BingoTable.SLOT_STATES.UNLOCKABLE
    $: unlocked = state & BingoTable.SLOT_STATES.UNLOCKED
    $: enabled = state & BingoTable.SLOT_STATES.ENABLED

    $: cssVariables = `${getSlotPosition(id)}}`

    $: cell = slot.type === BingoTable.SLOT_TYPES.CELL

    function getSlotPosition(id) {
        const [x, y] = BingoTable.SLOTS[id]?.position ?? [1, 1]
        return `--row:${y+1};--column:${x+1};`
    }
</script>

<div class="slot"
     class:visible
     class:seen
     class:available
     class:unlocked
     class:enabled
     class:cell
     style={cssVariables}
>
</div>

<style>
    div.slot {
        position: relative;
        grid-row: var(--row);
        grid-column: var(--column);

        z-index: 2;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: stretch;
        overflow: hidden;
    }

    div.slot.visible {
        background-color: #222222;
    }

    div.slot.seen {
        background-color: #772222;
    }

    div.slot.available {
        background-color: #22CC22;
    }

    div.slot.unlocked {
        background-color: #222277;
    }

    div.slot.enabled {
        background-color: #2288CC;
    }

</style>
