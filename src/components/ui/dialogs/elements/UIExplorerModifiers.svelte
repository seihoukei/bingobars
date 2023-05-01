<script>
    import UIExplorerModifier from "components/ui/dialogs/elements/UIExplorerModifier.svelte"
    import {onMount} from "svelte"
    import Trigger from "utility/trigger.js"
    import registerTrigger from "utility/register-trigger.js"

    export let game
    export let id

    registerTrigger("modifier-lists-updated", updateModifiers)

    let modifiers = []

    $: valueModifiers = modifiers.filter(x => x.target === id)

    function updateModifiers(active, available) {
        modifiers = available
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

<style>
    div.modifiers {
        display: flex;
        flex-direction: column;
        row-gap: 0.5em;
        overflow : auto;
    }

</style>