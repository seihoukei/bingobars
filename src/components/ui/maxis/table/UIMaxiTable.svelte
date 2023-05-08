<script>
    import BingoTable from "game-classes/bingo-table.js"
    import UITableSlot from "components/ui/maxis/table/UITableSlot.svelte"

    import TABLES from "data/tables.js"

    export let game
    export let id

    $: table = TABLES[id]

</script>

{#if table}
    <div class="table">
        <div class="title"> {table?.name} </div>
        <div class="bingo">B I N G O</div>

        <div class="main-section"></div>
        <div class="bottom bingo-section"></div>
        <div class="right bingo-section"></div>

        <div class="row header" style="grid-row:2">R1</div>
        <div class="row header" style="grid-row:3">R2</div>
        <div class="row header" style="grid-row:4">R3</div>
        <div class="row header" style="grid-row:5">R4</div>
        <div class="row header" style="grid-row:6">R5</div>

        <div class="column header" style="grid-column:2">C1</div>
        <div class="column header" style="grid-column:3">C2</div>
        <div class="column header" style="grid-column:4">C3</div>
        <div class="column header" style="grid-column:5">C4</div>
        <div class="column header" style="grid-column:6">C5</div>

        {#each BingoTable.SLOT_LIST as id}
            <UITableSlot {game} {id}
                         slot={table.slots?.[id]}
            />
        {/each}
    </div>
{/if}

<style>
    div.table {
        position: absolute;
        left : 1rem;
        top : 1rem;
        right: 1rem;
        bottom: 1rem;

        display: grid;
        grid-template-rows: 2em 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-columns:  1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-row-gap: 1rem;
        grid-column-gap: 1rem;
    }

    div.title {
        grid-row : 2;
        grid-column: 1;

        display: flex;
        align-items: start;
        justify-content: center;

        font-size: 6em;
        margin-right: 0.5em;
    }

    div.main-section {
        grid-row: 2 / 7;
        grid-column: 2 / 7;

        background-color: #999999;

        margin : calc(-2em - 1.5rem)  -0.5rem -0.5rem calc(-2em - 1.5rem);
        border-radius: calc(2em + 2rem) 0.5rem 0 0.5rem;

        z-index: 1;
    }


    div.header {
        background-color: #222222;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index : 2;
    }

    div.header.column {
        border-radius: 0.5em 0.5em 0 0;
        grid-row : 1;
    }

    div.header.row {
        grid-column : 1;
        width : 2em;
        margin-left: auto;
        border-radius: 0.5em 0 0 0.5em;
    }

    div.bingo-section {
        background-color: #555555;
        margin : -0.5rem;
        border-radius: 0.5rem;
        z-index: 1;
    }

    div.bingo-section.bottom {
        grid-row: 7;
        grid-column: 1 / 8;
    }

    div.bingo-section.right {
        grid-row: 2 / 8;
        grid-column: 7;
        border-radius: 0 0 0.5rem 0.5rem;
    }

    div.bingo {
        grid-row: 1;
        grid-column: 7;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #555555;
        border-radius: 0.5rem 0.5rem 0 0;
        margin : -0.5rem;
        font-size : 2em;
    }
</style>
