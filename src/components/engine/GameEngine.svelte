<script>
    import SaveStateManager from "./SaveStateManager.svelte"
    import GameValues from "components/engine/elements/GameValues.svelte"
    import GameTables from "components/engine/elements/GameTables.svelte"
    import GameStats from "components/engine/elements/GameStats.svelte"

    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger.js"

    const DEFAULT_GAME_STATE = Object.freeze({
    })

    export let game = {}

    registerTrigger("command-set-tab", setTab)

    let state, gameId

    $: game.state = state
    $: game.id = gameId

    function setTab(tab) {
        game.state.tab = tab
        Trigger("command-save-game")
    }

</script>

<SaveStateManager bind:state bind:id={gameId} defaultState={DEFAULT_GAME_STATE}/>

{#key gameId}
    {#if state}
        <GameValues {state} bind:values={state.values}/>
        <GameTables {state} bind:tables={state.tables}/>
        <GameStats {state} bind:stats={state.stats}/>
    {/if}
{/key}
