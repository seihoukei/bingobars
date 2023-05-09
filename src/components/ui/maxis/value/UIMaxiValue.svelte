<script>
    import UIProgressBar from "components/ui/common-elements/UIProgressBar.svelte"

    import FG_COLORS from "data/fg-colors.js"

    import getValuesCodes from "data/get-values-codes.js"
    import interactive from "utility/interactive.js"
    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"
    import UIValueDisplay from "components/ui/maxis/value/UIValueDisplay.svelte"
    import UIValueExplanation from "components/ui/maxis/value/UIValueExplanation.svelte"
    import UIValueAutoPrestige from "components/ui/maxis/value/UIValueAutoPrestige.svelte"

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

    $: code = getValuesCodes(id)

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


    $: current = values[code.X] ?? 0
    $: limit = values[code.MX] ?? 1
    $: speed = values[code.dX] ?? 0
    $: ETA =
        current === limit ? "Complete" :
        speed === 0 ? "Never" :
        `ETA: ${StringMaker.formatValue((limit - current) / speed, {type:StringMaker.VALUE_FORMATS.TIME})}`


    $: canAuto = values[code.X_auto_seen]
    $: auto = values[code.X_auto]


</script>

<div class="container"
     style="--value-color:{FG_COLORS[id]};"
>
    {#if values}
    <div class="bar-line">
        <div class="bar-id">{id}</div>
        <div class="bar">
            <UIProgressBar
                    bgcolor="#888888"
                    fgcolor={FG_COLORS[id]}
                    {current}
                    max={limit}>
                <span slot="caption" class="caption">
                    <span class="current">{StringMaker.formatValueById(current, code.X)}</span>
                    /
                    <span class="limit">{StringMaker.formatValueById(limit, code.X)}</span>
                    <span class="eta">({ETA})</span>

                </span>
            </UIProgressBar>
        </div>
    </div>
    <div class="table">
        <div class="value slot x"><UIValueDisplay id={code.X} {game} /></div>
        <div class="value slot dx"><UIValueDisplay id={code.dX} {game} /></div>
        <div class="value slot xp"><UIValueDisplay id={code.XP} {game} /></div>
        <div class="value slot dxp"><UIValueDisplay id={code.dXP} {game} /></div>
        <div class="value slot xpc"><UIValueDisplay id={code.XPc} {game} /></div>
        <div class="value slot mx"><UIValueDisplay id={code.MX} {game} /></div>
        <div class="value slot mxm"><UIValueDisplay id={code.MXm} {game} /></div>
        <div class="value slot mx0"><UIValueDisplay id={code.MX0} {game} /></div>
        <div class="value slot xpt"><UIValueDisplay id={code.XPt} {game} /></div>
        <div class="value slot xt"><UIValueDisplay id={code.Xt} {game} /></div>
        <div class="slot auto-x">
            <UIValueAutoPrestige {id} {canAuto} {auto}/>
        </div>
        <div class="explanation slot x-dx">
            <UIValueExplanation
                    description={`Every second while ${code.X} < ${code.MX}`}
                    formula={seen.dX ? `${code.X} += ${code.dX}` : `${code.X} += ${values[`${code.dX}_base`]}`}
                    active={current < limit && !hover.prestige && !hover.reset}
            />
        </div>
        <div class="explanation slot xp-dxp">
            <UIValueExplanation
                    description="Every prestige"
                    formula={seen.dXP ?`${code.XP} += ${code.dXP}` : `${code.XP} += 1`}
                    active={hover.prestige}
            />
        </div>
        <div class="explanation prestige slot x-mx">
            <UIValueExplanation
                    description="Every prestige"
                    formula={seen.XPc ? `${code.X} -= ${code.MX} * ${code.XPc}` : `${code.X} = 0`}
                    active={hover.prestige}
            />
        </div>
        <div class="explanation prestige slot mx-mxm">
            <UIValueExplanation
                    description="Every prestige"
                    formula={seen.MXm ? `${code.MX} *= ${code.MXm}` : `${code.MX} *= ${values[`${code.MXm}_base`]}`}
                    active={hover.prestige}
            />
        </div>
        <div class="explanation reset slot mx-mx0">
            <UIValueExplanation
                    description="Every reset"
                    formula={seen.MX0 ? `${code.MX} = ${code.MX0}` : `${code.MX} = ${values[`${code.MX0}_base`]}`}
                    active={hover.reset}
            />
        </div>
        <div class="explanation prestige reset slot xpt-0">
            <UIValueExplanation
                    description="Every reset or prestige"
                    formula={`${code.XPt} = 0`}
                    active={hover.prestige || hover.reset}
            />
        </div>
        <div class="explanation reset slot xt-0">
            <UIValueExplanation
                    description="Every reset"
                    formula={`${code.Xt} = 0`}
                    active={hover.reset}
            />
        </div>
        <div class="explanation reset slot x-0">
            <UIValueExplanation
                    description="Every reset"
                    formula={`${code.X} = 0`}
                    active={hover.reset}
            />
        </div>
        <div class="explanation reset slot xp-0">
            <UIValueExplanation
                    description="Every reset"
                    formula={`${code.XP} = 0`}
                    active={hover.reset}
            />
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
        position: absolute;
        left : 1rem;
        top : 1rem;
        right: 1rem;
        bottom: 1rem;

        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;

        row-gap: 1rem;
    }

    div.bar-line {
        height: 2em;
        font-size: 5em;
        display: flex;
        align-items: center;
    }

    div.bar-id {
        font-size: 2em;
        margin: 0 0.2em 0 0.1em;
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

    span.caption {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        column-gap: 0.3em;
    }

    span.current {
        display: flex;
        width: 4em;
        justify-content: end;
    }

    span.limit {
        display: flex;
        width: 4em;
    }

    span.eta {
        display: flex;
        width: 8em;
    }

    div.table {
        flex: 1;
        font-size: 1.5em;

        display: grid;
        grid-template:
            "x dx xp dxp"
            "x-dx x-dx xp-dxp xp-dxp"
            "xpc mx mxm mx0"
            "x-mx mx-mxm mx-mxm mx-mx0"
            "auto-x xpt xt x-0"
            "auto-x xpt-0 xt-0 xp-0";
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        row-gap : 1rem;
        column-gap: 1rem;
    }

    @media (max-aspect-ratio: 5/8) {
        div.table {
            font-size: 2em;
            grid-template:
                "x dx xpc"
                "x-dx x-dx x-mx"
                "mx mxm mx0"
                "mx-mxm mx-mxm mx-mx0"
                "xp dxp x-0"
                "xp-dxp xp-dxp xp-0"
                "auto-x xpt xt"
                "auto-x xpt-0 xt-0";
            grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
            grid-template-columns: 1fr 1fr 1fr;
        }
    }

    div.slot.x {grid-area: x}
    div.slot.dx {grid-area: dx}
    div.slot.xp {grid-area: xp}
    div.slot.dxp {grid-area: dxp}
    div.slot.x-dx {grid-area: x-dx}
    div.slot.xp-dxp {grid-area: xp-dxp}
    div.slot.xpc {grid-area: xpc}
    div.slot.mx {grid-area: mx}
    div.slot.mxm {grid-area: mxm}
    div.slot.mx0 {grid-area: mx0}
    div.slot.x-mx {grid-area: x-mx}
    div.slot.mx-mxm {grid-area: mx-mxm}
    div.slot.mx-mx0 {grid-area: mx-mx0}
    div.slot.auto-x {grid-area: auto-x}
    div.slot.xpt {grid-area: xpt}
    div.slot.xt {grid-area: xt}
    div.slot.x-0 {grid-area: x-0}
    div.slot.xp-0 {grid-area: xp-0}
    div.slot.xt-0 {grid-area: xt-0}
    div.slot.xpt-0 {grid-area: xpt-0}

</style>
