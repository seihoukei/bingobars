<script>
    import interactive from "utility/interactive.js"
    import UIProgressBar from "components/ui/elements/UIProgressBar.svelte"
    import FG_COLORS from "data/fg-colors.js"
    import formatString from "utility/format-string.js"
    import Trigger from "utility/trigger.js"
    import VALUES from "data/values.js"
    import UIMaxiValueDisplay from "components/ui/elements/UIMaxiValueDisplay.svelte"
    import UIMaxiExplanation from "components/ui/elements/UIMaxiExplanation.svelte"
    export let game
    export let id

    $: uiSlot = id?.toLowerCase?.() ?? "none"
    $: values = game?.state?.values ?? {}
    $: current = values[id]
    $: limit = values[`M${id}`]
    $: prestiges = values[`${id}P`]

    $: prestigeReady = current >= limit

    $: displayCodes = getDisplayCodes(id)

    let hover = {
        prestige : false,
        reset : false,
    }

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
        }).map(([id, value]) => [id, VALUES[id]?.description ?? value])
    }

    function prestige() {
        Trigger("command-prestige-value", id)
    }

    function reset() {
        Trigger("command-reset-value", id)
    }

    $: seen = {
        d : values[`d${id}_seen`],
    }

</script>

<div class="container"
     style="--ui-slot:{uiSlot}"
>
    {#if values}
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
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={id} {game} />
                <UIMaxiValueDisplay id={`d${id}`} {game} />
            </div>
            <div class="explanation">
                <UIMaxiExplanation
                        description={`Every second while ${id} < M${id}`}
                        formula={`${id} += d${id}`}
                        active={current < limit}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={`${id}P`} {game} />
                <UIMaxiValueDisplay id={`d${id}P`} {game} />
            </div>
            <div class="explanation">
                <UIMaxiExplanation
                        description="Every prestige"
                        formula={`${id}P += d${id}P`}
                        active={hover.prestige}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={`M${id}`} {game} />
                <UIMaxiValueDisplay id={`M${id}m`} {game} />
            </div>
            <div class="explanation prestige">
                <UIMaxiExplanation
                        description="Every prestige"
                        formula={`M${id} *= M${id}m`}
                        active={hover.prestige}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={`M${id}0`} {game} />
            </div>
            <div class="explanation reset">
                <UIMaxiExplanation
                        description="Every reset"
                        formula={`M${id} = M${id}0`}
                        active={hover.reset}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={`${id}Pc`} {game} />
            </div>
            <div class="explanation prestige">
                <UIMaxiExplanation
                        description="Every prestige"
                        formula={`${id} -= M${id} * ${id}Pc`}
                        active={hover.prestige}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={`${id}t`} {game} />
            </div>
            <div class="explanation reset">
                <UIMaxiExplanation
                        description="Every reset"
                        formula={`${id}t = 0`}
                        active={hover.reset}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={`${id}Pt`} {game} />
            </div>
            <div class="explanation prestige reset">
                <UIMaxiExplanation
                        description="Every reset or prestige"
                        formula={`${id}Pt = 0`}
                        active={hover.prestige || hover.reset}
                />
            </div>
        </div>
    </div>
    <div class="buttons">
        <div class="button"
             class:disabled={!prestigeReady}
             use:interactive
             on:basicaction={prestige}
             on:enter={() => hover.prestige = true}
             on:leave={() => hover.prestige = false}
        >
            Prestige {id}
            <div class="button-hint">
                You get prestige points
                and increased limit.
            </div>
        </div>
        <div class="button"
             use:interactive
             on:basicaction={reset}
             on:enter={() => hover.reset = true}
             on:leave={() => hover.reset = false}
        >
            Reset {id}
            <div class="button-hint">
                You lose everything
                and get nothing.
            </div>
        </div>
    </div>
    {/if}
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
        flex-direction: row;
        flex-wrap: wrap;
        column-gap: 0.5em;
        row-gap: 0.5em;
        align-items: start;
        font-size: 1.5em;
        justify-content: center;
        padding: 0 2em 1em;
    }

    div.block {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
        row-gap: 0.5em;
    }

    div.values {
        display: flex;
        flex-direction: row;
        column-gap: 0.5em;
    }

    div.explanation {
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
