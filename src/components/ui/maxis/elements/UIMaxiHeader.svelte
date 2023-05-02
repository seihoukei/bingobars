<script>
    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"

    export let game

    const BINGO_TAB = 15

    $: values = game?.state?.values ?? {}
    $: bingo = game?.state?.bingo ?? {}
    $: now = values.time ?? 0
    $: target = values.targetTime ?? 0
    $: catchup = target - now > 10
    $: bingoActive = game?.state?.tab === BINGO_TAB

    $: bingoins = values.bingoins ?? 0
    $: bingoinsSpent = bingo.cost ?? 0
    $: bingoinsFree = bingoins - bingoinsSpent
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
        {bingoinsFree} Bingoins
    </div>
    <div class="super-bingo button"
         class:active={bingoActive}
         on:click={() => Trigger("command-set-tab", BINGO_TAB)}>
        <span>Super</span> <span>Bingo</span>
    </div>
</div>

<style>
    @keyframes shine {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: 7em;
        }
    }

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
        flex-direction: row;
        column-gap: 1em;
        align-items: center;
        justify-content: center;
        border-radius: 0.5em;
        background: linear-gradient(-58deg, #998822, #998822 47%, #DDDDDD 47%, #DDDDDD 53%, #998822 53%, #998822);
    }

    div.super-bingo.active {
        animation: shine 2s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    div.super-bingo span:first-child {
        margin-top: -0.2em;
    }
    div.super-bingo span:last-child {
        margin-bottom: -0.2em;
    }

    div.super-bingo:not(.active):hover {
        cursor: pointer;
        animation: shine 1s;
    }

</style>