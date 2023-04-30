<script>
    import UIMaxiSlotDisplay from "components/ui/maxis/elements/UIMaxiSlotDisplay.svelte"
    import TABLES from "data/tables.js"
    export let game
    export let id

    $: ready = false
    $: uiSlot = id?.toLowerCase?.() ?? "none"

    $: table = TABLES[id]
    $: slots = Object.entries(table?.slots ?? {})

</script>

<div class="visible container"
     class:ready
     style="--ui-slot:{uiSlot}"
>
    {#if table}
        <div class="data">
            <div class="id"> {id}: {table?.name} </div>
            <div class="spacer"></div>
            <div class="table">
                <div class="highlight"></div>
                <div class="row-header" style="grid-row:2">R1</div>
                <div class="row-header" style="grid-row:3">R2</div>
                <div class="row-header" style="grid-row:4">R3</div>
                <div class="row-header" style="grid-row:5">R4</div>
                <div class="row-header" style="grid-row:6">R5</div>
                <div class="column-header" style="grid-column:2">C1</div>
                <div class="column-header" style="grid-column:3">C2</div>
                <div class="column-header" style="grid-column:4">C3</div>
                <div class="column-header" style="grid-column:5">C4</div>
                <div class="column-header" style="grid-column:6">C5</div>
                {#each slots as [slotId, slot]}
                    <UIMaxiSlotDisplay {game}
                            id={slotId}
                            {slot} />
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    div.container {
        grid-area: var(--ui-slot);
        border-radius: 1em;
        position: relative;
        width : 70em;
        height : 50em;
    }

    div.data {
        z-index : 1;
        position: absolute;
        left : 0;
        top : 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    div.id {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
    }
    div.spacer {
        height: 1em;
    }
    div.table {
        display: grid;
        grid-auto-rows: 2em 6em 6em 6em 6em 6em 6em;
        grid-auto-columns: 9em 9em 9em 9em 9em 9em 9em;
        grid-row-gap: 1em;
        grid-column-gap: 1em;
    }
    div.highlight {
        grid-row: 2 / 7;
        grid-column: 2 / 7;
        background-color: #999999;
        margin : -3.5em -0.5em -0.5em -3.5em;
        border-radius: 4em 0.5em 0.5em 0.5em;
        z-index: 1;
    }

    div.row-header, div.column-header {
        background-color: #222222;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index : 2;
        border-radius: 0.5em 0.5em 0 0;
    }

    div.row-header {
        width : 2em;
        margin-left: auto;
        border-radius: 0.5em 0 0 0.5em;
    }
</style>
