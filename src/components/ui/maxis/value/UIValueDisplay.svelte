<script>
    import VALUES from "data/values"

    import StringMaker from "utility/string-maker"
    import Trigger from "utility/trigger"

    export let id
    export let game

    $: values = game?.state?.values ?? {}
    $: value = values[id]
    $: seen = values[`${id}_seen`] || (values[`${id}_base`] === undefined)
    $: description = VALUES[id].description

    function explore() {
        if (seen)
            Trigger("command-explore-value", id)
    }
</script>

<div class="container" class:seen on:click={explore}>
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
            {VALUES[id].description}
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
