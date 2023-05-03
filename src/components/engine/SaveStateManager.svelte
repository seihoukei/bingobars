<script>
    import {onDestroy, onMount} from "svelte"
    import SaveProcessor from "utility/save-processor.js"
    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger.js"

    const AUTOSAVE_SLOT = `_Autosave`

    export let state = Object.create(null)
    export let id = Math.random()
	export let prefix = "Little_Bars"
    export let defaultState = {}
    export let autosaveInterval = 60000
    export let actionsaveInterval = 5000

    let lastSaved = performance.now()
    let saveTimeout = null

    registerTrigger("command-save-game", saveGame)
    registerTrigger("command-load-game", loadGame)
    registerTrigger("command-import-save", loadData)
    registerTrigger("command-export-save", exportSave)
    registerTrigger("command-reset-game", resetGame)

    registerTrigger("value-reset", planSave)
    registerTrigger("value-prestiged", planSave)
    registerTrigger("slots-toggled", planSave)
    registerTrigger("bingo-updated", planSave)

    $: updateInterval(autosaveInterval)

    function slotName(slot = AUTOSAVE_SLOT) {
        return `${prefix}_Save_${slot}`
    }

    async function saveGame(slot = AUTOSAVE_SLOT) {
        clearTimeout(saveTimeout)
        saveTimeout = null
        lastSaved = performance.now()   //in case save compression gets stuck somehow

        const saveData = await prepareSave()
        lastSaved = performance.now()
        localStorage[slotName(slot)] = saveData
        Trigger("game-saved", slot)
//        console.log(`Saved ${saveData.length} bytes`)
    }

    function planSave() {
        if (saveTimeout)
            return
        const sinceLastSave = performance.now() - lastSaved
        if (sinceLastSave > actionsaveInterval) {
            saveGame()
            return
        }
        saveTimeout = setTimeout(saveGame, actionsaveInterval - sinceLastSave)
    }

    function loadGame(slot = AUTOSAVE_SLOT, offlineTime = true) {
        const saveData = localStorage[slotName(slot)]
        loadData(saveData, offlineTime)
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

    function loadData(data, offlineTime = true) {
        resetGame()
        const save = SaveProcessor.decode(data)
        if (save?._meta) {
            const loadedState = save.state
            if (loadedState.values) {
                loadedState.values.targetTime ??= 0
                if (offlineTime)
                loadedState.values.targetTime += (Date.now() - save._meta.date) / 1000
            }
            Object.assign(state, loadedState)
        } else {
            Object.assign(state, save)
        }
    }

    async function prepareSave() {
        const data = await SaveProcessor.encodeAsync({
            _meta: {
                version : 1,
                date : Date.now()
            },
            state
        })

        return data
    }

    async function exportSave() {
        navigator.clipboard?.writeText?.(await prepareSave())
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
