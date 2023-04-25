<script>
    import {onDestroy, onMount} from "svelte"
    import SaveProcessor from "utility/save-processor.js"
    import Trigger from "utility/trigger.js"

    export let state = Object.create(null)
    export let id = Math.random()
	export let prefix = "Little_Bars"
    export let defaultState = {}
    export let autosaveInterval = 10000

    const AUTOSAVE_SLOT = `_Autosave`

    $: updateInterval(autosaveInterval)

    function slotName(slot = AUTOSAVE_SLOT) {
        return `${prefix}_Save_${slot}`
    }

    function saveGame(slot = AUTOSAVE_SLOT) {
        const saveData = SaveProcessor.encode(state)
        localStorage[slotName(slot)] = saveData
        Trigger("game-saved", slot)
    }

    function loadGame(slot = AUTOSAVE_SLOT) {
        const saveData = localStorage[slotName(slot)]
        resetGame()
        Object.assign(state, SaveProcessor.decode(saveData))
        Trigger("game-loaded", slot)
    }

    function resetGame() {
        state = Object.create(null)
        id = Math.random()
        Object.assign(state, defaultState)
        Trigger("game-reset")
    }

    let interval = null
    function updateInterval(time) {
        if (interval)
            clearInterval(interval)
        interval = setInterval(saveGame, time)
    }

    onMount(() => {
        loadGame()
    })

    onDestroy(() => {
        clearInterval(interval)
    })

    const triggers = []
    onMount(() => {
        triggers.push(Trigger.on("command-save-game", (slot) => saveGame(slot)))
        triggers.push(Trigger.on("command-load-game", (slot) => loadGame(slot)))
        triggers.push(Trigger.on("command-reset-game", resetGame))
    })

    onDestroy(() => {
        triggers.forEach(trigger => trigger.cancel())
    })

</script>
