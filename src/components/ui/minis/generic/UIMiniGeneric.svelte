<script>
    import interactive from "utility/interactive.js"

    export let game
    export let id
    export let active = false

    $: ready = false
    $: title = `${id.slice(0,2)}\n${id.slice(2)}`
    $: uiSlot = id?.toLowerCase?.() ?? "none"
</script>

<div class="visible container"
     class:ready
     class:active
     style="--ui-slot:{uiSlot}"
     use:interactive
     on:basicaction
     on:specialaction
>
    <div class="data">
        <div class="id"> {title} </div>
    </div>
    <div class="highlight"></div>
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
        justify-content: center;
    }

    div.id {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4em;
        white-space: pre;
    }
</style>
