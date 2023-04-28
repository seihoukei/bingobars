<script>
    import interactive from "utility/interactive.js"
    import UIProgressBar from "components/ui/elements/UIProgressBar.svelte"
    import FG_COLORS from "data/fg-colors.js"
    import formatString from "utility/format-string.js"
    import Trigger from "utility/trigger.js"
    export let game
    export let id

    $: uiSlot = id?.toLowerCase?.() ?? "none"
    $: values = game?.state?.values ?? {}
    $: current = values[id]
    $: limit = values[`M${id}`]
    $: prestiges = values[`${id}P`]

    $: prestigeReady = current >= limit

    $: displayCodes = getDisplayCodes(id)

    function getDisplayCodes(id) {
        return Object.entries({
            [id] : "Current value",
            [`d${id}`] : "Growth speed",
            [`M${id}`] : "Current limit",
            [`M${id}m`] : "Prestige limit multiplier",
            [`M${id}0`] : "Limit after reset",
            [`${id}P`] : "Current prestige points",
            [`d${id}P`] : "Prestige points per prestige",
            [`${id}Pc`] : "Fraction of value lost on prestige",
            [`${id}t`] : "Time since last reset",
            [`${id}Pt`] : "Time since last prestige",
        })
    }

    function prestige() {
        Trigger("command-prestige-value", id)
    }

    function reset() {
        Trigger("command-reset-value", id)
    }

</script>

<div class="container"
     style="--ui-slot:{uiSlot}"
>
    <div class="bar-line">
        <div class="bar-id">{id}</div>
        <div class="bar">
            <UIProgressBar
                    bgcolor="#888888"
                    fgcolor={FG_COLORS[id]}
                    {current}
                    max={limit}
                    caption={formatString`${current} / ${limit}`}
            />
        </div>
    </div>
    <div class="data">
        {#each displayCodes as [code, description]}
            <div>
                {formatString`${description} (${code}): ${values[code]}`}
            </div>
        {/each}
    </div>
    <div class="buttons">
        <div class="button"
             class:disabled={!prestigeReady}
             use:interactive on:basicaction={prestige}>
            Prestige {id}
            <div class="button-hint">
                You get prestige points
                and increased limit.
            </div>
        </div>
        <div class="button" use:interactive on:basicaction={reset}>
            Reset {id}
            <div class="button-hint">
                You lose everything
                and get nothing.
            </div>
        </div>
    </div>
</div>

<style>
    div.container {
        grid-area: var(--ui-slot);
        border-radius: 1em;
        position: relative;
        width : 70em;
        height : 50em;
    }

    div.data {
        z-index : 1;
        display: flex;
        flex-direction: column;
        align-items: start;
        font-size: 2em;
        justify-content: center;
        padding: 0 2em 1em;
    }

    div.bar-line {
        height: 2em;
        font-size: 5em;
        display: flex;
        align-items: center;
    }

    div.bar-id {
        font-size: 2em;
        margin-right: 0.2em;
    }

    div.bar {
        height: 2em;
        flex : 1;
        border-radius: 0.2em;
        font-size: 0.5em;
        overflow: hidden;
    }

    div.buttons {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width : 100%;
    }

    div.button {
        font-size: 4em;
        padding: 0.25em 0.5em;
        border-radius: 0.5em;
        background-color: #000077;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }

    div.button.disabled {
        background-color: #444444;
    }

    div.button-hint {
        font-size: 0.5em;
        white-space: pre-line;
        text-align: center;
    }

    div.button:not(.disabled):hover {
        cursor: pointer;
        background-color: #222299;
    }

</style>
