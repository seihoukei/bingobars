<script>
    import SaveStateManager from "./SaveStateManager.svelte"
    import GameValues from "components/engine/elements/GameValues.svelte"
    import GameTables from "components/engine/elements/GameTables.svelte"
    import GameStats from "components/engine/elements/GameStats.svelte"

    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger.js"
    import GameBingo from "components/engine/elements/GameBingo.svelte"
    import UI_TABS from "data/ui-tabs.js"

    const DEFAULT_GAME_STATE = Object.freeze({
    })

    const HELL_COOLDOWN = 6 * 3600 * 1000 //6 hours
    const HELL_TAB = 16

    export let game = {}

    registerTrigger("command-set-tab", setTab)

    let state, gameId

    $: game.state = state
    $: game.id = gameId

    function setTab(tab) {
        if (UI_TABS[tab].id === "BINGO") {
            const now = Date.now()
            game.state.lastHellTime ??= now
            game.state.bingoVisitsSinceCooldown ??= 0

            if (now - game.state.lastHellTime > HELL_COOLDOWN) {
                game.state.bingoVisitsSinceCooldown++
                if (game.state.bingoVisitsSinceCooldown === 6) {
                    game.state.lastHellTime = now
                    game.state.bingoVisitsSinceCooldown = 0
                    return setTab(HELL_TAB)
                }
            }
        }

        game.state.tab = tab
        Trigger("command-save-game")
    }

    function userMetaFunction() {
        return {
            SN : game?.state?.values?.TXS ?? 0,
            time : game?.state?.values?.targetTime ?? 0,
        }
    }
</script>

<SaveStateManager bind:state
                  bind:id={gameId}
                  defaultState={DEFAULT_GAME_STATE}
                  {userMetaFunction}
/>

{#key gameId}
    {#if state}
        <GameValues {state} bind:values={state.values} bind:seen={state.seen}/>
        <GameTables {state} bind:tables={state.tables}/>
        <GameBingo {state} bind:bingo={state.bingo}/>
        <GameStats {state} bind:stats={state.stats}/>
    {/if}
{/key}
