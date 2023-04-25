<script>
    import interactive from "utility/interactive.js"
    import Trigger from "utility/trigger.js"
    import formatString from "utility/format-string.js"
    import UIMiniBar from "components/ui/elements/UIMiniBar.svelte"
    import FG_COLORS from "data/fg-colors.js"

    export let game
    export let id
    export let active = false

    $: uiSlot = id?.toLowerCase?.() ?? "none"
    $: visible = game?.state?.values?.[`${id}seen`]

    $: current = game?.state?.values?.[id]
    $: max = game?.state?.values?.[`M${id}`]
    $: prestiges = game?.state?.values?.[`${id}p`]

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
            <UIMiniBar
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
            <div class="current value">{formatString`${current}`}</div>
            <div class="line"></div>
            <div class="max value">{formatString`${max}`}</div>
            <div class="spacer"></div>
            <div class="prestiges value">{formatString`${prestiges}`}</div>
        </div>
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
        background-color: #777777;
        cursor: pointer;
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


    div.container.visible {
        background-color: #666666;
    }
    div.container.ready {
        background-color: #888866;
    }
    div.container.visible.active {
        background-color: #888888;
    }
    div.container.ready.active {
        background-color: #AAAA66;
    }

    div.id {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
    }
    div.value {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4em;
    }
    div.spacer {
        height: 1em;
    }
    div.line {
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
