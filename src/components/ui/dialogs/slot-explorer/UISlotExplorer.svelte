<script>
    import interactive from "utility/interactive.js"
    import BingoTable from "game-classes/bingo-table.js"
    import TABLES from "data/tables.js"
    import Trigger from "utility/trigger.js"
    import UISlotCalculation from "components/ui/dialogs/slot-explorer/elements/UISlotCalculation.svelte"

    export let game
    export let id = null

    let holder

    $: tableId = id?.slice(0,2) ?? null
    $: slot = TABLES[tableId]?.slots?.[id.slice(2)] ?? {}

    $: conditions = slot?.conditions?.filter(x => !x.hidden) ?? []
    $: modifiers = slot?.modifiers?.filter(x => !x.hidden) ?? []

    $: conditionText = slot?.conditionText ?? null
    $: modifierText = slot?.modifierText ?? null

    $: cssVariables = ""

    $: state = game?.state?.tables?.[id] ?? 0

    $: visible = state & BingoTable.SLOT_STATES.VISIBLE
    $: seen = visible &&  state & BingoTable.SLOT_STATES.PREREQUISITES_MET
    $: available = seen && (state & BingoTable.SLOT_STATES.UNLOCKABLE) === BingoTable.SLOT_STATES.UNLOCKABLE
    $: unlocked = state & BingoTable.SLOT_STATES.UNLOCKED
    $: enabled = state & BingoTable.SLOT_STATES.ENABLED

    $: action =
        enabled ? "Disable" :
        unlocked ? "Enable" :
        "Unlock"

    $: active = enabled ? !slot.oneWay : unlocked || available

    function clickOutside(event) {
        if (event.target === holder)
            close()
    }

    function contextClose(event) {
        event.preventDefault()
        close()
    }

    function close() {
        Trigger("command-close-explorer", id)
    }

    function toggle() {
        if (!enabled || !slot.oneWay)
            Trigger("command-toggle-slot", slot.address)
    }
</script>


{#if id}
    <div class="holder" bind:this={holder} style={cssVariables} on:click={clickOutside} on:contextmenu={contextClose}>
        <div class="dialog">
            <div class="title">
                <div class="id">{id}</div>
                <div class="description">Table cell</div>
                <div class="close"
                     use:interactive
                     on:basicaction={close}>X</div>
            </div>
            <div class="conditions section" class:active={!unlocked}>
                <div class="section-title"> Conditions </div>
                {#if conditionText}
                    <div class="section-text"> {conditionText} </div>
                {/if}
                <div class="section-list">
                    {#each conditions as condition}
                        <UISlotCalculation {game} evaluate={!unlocked} calculation={condition} />
                    {/each}
                </div>
            </div>
            <div class="modifiers section" class:active={enabled}>
                <div class="section-title"> Modifiers </div>
                {#if modifierText}
                    <div class="section-text"> {modifierText} </div>
                {/if}
                <div class="section-list">
                    {#each modifiers as modifier}
                        <UISlotCalculation {game} calculation={modifier} />
                    {/each}
                </div>
            </div>
            <div class="buttons">
                <div class="button"
                     class:active
                     class:available
                     class:unlocked
                     use:interactive
                     on:basicaction={toggle}
                >
                    {action}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    div.holder {
        position: absolute;
        left: 0;
        top : 0;
        width : 100vw;
        height : 100vh;
        background-color: #000000AA;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index : 10;
    }

    div.dialog {
        background-color: #555555;
        font-size: 3vmin;
        position: absolute;
        top : 10vmin;
        right : 10vmin;
        left : 10vmin;
        bottom : 10vmin;

        border-radius: 1vmin;
        padding : 5vmin;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
    }

    div.title {
        display: flex;
        align-items: center;
        column-gap: 1em;
    }

    div.id {
        background: var(--background);
        font-size: 2em;
        padding : 0 0.3em;
        border-radius: 0.5em;
    }

    div.close {
        margin-left: auto;
        font-size: 2em;
        background-color: #222222;
        width : 1.2em;
        height : 1.2em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.2em;
    }

    div.close:hover {
        background-color: #333333;
    }

    div.section {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        row-gap: 1em;
    }

    div.section:not(.active) {
        opacity: 0.6;
    }

    div.section-title {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5em;
    }

    div.section-text {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0.2em;
        border-radius: 1em;
        background-color: #222222;
    }

    div.section-list {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        row-gap: 1rem;
    }

    div.buttons {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    div.button {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5em;
        padding : 1em;
        border-radius: 0.5em;
        background-color: #000044;
        transition: background-color 0.2s;
        width: 6em;
    }

    div.button.available {
        background-color: #004400;
    }

    div.button.available.active:hover {
        background-color: #227722;
        cursor: pointer;
    }

     div.button.unlocked {
        background-color: #000044;
    }

    div.button.unlocked.active:hover {
        background-color: #222277;
        cursor: pointer;
    }

    div.button:not(.active) {
        background-color: #444444;
    }
</style>
