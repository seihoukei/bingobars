<script>
    import StringMaker from "utility/string-maker.js"

    export let game

    $: values = game?.state?.values
    $: now = values.time ?? 0
    $: target = values.targetTime ?? 0
    $: catchup = target - now > 10

</script>

<div class="container">
    <div class="title">
        Bingo Bars
    </div>
    <div class="time">
        {StringMaker.formatValue(now, {type:StringMaker.VALUE_FORMATS.TIME})}
        {#if catchup}
            / {StringMaker.formatValue(target, {type:StringMaker.VALUE_FORMATS.TIME})}
        {/if}
    </div>
    <div class="bingoins">
        0 Bingoins
    </div>
    <div class="super-bingo button">
        Super Bingo
    </div>
</div>

<style>
    div.container {
        font-size: 2em;
        height: 1.2em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    div.time {
        width: 8em;
        display: flex;
        align-items: center;
        justify-content: left;
    }

    div.title {
        padding: 0 0.5em;
        width: 8em;
    }

    div.bingoins {
        width: 7em;
    }

    div.super-bingo {
        width: 7em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5em;
        background-color: #222277;
    }

</style>