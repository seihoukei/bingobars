<script>
    import SUPER_BINGO from "data/super-bingo.js"
    import UIMaxiBingoCell from "components/ui/maxis/elements/UIMaxiBingoCell.svelte"
    import UIMaxiBingoLine from "components/ui/maxis/elements/UIMaxiBingoLine.svelte"

    export let game
    export let id

    $: values = game?.state?.values ?? {}
    $: bingo = game?.state?.bingo ?? {}
    $: bingoins = values.bingoins ?? 0
    $: availableBingoins = bingoins - (bingo.cost ?? 0)

</script>

<div class="container">
    <div class="title">
        SUPER BINGO
    </div>
    <div class="bingoins">
        <span class="bingoin-icon"></span> {availableBingoins} / {bingoins}
    </div>
    <div class="table">
        {#each SUPER_BINGO.costs as line, y}
            {#each line as cost, x}
                <UIMaxiBingoCell {game} {x} {y} {availableBingoins} />
            {/each}
        {/each}
        {#each Object.entries(SUPER_BINGO.lines) as [id, data]}
            <UIMaxiBingoLine {game} {id} />
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
        justify-content: center;
        background-color: #777722;
    }

    div.title {
        font-size: 6em;
    }

    div.bingoins {
        font-size: 2em;
        margin-bottom: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    div.table {
        display: grid;
        grid-auto-columns: 8em 8em 8em 8em 8em 8em 8em;
        grid-auto-rows: 5em 5em 5em 5em 5em 5em;
        grid-row-gap: 1em;
        grid-column-gap: 1em;
    }

</style>
