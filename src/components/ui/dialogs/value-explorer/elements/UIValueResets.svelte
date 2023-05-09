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
    <div class="table">
        {#each resets as reset, index}
            <div class="line">
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

    div.table {
        flex : 1;
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
        overflow : hidden auto;
        align-items: stretch;
        justify-content: stretch;
    }

    div.line {
        display: grid;
        grid-template-columns: 1fr 2fr 3fr 3fr 3fr;
        grid-auto-rows: 1em;
        column-gap: 1rem;
    }

    div.item {
        display: flex;
        font-size: 0.8em;
        align-items: center;
        justify-content: center;

        background-color: #333333;
        padding: 0.5rem;
        border-radius: 0.5em;

        overflow: hidden;
        white-space: nowrap;
    }

    div.index {
        background-color: #444444;
    }

    div.time {
        background-color: #444444;
    }

    div.line:hover div.item {
        background-color: #777777;
    }
</style>
