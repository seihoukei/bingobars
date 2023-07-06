<script>
    import interactive from "utility/interactive.js"
    import {onMount} from "svelte"
    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger.js"
    import Calculation from "game-classes/calculation.js"
    import UIValueModifier from "components/ui/dialogs/value-explorer/elements/UIValueModifier.svelte"
    import Codes from "game-classes/codes.js"

    export let game
    export let id

    registerTrigger("modifier-lists-updated", updateModifiers)

    let availableModifiers = []
    let activeModifiers = []

    $: valueModifiers = availableModifiers.filter(x => x.target === id)
    $: lastOverride = activeModifiers.findLast(x => x.target === id && x.priority === Calculation.PRIORITIES.FIX)
    $: override = valueModifiers.indexOf(lastOverride)

    function updateModifiers(active, available) {
        activeModifiers = active
        availableModifiers = available
    }

    function optimizeModifiers(rule = () => true) {
        Trigger("command-optimize-modifiers", id, rule)
    }

    function minimize() {
        optimizeModifiers((before, after) => before >= after)
    }

    function maximize() {
        optimizeModifiers((before, after) => after >= before)
    }

    function disableAll() {
        optimizeModifiers(() => false)
    }

    function enableAll() {
        optimizeModifiers(() => true)
    }

    onMount(() => {
        Trigger("command-update-modifiers")
    })

</script>

<div class="modifiers">
    {#each valueModifiers as modifier, index}
        <UIValueModifier {game} {modifier} overridden={index < override} />
    {/each}
</div>
<div class="buttons">
    <div class="button"
         use:interactive
         on:basicaction={disableAll}>
        None
    </div>
    <div class="button"
         use:interactive
         on:basicaction={minimize}>
        Min
    </div>
    <div class="button"
         use:interactive
         on:basicaction={maximize}>
        Max
    </div>
    <div class="button"
         use:interactive
         on:basicaction={enableAll}>
        All
    </div>
</div>

<style>
    div.modifiers {
        display: flex;
        flex-direction: column;
        row-gap: 0.5em;
        overflow : auto;
    }

    div.buttons {
        margin: 0.4em 0;
        display : flex;
        align-items: center;
        justify-content: center;
        column-gap: 1em;
    }

    div.button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.2em 1em;
        background-color: #222222;
        border-radius: 0.5em;
        cursor: pointer;
    }

    div.button:hover {
        background-color: #333333;
    }

</style>
