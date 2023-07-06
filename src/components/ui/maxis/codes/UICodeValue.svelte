<script>
    import Trigger from "utility/trigger.js"
    import interactive from "utility/interactive.js"
    import hoverable from "utility/hoverable.js"
    import BASE_VALUES from "data/base-values.js"
    import Codes from "game-classes/codes.js"

    export let game
    export let id
    export let table = false


    $: values = game?.state?.values ?? {}
    $: seen = game?.state?.seen ?? {}
    $: code = Codes.get(id)
    $: base = code?.baseValue?.id
    $: baseCodes = BASE_VALUES[base]?.codes ?? {}

    $: background = BASE_VALUES[base]?.colors?.dark ?? "#333333"
    $: cssVariables = `--background:${background};--grid-area: ${id}`

    $: value = values[id] ?? 0

    $: unlocked = getUnlocked(id, values)

    function getUnlocked() {
        if (table) {
            return !!value
        }
        if (!values[baseCodes.X_seen])
            return false

        return (!code.derived || seen[id])
    }

    function explore() {
        if (unlocked)
            Trigger("command-explore-value", id, true)
    }

</script>

<div class="container"
     style={cssVariables}
     class:unlocked
     use:interactive
     on:basicaction={explore}

     use:hoverable={{code:id, hidden:!unlocked}}
>
    {#if unlocked}
        <div class="value">{id}</div>
        <div class="highlight"></div>
    {/if}
</div>

<style>
    .container {
        position: relative;
        overflow: hidden;
        display: flex;
        background-color: #555555;
        grid-area: var(--grid-area);
        align-items: center;
        justify-content: center;
        border-radius: 0.5em;
    }

    .container.unlocked {
        background : var(--background);
    }

    .container.unlocked:hover {
        cursor: pointer;

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

    div.container.unlocked:hover div.highlight {
        opacity: 0.2;
    }
</style>
