<script>
    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"
    import BingoTable from "game-classes/bingo-table.js"
    import interactive from "utility/interactive.js"
    import hoverable from "utility/hoverable.js"
    import Codes from "game-classes/codes.js"

    export let modifier = {}
    export let game = {}
    export let overridden = false

    $: values = game?.state?.values ?? {}
    $: tables = game?.state?.tables ?? {}
    $: settings = game?.state?.settings ?? {}
    $: bingo = game?.state?.bingo ?? {}
    $: source = modifier.source
    $: code = Codes.get(source)
    $: slot = code?.slot ?? null
    $: gameRules = !source
    $: togglable = slot?.isBingoSlot
    $: active = (slot && (tables[source] & BingoTable.SLOT_STATES.ENABLED)) || (slot?.isBingoSlot && bingo?.active?.[slot.id]) || gameRules
    $: complex = (slot?.modifiers?.length ?? 0) > 1

    $: variables = [...new Set(modifier.involved.filter(x => x !== modifier.target))]

    function toggle() {
        if (slot?.isBingoSlot) {
            Trigger("command-toggle-bingo-line", slot.id)
            return
        }

        if (!slot)
            return

        Trigger("command-toggle-slot", slot.code)
    }

    function exploreSlot() {
        if (!slot || slot.isBingoSlot)
            return

        Trigger("command-explore-slot", slot.code)
    }

    function exploreValue(value) {
        Trigger("command-explore-value", value)
    }


</script>

<div class="modifier" class:active>
    <div class="main">
        <div class="source"
             use:hoverable={{code:source ?? null}}
             class:togglable
             class:super={slot?.isBingoSlot}
             class:rules={gameRules}
             use:interactive
             on:basicaction={toggle}
             on:specialaction={exploreSlot}
        >
            {complex ? "!!" : ""} {source ?? "Game rules"} {complex ? "!!" : ""}
        </div>

        <div class="expression"
             use:hoverable={{calculation:modifier}}
             class:togglable
             use:interactive
             on:basicaction={toggle}
        >
            {StringMaker.formatCalculation(modifier, settings.shortModifiers)}
        </div>

        {#if overridden}
            <div class="overridden"></div>
        {/if}
    </div>
    {#if variables.length}
        <div class="variables">
            {#each variables as variable}
                <div class="variable"
                     use:hoverable={{code:variable}}
                     use:interactive
                     on:basicaction={() => exploreValue(variable)}
                >
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
    div.source.togglable:hover {
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
    div.expression.togglable:hover {
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
        cursor: pointer;
    }

</style>
