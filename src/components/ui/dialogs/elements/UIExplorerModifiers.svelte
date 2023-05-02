<script>
    import UIExplorerModifier from "components/ui/dialogs/elements/UIExplorerModifier.svelte"

    import {onMount} from "svelte"
    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger.js"
    import VALUES from "data/values.js"

    export let game
    export let id

    registerTrigger("modifier-lists-updated", updateModifiers)

    let modifiers = []

    $: valueModifiers = modifiers.filter(x => x.target === id)

    function updateModifiers(active, available) {
        modifiers = available
    }

    function toggleModifiers(rule = () => true) {
        let currentSandbox = Object.assign({}, game?.state?.values)
        currentSandbox[id] = currentSandbox[`${id}_base`] ?? 0
        const togglableModifiers = valueModifiers.filter(x => x.source)
        const toggles = []
        for (const modifier of togglableModifiers) {
            let lastSandbox = Object.assign({},currentSandbox)
            modifier.apply(currentSandbox)
            if (rule(lastSandbox[id], currentSandbox[id])) {
                toggles.push([modifier.source, true])
            } else {
                toggles.push([modifier.source, false])
                currentSandbox = lastSandbox
            }
        }
        const toggleSlots = toggles
            .filter(([id, value]) => !VALUES[id]?.isBingoLine)
        if (toggleSlots.length)
            Trigger("command-toggle-slots", toggleSlots)

        const toggleBingo = toggles
            .filter(([id, value]) => VALUES[id]?.isBingoLine)
            .map(([id, value]) => [id.slice(2), value])
        if (toggleBingo.length)
            Trigger("command-toggle-bingo-lines", toggleBingo)
    }

    function minimize() {
        toggleModifiers((before, after) => before > after)
    }

    function maximize() {
        toggleModifiers((before, after) => after > before)
    }

    function disableAll() {
        toggleModifiers(() => false)
    }

    function enableAll() {
        toggleModifiers(() => true)
    }

    onMount(() => {
        Trigger("command-update-modifiers")
    })


</script>

<div class="modifiers">
    {#each valueModifiers as modifier}
        <UIExplorerModifier {game} {modifier} />
    {/each}
</div>
<div class="buttons">
    <div class="button" on:click={disableAll}>
        Disable all
    </div>
    <div class="button" on:click={minimize}>
        Minimize
    </div>
    <div class="button" on:click={maximize}>
        Maximize
    </div>
    <div class="button" on:click={enableAll}>
        Enable all
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
        font-size: 0.7em;
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