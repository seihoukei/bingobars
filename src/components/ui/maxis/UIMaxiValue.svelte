<script>
    import interactive from "utility/interactive.js"
    import UIProgressBar from "components/ui/elements/UIProgressBar.svelte"
    import FG_COLORS from "data/fg-colors.js"
    import Trigger from "utility/trigger.js"
    import UIMaxiValueDisplay from "components/ui/maxis/elements/UIMaxiValueDisplay.svelte"
    import UIMaxiExplanation from "components/ui/maxis/elements/UIMaxiExplanation.svelte"
    import StringMaker from "utility/string-maker.js"
    import UIMaxiAutoPrestige from "components/ui/maxis/elements/UIMaxiAutoPrestige.svelte"
    export let game
    export let id

    const seen = {}

    const hover = {
        prestige : false,
        reset : false,
    }

    $: uiSlot = id?.toLowerCase?.() ?? "none"
    $: values = game?.state?.values ?? {}
    $: current = values[id]
    $: limit = values[`M${id}`]
    $: prestiges = values[`${id}P`]

    $: prestigeReady = current >= limit

    $: code = {
        X : id,
        dX : `d${id}`,
        MX : `M${id}`,
        MX0 : `M${id}0`,
        MXm : `M${id}m`,
        XP : `${id}P`,
        dXP : `d${id}P`,
        XPc : `${id}Pc`,
        Xt : `${id}t`,
        XPt : `${id}Pt`,
        X_auto : `${id}_auto`,
        X_auto_seen : `${id}_auto_seen`,
    }

    $: values, updateSeen()

    function updateSeen() {
        for (let [id, value] of Object.entries(code))
            seen[id] = values[`${value}_seen`]
    }

    function prestige() {
        Trigger("command-prestige-value", id)
    }

    function reset() {
        Trigger("command-reset-value", id)
    }


    $: progressMaker = StringMaker.template`${code.X} / ${code.MX}`
    $: progress = progressMaker.dynamicString(values)

    $: canAuto = values[code.X_auto_seen]
    $: auto = values[code.X_auto]

</script>

<div class="container"
     style="--ui-slot:{uiSlot};--value-color:{FG_COLORS[id]};"
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
                    caption={progress}
            />
        </div>
    </div>
    <div class="data">
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={code.X} {game} />
                <UIMaxiValueDisplay id={code.dX} {game} />
            </div>
            <div class="explanation">
                <UIMaxiExplanation
                        description={`Every second while ${code.X} < ${code.MX}`}
                        formula={seen.dX ? `${code.X} += ${code.dX}` : `${code.X} += ${values[`${code.dX}_base`]}`}
                        active={current < limit && !hover.prestige && !hover.reset}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={code.XP} {game} />
                <UIMaxiValueDisplay id={code.dXP} {game} />
            </div>
            <div class="explanation">
                <UIMaxiExplanation
                        description="Every prestige"
                        formula={seen.dXP ?`${code.XP} += ${code.dXP}` : `${code.XP} += 1`}
                        active={hover.prestige}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={code.XPc} {game} />
            </div>
            <div class="explanation prestige">
                <UIMaxiExplanation
                        description="Every prestige"
                        formula={seen.XPc ? `${code.X} -= ${code.MX} * ${code.XPc}` : `${code.X} = 0`}
                        active={hover.prestige}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={code.MX} {game} />
                <UIMaxiValueDisplay id={code.MXm} {game} />
            </div>
            <div class="explanation prestige">
                <UIMaxiExplanation
                        description="Every prestige"
                        formula={seen.MXm ? `${code.MX} *= ${code.MXm}` : `${code.MX} *= ${values[`${code.MXm}_base`]}`}
                        active={hover.prestige}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={code.MX0} {game} />
            </div>
            <div class="explanation reset">
                <UIMaxiExplanation
                        description="Every reset"
                        formula={seen.MX0 ? `${code.MX} = ${code.MX0}` : `${code.MX} = ${values[`${code.MX0}_base`]}`}
                        active={hover.reset}
                />
            </div>
        </div>
        <div class="block">
            <UIMaxiAutoPrestige {id} {canAuto} {auto}/>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={code.XPt} {game} />
            </div>
            <div class="explanation prestige reset">
                <UIMaxiExplanation
                        description="Every reset or prestige"
                        formula={`${code.XPt} = 0`}
                        active={hover.prestige || hover.reset}
                />
            </div>
        </div>
        <div class="block">
            <div class="values">
                <UIMaxiValueDisplay id={code.Xt} {game} />
            </div>
            <div class="explanation reset">
                <UIMaxiExplanation
                        description="Every reset"
                        formula={`${code.Xt} = 0`}
                        active={hover.reset}
                />
            </div>
        </div>
        <div class="block">
            <div class="explanation reset">
                <UIMaxiExplanation
                        description="Every reset"
                        formula={`${code.X} = 0`}
                        active={hover.reset}
                />
            </div>
            <div class="explanation reset">
                <UIMaxiExplanation
                        description="Every reset"
                        formula={`${code.XP} = 0`}
                        active={hover.reset}
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
                You get {id}P ({id} points)
                and increased limit.
            </div>
            <div class="button-highlight">

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
            <div class="button-highlight">

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
        position: relative;
        font-size: 3em;
        padding: 0.25em 0.5em;
        border-radius: 0.5em;
        width : 7em;
        height : 3em;
        background-color: var(--value-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
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
    }

    div.button-highlight {
        z-index: 3;
        pointer-events: none;
        position: absolute;
        left : 0;
        top : 0;
        width : 100%;
        height : 100%;
        background-color: #FFFFFF;
        opacity : 0;
        transition: opacity 0.2s;
    }

    div.button:not(.disabled):hover div.button-highlight {
        opacity: 0.2;
    }

</style>
