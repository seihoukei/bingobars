<script>
    import GameEngine from "components/engine/GameEngine.svelte"
    import GameUI from "components/ui/GameUI.svelte"
    import GameTimer from "components/GameTimer.svelte"

    import TABLES from "data/tables.js"

    import Trigger from "utility/trigger.js"
    import Wakelock from "utility/wakelock.js"

    Wakelock.enable()

    let game = {}
/*
    if (import.meta.env.MODE === "development") {
        window.Trigger = Trigger
        window.TABLES = TABLES
        window.game = game
    }*/
</script>

<GameEngine bind:game />
<GameUI {game}/>

<GameTimer rate=10 boost=1 event="command-tick" />
