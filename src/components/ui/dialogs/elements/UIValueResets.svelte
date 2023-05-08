<script>
    import VALUES from "data/values.js"

    import StringMaker from "utility/string-maker.js"
    import getValuesCodes from "data/get-values-codes.js"

    export let game
    export let id

    $: baseValue = VALUES[id]?.baseValue ?? null
    $: resets = game?.state?.stats?.reset?.[baseValue] ?? []
    $: codes = getValuesCodes(baseValue)
</script>

{#if baseValue}
    <div class="resets">
        {#each resets as reset, index}
            <div class="bingo-section">
                <div class="item index">{index + 1}</div>
                <div class="item time">{StringMaker.formatValue(reset.time, {type: StringMaker.VALUE_FORMATS.TIME})}</div>
                <div class="item">{codes.X} = {StringMaker.formatValueById(reset[codes.X], codes.X)}</div>
                <div class="item">{codes.MX} = {StringMaker.formatValueById(reset[codes.MX], codes.MX)}</div>
                <div class="item">{codes.XP} = {StringMaker.formatValueById(reset[codes.XP], codes.XP)}</div>
            </div>
        {/each}
    </div>
{/if}

<style>
    div.resets {
        display: flex;
        flex-direction: column-reverse;
        row-gap: 0.3em;
        overflow : auto;
    }

    div.bingo-section {
        display: flex;
        align-items: center;
        justify-items: center;
        column-gap: 0.3em;
    }

    div.item {
        display: flex;
        font-size: 0.8em;
        width: 7.5em;
        height: 1em;
        align-items: center;
        justify-content: center;

        background-color: #333333;
        padding: 0.2em;
        border-radius: 0.5em;
    }

    div.index {
        width: 2em;
        background-color: #444444;
    }

    div.time {
        width: 4.5em;
        background-color: #444444;
    }

    div.bingo-section:hover div.item {
        background-color: #777777;
    }
</style>
