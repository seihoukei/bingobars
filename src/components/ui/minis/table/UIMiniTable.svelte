<script>
    import UIMiniTableSlot from "components/ui/minis/table/UIMiniTableSlot.svelte"

    import TABLES from "data/tables.js"

    import interactive from "utility/interactive.js"
    import BingoTable from "game-classes/bingo-table.js"

    export let game
    export let id
    export let active = false

    $: uiSlot = id?.toLowerCase?.() ?? "none"

    $: visible = game?.state?.tables?.[`${id}_seen`] ?? false

    $: table = TABLES[id]
    $: slots = Object.entries(table?.slots ?? {})

    $: completeSlots = game?.state?.values?.[`${id}_SN`]
    $: complete = `${Math.floor(completeSlots / BingoTable.SLOT_LIST.length * 100)}%`

</script>

<div class="container"
     class:visible
     class:active
     style="--ui-slot:{uiSlot}"
>
    {#if visible}
        <div class="highlight"></div>
        <div class="data"
             use:interactive
             on:basicaction
             on:specialaction
        >
            <div class="id"> {id} </div>
            <div class="spacer"></div>
            <div class="table">
                {#each BingoTable.SLOT_LIST as id}
                    <UIMiniTableSlot {game} {id} slot={table.slots?.[id]} />
                {/each}
            </div>
            <div class="spacer"></div>
            <div class="progress"> {complete} </div>
        </div>
    {/if}
</div>

<style>
    div.container {
        grid-area: var(--ui-slot);
        border-radius: 1em;
        background-color: #222222;
        position: relative;
        transition: background-color 0.2s;
    }
    div.container.visible:not(.active):hover {
        cursor: pointer;
    }

    div.container.visible {
        background-color: #666666;
    }

    div.highlight {
        position: absolute;
        left : 0;
        top : 0;
        width : 100%;
        height : 100%;
        border-radius: 1em;

        background-color: #FFFFFF;
        opacity : 0;
        transition: opacity 0.2s;

        pointer-events: none;
        z-index: 1;
    }

    div.container.visible:not(.active):hover div.highlight {
        opacity: 0.2;
    }

    div.container.active div.highlight {
        opacity: 0.4;
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
        height: 0.3em;
    }
    div.table {
        display: grid;
        grid-template-rows: 1em 1em 1em 1em 1em 1em;
        grid-template-columns: 1em 1em 1em 1em 1em 1em 1em;
        grid-row-gap: 1px;
        grid-column-gap: 1px;
    }
    div.progress {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
    }
</style>
