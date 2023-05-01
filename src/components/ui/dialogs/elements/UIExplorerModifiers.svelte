<script>
    import UIExplorerModifier from "components/ui/dialogs/elements/UIExplorerModifier.svelte"
    import {onDestroy, onMount} from "svelte"
    import Trigger from "utility/trigger.js"

    export let game
    export let id

    let modifiers = []

    $: valueModifiers = modifiers.filter(x => x.target === id)

    function updateModifiers(active, available) {
        modifiers = available
    }


    const triggers = []
    onMount(() => {
        triggers.push(Trigger.on("modifier-lists-updated", updateModifiers))
        Trigger("command-update-modifiers")
    })

    onDestroy(() => {
        triggers.forEach(trigger => trigger.cancel())
    })

</script>

<div class="modifiers">
    {#each valueModifiers as modifier}
        <UIExplorerModifier {game} {modifier} />
    {/each}
</div>

<style>
    div.modifiers {
        display: flex;
        flex-direction: column;
        row-gap: 0.5em;
        overflow : auto;
    }

</style>