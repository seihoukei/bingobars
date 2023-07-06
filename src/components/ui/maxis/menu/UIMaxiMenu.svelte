<script>
    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"
    import interactive from "utility/interactive.js"
    import {onMount} from "svelte"
    import registerTrigger from "utility/register-trigger.js"

    export let game
    export let id

    const SLOTS = ["","SAVE1","SAVE2","SAVE3"]
    const SETTINGS_TAB = 17

    let saveText = ""
    let slotInfo = {}

    registerTrigger("save-info-updated", updateSaveInfo)

    $: values = game?.state?.values ?? {}

    $: now = values.time ?? 0
    $: target = values.targetTime ?? 0

    function exportSave() {
        Trigger("command-export-save")
    }

    function importSave(processOffline) {
        if (saveText === "")
            return

        Trigger("command-import-save", saveText, processOffline)
    }

    function resetState() {
        if (!confirm("Reset game?"))
            return
        Trigger("command-reset-game")
    }

    function save(slot) {
        Trigger("command-save-game", slot)
    }

    function load(slot, offlineTime = true) {
        Trigger("command-load-game", slot, offlineTime)
    }

    function updateSaveInfo(info) {
        slotInfo = info
    }

    function settings() {
        Trigger("command-set-tab", SETTINGS_TAB)
    }

    onMount(() => {
        Trigger("command-update-save-info", SLOTS)
    })

</script>

<div class="content">
    <img src="./resources/logo.svg" alt="Bingo Bars Logo">
    <div class="dev">by seihoukei</div>

    <div class="time">Game time: {StringMaker.formatValue(now, {type:StringMaker.VALUE_FORMATS.TIME})}{#if target - now > 10} / {StringMaker.formatValue(target, {type:StringMaker.VALUE_FORMATS.TIME})}{/if}</div>
    <div class="saves">
        {#each SLOTS as slot}
            <div class="save">
                {#if slot !== ""}
                <div class="button"
                     use:interactive
                     on:basicaction={() => save(slot)}
                >Save >> </div>
                {:else}
                    <div class="autosave">
                        Autosave:
                    </div>
                {/if}
                <div class="saveinfo">
                    {#if slotInfo[slot]?._date}
                        {new Date(slotInfo[slot]?._date).toLocaleDateString()} {new Date(slotInfo[slot]?._date).toLocaleTimeString()}
                        |
                        {StringMaker.formatValue(slotInfo[slot]?.time ?? 0, {type:StringMaker.VALUE_FORMATS.TIME})}
                        |
                        {(slotInfo[slot]?.SN ?? 0) / 185 * 100 | 0}%
                    {:else}
                        -- empty --
                    {/if}
                </div>
                <div class="button"
                     use:interactive
                     on:basicaction={() => load(slot)}
                     on:specialaction={() => load(slot, false)}
                > >> Load</div>
            </div>
        {/each}
        <div class="save">
            <div class="button"
                 use:interactive
                 on:basicaction={exportSave}
            >Export >></div>
            <input class="savetext" placeholder="Paste save here" bind:value={saveText}/>
            <div class="button"
                 use:interactive
                 on:basicaction={() => importSave(true)}
                 on:specialaction={() => importSave(false)}
            >>> Import</div>
        </div>
        <div class="savehint">
            Right-click/long-tap to load without adding offline time.
        </div>
    </div>
    <div class="row">
        <div class="button"
             use:interactive
             on:basicaction={() => load("RESET")}
             on:specialaction={() => load("RESET", false)}
        > Undo reset </div>

        <div class="button" use:interactive
             on:basicaction={settings}>Settings</div>

        <div class="button" use:interactive
             on:basicaction={resetState}>Reset game</div>
    </div>
</div>
<style>
    div.content {
        font-size: 3em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    img {
        width: 15em;
        height: 3em;
    }

    input.savetext {
        font-size: 1em;
        background-color: #222222;
        color:#CCCCCC;
        border-radius: 0.2em;
        border: none;
        height: 1.5em;
        width: 10em;
        text-align: center;
    }

    div.row {
        display: flex;
        flex-direction: row;
        column-gap: 2em;
        padding: 0.2em;
        align-items: center;
        justify-content: center;
    }

    div.button {
        padding : 0.1em 0.5em;
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

    div.saves {
        display: flex;
        flex-direction: column;
        width: 100%;
        row-gap: 1rem;
        align-items: stretch;
        justify-content: center;
    }
    div.save {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background-color: #222222;
        border-radius: 0.5em;
    }

    div.saveinfo {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7em;
    }

    div.autosave {
        padding: 0.2em 0.5em;
    }

    div.time {
        padding: 0.2em 0 0.5em;
    }

    div.savehint {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8em;
    }
</style>
