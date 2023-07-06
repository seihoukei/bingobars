<script>
    import interactive from "utility/interactive.js"
    import Trigger from "utility/trigger.js"
    export let game
    export let id

    $: settings = game?.state?.settings ?? {}

    function setSetting(id, value) {
        Trigger("command-set-setting", id, value)
    }

    function toggle(id) {
        setSetting(id, !settings[id])
    }
</script>

<div class="list">
    {#each Object.entries(settings) as [id, value]}
        <div class="item"
             class:active={value}
             use:interactive
             on:basicaction={() => toggle(id)}
        >{id}</div>
    {/each}
</div>

<style>
    div.list {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        row-gap: 1rem;
        font-size: 2em;
    }

    div.item {
        background-color: #444444;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
        padding: 1rem 5rem;
        cursor : pointer;
    }

    div.item.active {
        background-color: #000044;
    }
</style>
