<script>
    import TABLES from "data/tables.js"
    import UISuperCell from "components/ui/maxis/super-bingo/UISuperCell.svelte"
    import UISuperLine from "components/ui/maxis/super-bingo/UISuperLine.svelte"

    export let game
    export let id

    $: values = game?.state?.values ?? {}
    $: bingo = game?.state?.bingo ?? {}
    $: bingoins = values.bingoins ?? 0
    $: availableBingoins = bingoins - (bingo.cost ?? 0)

</script>

<div class="container">
    <div class="table">
        <div class="title">S</div>
        <div class="title">U</div>
        <div class="title">P</div>
        <div class="title">E</div>
        <div class="title">R</div>
        {#each TABLES.SB.costs as line, y}
            {#each line as cost, x}
                <UISuperCell {game} {x} {y} {availableBingoins} />
            {/each}
        {/each}
        {#each Object.entries(TABLES.SB.slots) as [id, data]}
            <UISuperLine {game} {id} />
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
        background-color: #777722;
    }

    div.title {
        font-size: 6em;
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
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 6em;
        margin: -2em;
    }

</style>
