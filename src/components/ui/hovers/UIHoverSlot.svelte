<script>
    import BingoTable from "game-classes/bingo-table.js"
    import StringMaker from "utility/string-maker.js"

    export let game
    export let code

    $: slot = code?.slot ?? {}
    $: slotTitle = `${{
        [BingoTable.SLOT_TYPES.CELL] : "Cell slot",
        [BingoTable.SLOT_TYPES.ROW] : "Row slot",
        [BingoTable.SLOT_TYPES.COLUMN] : "Column slot",
        [BingoTable.SLOT_TYPES.DIAGONAL] : "Diagonal slot",
    }[slot.type]} ${slot.code}`

    $: state = game?.state?.tables?.[slot.code]

    $: visible = state & BingoTable.SLOT_STATES.VISIBLE
    $: seen = visible &&  state & BingoTable.SLOT_STATES.PREREQUISITES_MET
    $: available = seen && (state & BingoTable.SLOT_STATES.UNLOCKABLE) === BingoTable.SLOT_STATES.UNLOCKABLE
    $: unlocked = state & BingoTable.SLOT_STATES.UNLOCKED
    $: enabled = state & BingoTable.SLOT_STATES.ENABLED


</script>

<div class="content">
    {#if unlocked}
        <div>{slotTitle}</div>
        {#if slot?.modifiers?.length}
            <div class="spacer"></div>
            <div>Modifiers:</div>
            {#each slot.modifiers as modifier}
                <div>{StringMaker.formatCalculation(modifier)}</div>
            {/each}
        {/if}
    {:else if seen}
        <div>{slotTitle}</div>
        {#if slot?.conditionText}
            <div class="spacer"></div>
            <div>Conditions:</div>
            <div>{slot.conditionText}</div>
        {:else if slot?.conditions?.length}
        <div class="spacer"></div>
            <div>Conditions:</div>
            {#each slot.conditions as condition}
                <div>{StringMaker.formatCalculation(condition)}</div>
            {/each}
        {/if}
        {#if slot?.modifierText}
            <div class="spacer"></div>
            <div>Modifiers:</div>
            <div>{slot.modifierText}</div>
        {:else if slot?.modifiers?.length}
        <div class="spacer"></div>
            <div>Modifiers:</div>
            {#each slot.modifiers as modifier}
                <div>{StringMaker.formatCalculation(modifier)}</div>
            {/each}
        {/if}
    {:else if visible}
        <div>{slotTitle}</div>
        <div class="spacer"></div>
        <div>Unlock {slot.prerequisites?.join(",") ?? "???"} to see conditions</div>
    {:else}
        <div>Complete the {slot.code} line to see requirements</div>
    {/if}
</div>

<style>
    div.content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    div.content div {
        white-space: nowrap;
    }

    div.content div.spacer {
        height: 0.5em;
    }
</style>
