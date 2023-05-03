<script>
    import TABLES from "data/tables.js"
    import VALUES from "data/values.js"
    import SLOT_STATES from "data/slot-states.js"

    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"
    import Calculation from "utility/calculation.js"

    export let modifier = {}
    export let game = {}
    export let overridden = false

    $: values = game?.state?.values ?? {}
    $: tables = game?.state?.tables ?? {}
    $: bingo = game?.state?.bingo ?? {}
    $: source = modifier.source
    $: slot = getSlot(source)
    $: bingoLine = slot ? null : source?.match(/^SB..$/)
    $: gameRules = !source
    $: interactive = slot !== null || bingoLine
    $: active = (slot && (tables[source] & SLOT_STATES.ENABLED)) || (bingoLine && bingo?.active?.[source.slice(2)]) || gameRules
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
        if (VALUES[modifier.source]?.isBingoLine) {
            Trigger("command-toggle-bingo-line", modifier.source.slice(2))
            return
        }

        if (!slot)
            return

        Trigger("command-toggle-slot", slot.address)
    }
</script>

<div class="modifier" class:active>
    <div class="main">
        <div class="source"
             class:interactive
             class:super={bingoLine}
             class:rules={gameRules}
             on:click={toggle}
        >
            {complex ? "!!" : ""} {source ?? "Game rules"} {complex ? "!!" : ""}
        </div>

        <div class="expression"
             class:interactive
             on:click={toggle}
        >
            {modifier.expression}
        </div>

        {#if overridden}
            <div class="overridden"></div>
        {/if}
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
        padding: 0.1em;
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

    div.source.rules {
        background-color: #444444;
    }

    div.source.super {
        background-color: #777722;
    }

    div.source.super:hover {
        background-color: #999944;
    }

    div.active div.source {
        border : 0.1em solid #CCCCCC;
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
        position: relative;
        flex-direction: row;
        column-gap: 0.5em;
    }
    div.overridden {
        position: absolute;
        width: 100%;
        height : 0.1em;
        background-color: #CCCCCC;
        top: calc(50% - 0.05em);
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
