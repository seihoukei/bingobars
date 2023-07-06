<script>
    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"
    import interactive from "utility/interactive.js"
    import hoverable from "utility/hoverable.js"

    export let game

    const BINGO_TAB = 15
    const HELL_TAB = 16

    $: values = game?.state?.values ?? {}
    $: bingo = game?.state?.bingo ?? {}
    $: now = values.time ?? 0
    $: target = values.targetTime ?? 0
    $: catchup = target - now > 10
    $: bingoActive = game?.state?.tab === BINGO_TAB

    $: bingoins = values.bingoins ?? 0
    $: bingoinsSpent = bingo.cost ?? 0
    $: bingoinsFree = bingoins - bingoinsSpent

    $: timeText = {}

    function debugTime(time = 60) {
        if (/*import.meta.env.MODE === "development" || */game?.state?.lastExpression === "seihoukei") {
            Trigger("debug-time", time)
        }
    }
</script>

<div class="container">
    <div class="title">
        Bingo Bars
    </div>
    <div class="time"
         use:hoverable={catchup ? "Game time / Total time" : "Game time"}
         use:interactive
         on:basicaction={() => debugTime(60)}
         on:specialaction={() => debugTime(600)}
         on:debugaction={() => debugTime(3600)}
    >
        {StringMaker.formatValue(now, {type:StringMaker.VALUE_FORMATS.TIME})}
        {#if catchup}
            / {StringMaker.formatValue(target, {type:StringMaker.VALUE_FORMATS.TIME})}
        {/if}
    </div>
    <div class="bingoins" use:hoverable={`${bingoinsFree} Bingoins`}>
        <span class="bingoin-icon"></span>{bingoinsFree}
    </div>
    <div class="super-bingo button"
         class:active={bingoActive}
         use:interactive
         on:basicaction={() => bingoActive || Trigger("command-set-tab", BINGO_TAB)}
         on:debugaction={() => Trigger("command-set-tab", HELL_TAB)}>
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
        padding : 0.4em 0 0.4em 0.4em;
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
        display: flex;
        align-items: center;
        justify-content: start;
    }

    div.super-bingo {
        width: 7em;
        height : 2em;
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
