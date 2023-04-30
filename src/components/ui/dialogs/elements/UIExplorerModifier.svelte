<script>
    import TABLES from "data/tables.js"
    import SLOT_STATES from "data/slot-states.js"
    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"

    export let modifier = {}
    export let game = {}

    $: values = game?.state?.values ?? {}
    $: tables = game?.state?.tables ?? {}
    $: source = modifier.source
    $: slot = getSlot(source)
    $: interactive = slot !== null
    $: active = !slot || (tables[source] & SLOT_STATES.ENABLED)
    $: complex = (slot?.modifiers?.length ?? 0) > 1

    $: variables = [...new Set(modifier.involved.filter(x => x !== modifier.target))]

    function getSlot(address) {
        if (!tables[address])
            return null
        const table = address.slice(0,2)
        const slot = address.slice(2,6)
        return TABLES[table]?.slots[slot] ?? null
    }

    function toggle() {
        if (slot)
            Trigger("command-toggle-slot", slot.address)
    }
</script>

<div class="modifier" class:active>
    <div class="main">
        <div class="source" class:interactive on:click={toggle}> {complex ? "!!" : ""} {source ?? "Game rules"} {complex ? "!!" : ""}</div>
        <div class="expression" class:interactive on:click={toggle}>{modifier.expression}</div>
    </div>
    {#if variables.length}
        <div class="variables">
            {#each variables as variable}
                <div class="variable">
                    <span class="name">
                        {variable}
                    </span> = <span class="value">
                        {StringMaker.formatValueById(values[variable], variable)}
                    </span>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    div.modifier {
        display: flex;
        flex-direction: column;
    }
    div.source {
        background-color: #222222;
        padding: 0.2em;
        width: 6em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5em;
    }
    div.source.interactive:hover {
        cursor: pointer;
        background-color: #333333;
    }
    div.active div.source {
        border : 0.2em solid #CCCCCC;
        padding: 0;
    }
    div.expression {
        background-color: #666666;
        padding: 0.2em;
        flex : 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5em;
    }
    div.expression.interactive:hover {
        cursor: pointer;
        background-color: #777777;
    }
    div.modifier:not(.active) div.expression {
        color : #999999;
    }

    div.main {
        display: flex;
        flex-direction: row;
        column-gap: 0.5em;
    }
    div.variables {
        display: flex;
        flex-direction: row;
        justify-content: end;
        column-gap: 0.5em;
        font-size: 0.8em;
        padding : 0 2em;
    }
    div.variable {
        background-color: #666666;
        border-radius: 0 0 0.5em 0.5em;
        padding: 0.1em 0.2em;
        min-width: 5em;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>