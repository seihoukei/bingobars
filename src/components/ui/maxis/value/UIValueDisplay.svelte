<script>
    import StringMaker from "utility/string-maker"
    import Trigger from "utility/trigger"
    import interactive from "utility/interactive.js"
    import Codes from "game-classes/codes.js"

    export let id
    export let game

    $: values = game?.state?.values ?? {}
    $: code = Codes.get(id)
    $: value = values[id]
    $: seen = game?.state?.seen?.[id] || !code.derived
    $: description = code.description ?? ""

    function explore() {
        if (seen)
            Trigger("command-explore-value", id)
    }
</script>

<div class="container"
     class:seen
     use:interactive
     on:basicaction={explore}>
    {#if seen}
        <div class="value">
            <span class="name">
                {id}
            </span>
            =
            <span class="value">
                {StringMaker.formatValueById(value, id)}
            </span>
        </div>
        <div class="description">
            {description}
        </div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        width : 100%;
        height : 100%;
        background-color: #444444;
        border-radius: 0.5em;
        transition: background-color 0.2s;
    }
    div.value {
        font-size : 1.2em;
    }
    div.description {
        font-size : 0.8em;
    }

    div.container.seen:hover {
        background-color: #555555;
        cursor: pointer;
    }

</style>
