<script>
    import FG_COLORS from "data/fg-colors.js"
    import Trigger from "utility/trigger.js"

    export let game
    export let id
    export let base = ""
    export let table = false

    $: values = game?.state?.values ?? {}

    $: background = FG_COLORS[base] ?? "#333333"
    $: cssProperties = `--background:${background};`

    $: value = values[id] ?? 0

    $: unlocked = getUnlocked(id, values)

    function getUnlocked() {
        if (table) {
            return !!value
        }
        if (!values[`${base}_seen`])
            return false
        if (!values[`${id}_base`])
            return true
        return values[`${id}_seen`]
    }

    function explore() {
        if (unlocked)
            Trigger("command-explore-value", id, true)
    }
</script>

<div class="container"
     style={cssProperties}
     class:unlocked
     on:click={explore}
>
    {#if unlocked}
        <div class="value">{id}</div>
        <div class="main-section"></div>
    {/if}
</div>

<style>
    .container {
        position: relative;
        overflow: hidden;
        display: flex;
        background : var(--background);
        align-items: center;
        justify-content: center;
        width: 4em;
        height: 1.2em;
        border-radius: 0.5em;
    }

    .container.unlocked:hover {
        cursor: pointer;

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
    }

    div.container.unlocked:hover div.main-section {
        opacity: 0.2;
    }
</style>
