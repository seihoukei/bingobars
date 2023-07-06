<script>
    import interactive from "utility/interactive.js"
    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"
    import UIMiniValueBar from "components/ui/minis/value/UIMiniValueBar.svelte"
    import BASE_VALUES from "data/base-values.js"

    export let game
    export let id
    export let active = false

    $: uiSlot = id?.toLowerCase?.() ?? "none"

    $: values = game?.state?.values ?? {}
    $: codes = BASE_VALUES[id]?.codes ?? {}

    $: visible = values[codes.X_seen]
    $: current = values[codes.X]
    $: max = values[codes.MX]
    $: prestiges = values[codes.XP]

    $: ready = current >= max

    $: colors = BASE_VALUES[id].colors

    $: cssVariables = `--ui-slot:${uiSlot};--bar-color:${colors.dark};--bar-hover-color:${colors.normal};--button-color:${colors.normal}`

    function prestige() {
        if (ready)
            Trigger("command-prestige-value", id)
    }

    function reset() {
        Trigger("command-reset-value", id)
    }
</script>

<div class="container"
     class:visible
     class:ready
     class:active
     style={cssVariables}
>
    {#if visible}
        <div class="elements">
            {#if game?.state?.settings?.quickPrestige}
                <div class="prestige button"
                     class:ready
                     use:interactive
                     on:basicaction={prestige}
                >
                    Prestige
                </div>
            {/if}
            <div class="bar"
                 use:interactive
                 on:basicaction
                 on:specialaction={prestige}
            >
                <UIMiniValueBar {id} {game}/>
                <div class="data">
                    <div class="display">
                        <div class="id">{id}</div>
                        <div class="progress">
                            <div class="current value">{StringMaker.formatValue(current, {type:StringMaker.VALUE_FORMATS.SCIENTIFIC})}</div>
                            <div class="line"></div>
                            <div class="max value">{StringMaker.formatValue(max, {type:StringMaker.VALUE_FORMATS.SCIENTIFIC})}</div>
                        </div>
                    </div>
                    <div class="display">
                        <div class="id">{id}P</div>
                        <div class="prestiges value">{StringMaker.formatValue(prestiges, {type:StringMaker.VALUE_FORMATS.SCIENTIFIC})}</div>
                    </div>
                    <div class="highlight"></div>
                </div>
            </div>
            {#if game?.state?.settings?.quickReset}
                <div class="reset button ready"
                     use:interactive
                     on:basicaction={reset}
                >
                    Reset
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    div.container {
        grid-area: var(--ui-slot);

        position: relative;
        border-radius: 1em;

        background-color: #222222;
        transition: background-color 0.2s;
    }

    div.container.ready {
        background-color: #888866;
    }
    div.container.visible {
        background-color: #666666;
    }

    div.highlight {
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

    div.bar:hover div.highlight {
        opacity: 0.2;
    }

    div.container.active div.highlight {
        opacity: 0.4;
    }

    div.data {
        z-index : 1;
        position: absolute;
        left : 0;
        top : 0;
        right : 0;
        bottom : 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-evenly;
        pointer-events: none;
    }


    div.id {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
        margin : -0.2em 0 -0.4em;
    }
    div.value {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4em;
    }
    div.line {
        height: 1px;
        background-color: #CCCCCC;
        margin : 0 1em;
    }

    div.display {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        row-gap: 1rem;
    }

    div.progress {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
    }

    div.elements {
        position: absolute;
        left : 0;
        top : 0;
        right : 0;
        bottom : 0;

        display : flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;

        border-radius: 1em;
        overflow: hidden;
    }

    div.button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2em;
        background-color: #555555;
    }

    div.button.ready {
        cursor : pointer;
        background-color: var(--button-color);
    }

    div.bar {
        flex:1;
        position: relative;
    }

    div.bar:not(div.active div) {
        cursor: pointer;
    }
</style>
