<script>
    import UISlotPrerequisites from "components/ui/maxis/table/UISlotPrerequisites.svelte"
    import UISlotConditions from "components/ui/maxis/table/UISlotConditions.svelte"
    import UISlotModifiers from "components/ui/maxis/table/UISlotModifiers.svelte"

    import StringMaker from "utility/string-maker.js"
    import BingoTable from "game-classes/bingo-table.js"

    import FG_COLORS from "data/fg-colors"

    import {slide} from "svelte/transition"
    import interactive from "utility/interactive"
    import Trigger from "utility/trigger"

    export let id
    export let slot
    export let game

    let debug = 0

    if (import.meta.env.MODE === "development") {
        // 1 : see descriptions
        // 2 : raw formulas
        //debug = 1
    }

    $: tables = game?.state?.tables
    $: value = tables?.[slot.address]

    $: visible = value & BingoTable.SLOT_STATES.VISIBLE
    $: seen = visible &&  value & BingoTable.SLOT_STATES.PREREQUISITES_MET
    $: available = seen && (value & BingoTable.SLOT_STATES.UNLOCKABLE) === BingoTable.SLOT_STATES.UNLOCKABLE
    $: unlocked = value & BingoTable.SLOT_STATES.UNLOCKED
    $: enabled = value & BingoTable.SLOT_STATES.ENABLED

    $: involved = unlocked
              ? slot?.getInvolvedInModifiers() ?? []
              : slot?.getInvolvedInConditions() ?? []

    $: cssVariables = `${getSlotPosition(id)}${getSlotBackground(involved, seen, available, enabled, unlocked)}`

    $: cell = slot.type === BingoTable.SLOT_TYPES.CELL

    $: unlockTime = game?.state?.stats?.unlocks?.[slot.address] ?? 0

    function getSlotPosition(id) {
        const [x, y] = BingoTable.SLOTS[id]?.position ?? [0, 0]
        return `--row:${y+2};--column:${x+1};`
    }

    function getSlotBackground() {
        let mainBackground =
            involved.length === 0 ? "linear-gradient(#000000, #000000)" :
            involved.length === 1 ? `linear-gradient(to right, ${FG_COLORS[involved[0]]}, ${FG_COLORS[involved[0]]})`
            : `linear-gradient(to right, ${involved.map(x => FG_COLORS[x]).join(",")})`

        let stateBackground =
            unlocked ? "linear-gradient(#00000000, #00000000)" :
            available ? "linear-gradient(#227722FF, #22772288, #22772288, #227722FF)" :
            seen ? "linear-gradient(#000000FF, #00000044, #00000044, #000000FF)" :
            "linear-gradient(#444444, #444444)"

        return `--background: ${stateBackground}, ${mainBackground};`
    }

    function toggle() {
        if (!enabled || !slot.oneWay)
        Trigger("command-toggle-slot", slot.address)
    }

    $: decoration =
        enabled
            ? slot.oneWay
                ? ""
                : "★"
            : unlocked
                ? "✰"
                : available
                    ? "🔓"
                    : "🔒"

</script>
    <div class="slot"
         class:seen
         class:available
         class:unlocked
         class:enabled
         class:cell
         class:oneway={slot.oneWay}
         style={cssVariables}
         use:interactive
         on:basicaction={toggle}
         on:specialaction
    >
    {#if seen || debug}
        <div class="top float">{decoration}{slot.address}{decoration}</div>
    {/if}
        <div class="content" class:debug>
            {#if debug}
                {#if slot.prerequisites?.length}
                    <UISlotPrerequisites {debug} prerequisites={slot.prerequisites}/>
                {/if}
                {#if slot.conditions?.length}
                    <UISlotConditions {game} {debug} conditions={slot.conditions} custom={slot.conditionText}/>
                {/if}
                {#if slot.modifiers?.length}
                    <UISlotModifiers {debug} modifiers={slot.modifiers} custom={slot.modifierText}/>
                {/if}
            {:else if unlocked}
                <div transition:slide|local>
                    <UISlotModifiers modifiers={slot.modifiers} custom={slot.modifierText}/>
                </div>
            {:else if seen}
                <div transition:slide|local>
                    <UISlotConditions {game} conditions={slot.conditions} custom={slot.conditionText}/>
                </div>
            {:else if visible}
                <div transition:slide|local>
                    <UISlotPrerequisites prerequisites={slot.prerequisites}/>
                </div>
            {/if}
        </div>

        {#if seen || debug}
            {#if slot.bingoins}
                <div class="bingoins">
                    <span class="bingoin-icon"></span> {slot.bingoins}
                </div>
            {/if}
            {#if unlocked}
                <div class="bottom float">{StringMaker.formatValue(unlockTime, {type:StringMaker.VALUE_FORMATS.TIME})}</div>
            {:else if available}
                <div class="bottom float">READY!</div>
            {:else}
                <div class="bottom float">Locked</div>
            {/if}
        {/if}
</div>

<style>
    div.slot {
        position: relative;
        grid-row: var(--row);
        grid-column: var(--column);

        z-index: 2;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: stretch;
        overflow: hidden;

        background: var(--background);
        transition: background 0.2s;
    }

    div.slot:not(.seen) {
    }

    div.slot.seen {
    }

    div.slot.available {
        cursor: pointer;
    }

    div.slot.unlocked {
        cursor: pointer;
        color: #FFFFFFAA;
    }

    div.slot.enabled {
        border : 0.4em solid white;
        margin : -0.2em;
        color: #FFFFFF;
    }

    div.slot.enabled.oneway {
        border : none;
        margin : 0;
        cursor: default;
    }

    div.content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        flex-direction: column;
    }

    div.content.debug {
        font-size: 0.7em;
    }

    div.content div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    div.bingoins {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.2em;
        right : 0;
        bottom : 0;
    }

    div.unlocked div.bingoins {
        opacity: 0.5;
    }

    div.float {
        position: absolute;
        left: 0;
        right: 0;
        pointer-events: none;
        text-align: center;
        color: #FFFFFF;
    }

    div.float.top {
        top : 0;
    }

    div.float.bottom {
        bottom : 0;
    }
</style>
