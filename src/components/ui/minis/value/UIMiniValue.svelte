<script>

    import FG_COLORS from "data/fg-colors.js"

    import interactive from "utility/interactive.js"
    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"
    import UIMiniValueBar from "components/ui/minis/value/UIMiniValueBar.svelte"

    export let game
    export let id
    export let active = false

    $: uiSlot = id?.toLowerCase?.() ?? "none"
    $: visible = game?.state?.values?.[`${id}_seen`]

    $: current = game?.state?.values?.[id]
    $: max = game?.state?.values?.[`M${id}`]
    $: prestiges = game?.state?.values?.[`${id}P`]

    $: ready = current >= max

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
            <UIMiniValueBar
                    {max}
                    {current}
                    bgcolor="inherit"
                    fgcolor={FG_COLORS[id]}
            />
        </div>
        <div class="data"
             use:interactive
             on:basicaction
             on:specialaction={prestige}
        >
            <div class="id">{id}</div>
            <div class="spacer"></div>
            <div class="current value">{StringMaker.formatValue(current, {type:StringMaker.VALUE_FORMATS.SCIENTIFIC})}</div>
            <div class="bingo-section"></div>
            <div class="max value">{StringMaker.formatValue(max, {type:StringMaker.VALUE_FORMATS.SCIENTIFIC})}</div>
            <div class="bigspacer"></div>
            <div class="id">{id}P</div>
            <div class="spacer"></div>
            <div class="prestiges value">{StringMaker.formatValue(prestiges, {type:StringMaker.VALUE_FORMATS.SCIENTIFIC})}</div>
        </div>
        <div class="main-section"></div>
    {/if}
</div>

<style>
    div.container {
        grid-area: var(--ui-slot);
        border-radius: 1em;
        background-color: #222222;
        position: relative;
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

    div.main-section {
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
    div.container.visible:not(.active):hover div.main-section {
        opacity: 0.2;
    }

    div.container.active div.main-section {
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
        justify-content: center;
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
    div.spacer {
        height: 0.2em;
    }
    div.bigspacer {
        height: 0.6em;
    }
    div.bingo-section {
        height: 1px;
        background-color: #CCCCCC;
        margin : 0 1em;
    }
    div.bar {
        position: absolute;
        left : 0;
        top : 0;
        bottom : 0;
        right : 0;
        z-index : 0;
        border-radius: 1em;
        overflow: hidden;
    }
</style>
