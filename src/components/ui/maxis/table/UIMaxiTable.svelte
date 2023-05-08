<script>

    import TABLES from "data/tables.js"
    import BingoTable from "game-classes/bingo-table.js"
    import UITableSlot from "components/ui/maxis/table/UITableSlot.svelte"

    export let game
    export let id

    $: uiSlot = id?.toLowerCase?.() ?? "none"

    $: table = TABLES[id]

</script>

{#if table}
    <div class="table">
        <div class="id"> {table?.name} </div>
        <div class="bingo">B I N G O</div>
        <div class="highlight"></div>
        <div class="bottom line"></div>
        <div class="right line"></div>
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
        {#each BingoTable.SLOT_LIST as id}
            <UITableSlot {game}
                               {id}
                               slot={table.slots?.[id]} />
        {/each}
    </div>
{/if}

<style>
    div.table {
        position: absolute;
        left : 1em;
        top : 1em;
        right: 1em;
        bottom: 1em;
        display: grid;
        grid-template-rows: 2em 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-auto-columns:  1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-row-gap: 1em;
        grid-column-gap: 1em;
    }

    div.id {
        display: flex;
        align-items: start;
        justify-content: center;
        font-size: 6em;
        margin-right: 0.5em;
        grid-row : 2;
        grid-column: 1;
    }

    div.highlight {
        grid-row: 2 / 7;
        grid-column: 2 / 7;
        background-color: #999999;
        margin : -3.5em -0.5em -0.5em -3.5em;
        border-radius: 4em 0.5em 0 0.5em;
        z-index: 1;
    }


    div.row-header, div.column-header {
        background-color: #222222;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index : 2;
        border-radius: 0.5em 0.5em 0 0;
        grid-row : 1;
    }

    div.row-header {
        grid-column : 1;
        width : 2em;
        margin-left: auto;
        border-radius: 0.5em 0 0 0.5em;
    }

    div.line {
        background-color: #555555;
        margin : -0.5em -0.5em -0.5em -0.5em;
        border-radius: 0.5em 0.5em 0.5em 0.5em;
        z-index: 1;
    }

    div.line.bottom {
        grid-row: 7;
        grid-column: 1 / 8;
    }

    div.line.right {
        grid-row: 2 / 8;
        grid-column: 7;
        border-radius: 0 0 0.5em 0.5em;
    }

    div.bingo {
        grid-row: 1;
        grid-column: 7;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #555555;
        border-radius: 0.25em 0.25em 0 0;
        margin : -0.25em;
        font-size : 2em;
    }
</style>
