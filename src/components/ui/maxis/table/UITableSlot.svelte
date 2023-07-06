<script>
    import UISlotPrerequisites from "components/ui/maxis/table/UISlotPrerequisites.svelte"
    import UISlotConditions from "components/ui/maxis/table/UISlotConditions.svelte"
    import UISlotModifiers from "components/ui/maxis/table/UISlotModifiers.svelte"

    import StringMaker from "utility/string-maker.js"
    import BingoTable from "game-classes/bingo-table.js"

    import {slide} from "svelte/transition"
    import interactive from "utility/interactive"
    import hoverable from "utility/hoverable.js"
    import Trigger from "utility/trigger"
    import {onDestroy, onMount} from "svelte"

    export let id
    export let slot
    export let game

    let debug = 0
    let noise = ""

    if (import.meta.env.MODE === "development") {
        // 2 : see descriptions
        // 1 : raw formulas
//        debug = 1
    }

    $: tables = game?.state?.tables
    $: state = tables?.[slot.code]
    $: settings = game?.state?.settings ?? {}

    $: visible = state & BingoTable.SLOT_STATES.VISIBLE
    $: seen = visible &&  state & BingoTable.SLOT_STATES.PREREQUISITES_MET
    $: available = seen && (state & BingoTable.SLOT_STATES.UNLOCKABLE) === BingoTable.SLOT_STATES.UNLOCKABLE
    $: unlocked = state & BingoTable.SLOT_STATES.UNLOCKED
    $: enabled = state & BingoTable.SLOT_STATES.ENABLED

    $: mainBackground = unlocked ? slot.modifierBackground : slot.conditionBackground ?? "linear-gradient(#444444, #444444)"
    $: stateBackground =
        unlocked ? "linear-gradient(#00000000, #00000000)" :
        available ? "linear-gradient(#227722FF, #22772288, #22772288, #227722FF)" :
        seen ? "linear-gradient(#000000FF, #00000044, #00000044, #000000FF)" :
        "linear-gradient(#444444, #444444)"

    $: background = `--background: ${stateBackground}, ${mainBackground};`
    $: cssVariables = `${getSlotPosition(id)}${background}${noise}`

    $: cell = slot.type === BingoTable.SLOT_TYPES.CELL

    $: unlockTime = game?.state?.stats?.unlocks?.[slot.code] ?? 0

    function getSlotPosition(id) {
        const [x, y] = BingoTable.SLOTS[id]?.position ?? [0, 0]
        return `--row:${y+2};--column:${x+1};`
    }

    function toggle() {
        if (!enabled || !slot.oneWay)
            Trigger("command-toggle-slot", slot.code)
    }

    function debugAction() {
        Trigger("debug-unlock-slot", slot.code)
    }

    function specialAction() {
        if (!seen)
            return
        Trigger("command-explore-slot", slot.code)
    }

    function basicAction() {
        if (!seen)
            return

        if (unlocked || available) {
            toggle()
//        } else {
//            Trigger("command-explore-slot", slot.code)
        }
    }

    let noiseInterval = null
    onMount(() => {
        if (game?.state?.settings?.animateNoise) {
            noiseInterval = setInterval(() => {
                noise = `--noise-x:${(100 * Math.random()).toFixed(2)}em;--noise-y:${(100 * Math.random()).toFixed(2)}em;`
            }, 100)
        } else {
            noise = `--noise-x:${(100 * Math.random()).toFixed(2)}em;--noise-y:${(100 * Math.random()).toFixed(2)}em;`
        }
    })

    onDestroy(() => clearInterval(noiseInterval))

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
    <div class="slot {id?.toLowerCase()}"
         class:visible
         class:seen
         class:available
         class:unlocked
         class:enabled
         class:cell
         class:oneway={slot.oneWay}
         style={cssVariables}
         use:hoverable={{code: slot.code}}
         use:interactive
         on:basicaction={basicAction}
         on:specialaction={specialAction}
         on:debugaction={debugAction}
    >
    {#if seen || debug}
        <div class="top float">{decoration}{slot.code}{decoration}</div>
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
            {:else if (seen && !unlocked && settings.alwaysShowModifiers || unlocked && settings.alwaysShowConditions)}
                <div transition:slide|local>
                    <UISlotConditions {game} conditions={slot.conditions} custom={slot.conditionText}/>
                </div>
                <div transition:slide|local>
                    <UISlotModifiers modifiers={slot.modifiers} custom={slot.modifierText}/>
                </div>
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
        transition: background 0.2s, transform 0.2s, border 0.2s, background-position 0;
    }

    div.slot.visible {
        border : 1px solid #444444;
        background: url("../resources/noise/basic.png");
        background-position: var(--noise-x) var(--noise-y);
    }

    div.slot.seen {
        background: var(--background);
    }

    div.slot.seen:hover {
        transform: scale(1.4, 1.4);
        border-width : 5px;
        z-index: 3;
    }

    div.slot.dr.seen:hover {
        transform: scale(1.4, 1.4) translate(-10%, -10%);
    }
    div.slot.dl.seen:hover {
        transform: scale(1.4, 1.4) translate(10%, -10%);
    }
    div.slot.c1.seen:hover, div.slot.c2.seen:hover, div.slot.c3.seen:hover, div.slot.c4.seen:hover, div.slot.c5.seen:hover {
        transform: scale(1.4, 1.4) translate(0, -10%);
    }
    div.slot.r1.seen:hover, div.slot.r2.seen:hover, div.slot.r3.seen:hover, div.slot.r4.seen:hover, div.slot.r5.seen:hover {
        transform: scale(1.4, 1.4) translate(-10%, 0);
    }

    div.slot.seen:not(.enabled):hover, div.slot.seen.oneway:hover {
        border: 1px solid #CCCCCC;
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
        row-gap: 1rem;
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
