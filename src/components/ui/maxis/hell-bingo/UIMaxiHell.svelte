<script>
    import TABLES from "data/tables.js"
    import UIHellSlot from "components/ui/maxis/hell-bingo/UIHellSlot.svelte"
    import BingoTable from "game-classes/bingo-table.js"

    export let game
    export let id

    $: values = game?.state?.values ?? {}
    $: bingo = game?.state?.bingo ?? {}

</script>

<div class="container">
    <div class="table">
        <div class="title">H</div>
        <div class="title">E</div>
        <div class="title">L</div>
        <div class="title">L</div>
        <div class="title">O<div class="blood"></div></div>
        {#each BingoTable.SLOT_LIST as id}
            <UIHellSlot {game} {id} />
        {/each}
    </div>

</div>

<style>
    div.container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        border : 1px solid #440000;
        background: url("../resources/hellbg.jpg"), #000000;
        background-size: cover;
    }

    div.table {
        position: absolute;
        top : 1em;
        left : 1em;
        bottom : 1em;
        right : 1em;
        flex : 1;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-auto-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-row-gap: 1em;
        grid-column-gap: 1em;
    }

    div.title {
        font-size: 6em;
        color: #FFCCCC;
        position : relative;

        display: flex;
        align-items: center;
        justify-content: center;
        margin: -2em;
    }

    div.blood {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index : 2;
        margin : 2em;
        background: url("../resources/blood.png");
        background-size: contain;
        background-repeat: no-repeat;
    }


</style>
