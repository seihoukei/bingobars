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

    $: cssVariables = `--bar-color:${colors.dark};--bar-hover-color:${colors.normal}`

    function prestige() {
        if (ready)
            Trigger("command-prestige-value", id)
    }
</script>

<div class="container"
     class:visible
     class:ready
     class:active
     style="--ui-slot:{uiSlot}"
>
    {#if visible}
        <div class="bar">
            <UIMiniValueBar {id} {game}/>
        </div>
        <div class="data"
             use:interactive
             on:basicaction
             on:specialaction={prestige}
        >
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
        </div>
        <div class="highlight"></div>
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
    div.container.visible:not(.active):hover {
        cursor: pointer;
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
        border-radius: 1em;
    }

    div.container.visible:not(.active):hover div.highlight {
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
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-evenly;
    }


    div.id {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
        margin : 0 0 -0.2em;
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
</style>
