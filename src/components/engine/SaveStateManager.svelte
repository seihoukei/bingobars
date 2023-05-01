<script>
    import {onDestroy, onMount} from "svelte"
    import SaveProcessor from "utility/save-processor.js"
    import Trigger from "utility/trigger.js"
    import registerTrigger from "utility/register-trigger.js"

    const AUTOSAVE_SLOT = `_Autosave`

    export let state = Object.create(null)
    export let id = Math.random()
	export let prefix = "Little_Bars"
    export let defaultState = {}
    export let autosaveInterval = 10000

    registerTrigger("command-save-game", (slot) => saveGame(slot))
    registerTrigger("command-load-game", (slot) => loadGame(slot))
    registerTrigger("command-import-save", (data) => loadData(data))
    registerTrigger("command-export-save", () => exportSave())
    registerTrigger("command-reset-game", resetGame)

    registerTrigger("value-reset", () => saveGame())
    registerTrigger("value-prestiged", () => saveGame())
    registerTrigger("slots-toggled", () => saveGame())

    $: updateInterval(autosaveInterval)

    function slotName(slot = AUTOSAVE_SLOT) {
        return `${prefix}_Save_${slot}`
    }

    function saveGame(slot = AUTOSAVE_SLOT) {
        const saveData = prepareSave()
        localStorage[slotName(slot)] = saveData
        Trigger("game-saved", slot)
    }

    function loadGame(slot = AUTOSAVE_SLOT) {
        const saveData = localStorage[slotName(slot)]
        loadData(saveData)
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

    function loadData(data) {
        resetGame()
        const save = SaveProcessor.decode(data)
        if (save?._meta) {
            const loadedState = save.state
            if (loadedState.values) {
                loadedState.values.targetTime ??= 0
                loadedState.values.targetTime += (Date.now() - save._meta.date) / 1000
            }
            Object.assign(state, loadedState)
        } else {
            Object.assign(state, save)
        }
    }

    function prepareSave() {
        const data = SaveProcessor.encode({
            _meta: {
                version : 1,
                date : Date.now()
            },
            state
        })

        return data
    }

    function exportSave() {
        navigator.clipboard?.writeText?.(prepareSave())
            .then(() => alert("Copied to clipboard"))
            .catch(() => alert("Export failed"))
    }

    onMount(() => {
        loadGame()
    })

    onDestroy(() => {
        clearInterval(interval)
    })

</script>
