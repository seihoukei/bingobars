<script>
    import Trigger from "utility/trigger.js"
    import StringMaker from "utility/string-maker.js"

    export let game
    export let id

    let saveText = ""

    $: values = game?.state?.values ?? {}

    $: now = values.time ?? 0
    $: target = values.targetTime ?? 0

    function exportSave() {
        Trigger("command-export-save")
    }

    function importSave() {
        if (saveText === "")
            return

        Trigger("command-import-save", saveText)
    }

    function resetState() {
        if (!confirm("Reset game?"))
            return
        Trigger("command-reset-game")
    }



</script>

<div class="content">
    <img src="../resources/logo.svg">
    <div class="dev">by seihoukei</div>

    <div>Processed time: {StringMaker.formatValue(now, {type:StringMaker.VALUE_FORMATS.TIME})}</div>
    <div>Total time: {StringMaker.formatValue(target, {type:StringMaker.VALUE_FORMATS.TIME})}</div>
    <div class="row">
        <input class="savetext" placeholder="Paste save here" bind:value={saveText}/>
        <div class="button" on:click={importSave}>Import</div>
    </div>
    <div class="row">
        <div class="button" on:click={exportSave}>Export game</div>
        <div class="button" on:click={resetState}>Reset game</div>
    </div>
</div>
<style>
    div.content {
        font-size: 4em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    img {
        width: 13em;
        height: 2.6em;
    }

    input.savetext {
        font-size: 1em;
        background-color: #222222;
        color:#CCCCCC;
        border-radius: 0.2em;
        height: 1.5em;
        width: 10em;
        text-align: center;
    }

    div.row {
        display: flex;
        flex-direction: row;
        column-gap: 0.5em;
        padding: 0.5em;
        align-items: center;
        justify-content: center;
    }
    div.button {
        padding : 0.5em;
        border-radius: 0.5em;
        background-color: #440000;
        cursor : pointer;
        transition: background-color 0.2s;
    }

    div.button:hover {
        background-color: #772222;

    }

    div.dev {
        font-size : 0.4em;
        display: flex;
        align-items: end;
        justify-content: end;
        width: 30em;
        margin: -1em 0 1em;
    }
</style>
