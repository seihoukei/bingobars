<script>
    import SaveStateManager from "./SaveStateManager.svelte"
    import GameValues from "components/engine/elements/GameValues.svelte"
    import GameTables from "components/engine/elements/GameTables.svelte"
    import {onDestroy, onMount} from "svelte"
    import Trigger from "utility/trigger.js"

    export let game = {}

    const DEFAULT_GAME_STATE = Object.freeze({
    })

    let state, gameId

    $: game.state = state
    $: game.id = gameId

    function setTab(tab) {
        game.state.tab = tab
    }

    const triggers = []
    onMount(() => {
        triggers.push(Trigger.on("command-set-tab", setTab))
    })

    onDestroy(() => {
        triggers.forEach(trigger => trigger.cancel())
    })


</script>

<SaveStateManager bind:state bind:id={gameId} defaultState={DEFAULT_GAME_STATE}/>

{#key gameId}
    {#if state}
        <GameValues {state} bind:values={state.values}/>
        <GameTables {state} bind:tables={state.tables}/>
    {/if}
{/key}
