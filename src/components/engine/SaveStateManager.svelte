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
    export let userMetaFunction = null

    let saveInfo = {}

    let lastSaved = performance.now()
    let saveTimeout = null

    registerTrigger("command-save-game", saveGame)
    registerTrigger("command-load-game", loadGame)
    registerTrigger("command-import-save", loadData)
    registerTrigger("command-export-save", exportSave)
    registerTrigger("command-reset-game", resetGame)
    registerTrigger("command-update-save-info", updateInfo)

    registerTrigger("value-reset", planSave)
    registerTrigger("value-prestiged", planSave)
    registerTrigger("slots-toggled", planSave)
    registerTrigger("bingo-updated", planSave)

    registerTrigger("stats-value-reset", backupSave)

    $: updateInterval(autosaveInterval)

    function getSlotName(slot = AUTOSAVE_SLOT) {
        if (slot === "")
            slot = AUTOSAVE_SLOT
        return `${prefix}_Save_${slot}`
    }

    async function saveGame(slot = AUTOSAVE_SLOT) {
        clearTimeout(saveTimeout)
        saveTimeout = null
        lastSaved = performance.now()   //in case save compression gets stuck somehow

        const saveData = await prepareSave()
        lastSaved = performance.now()
        localStorage[getSlotName(slot)] = saveData
        updateInfo([slot])

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

    function backupSave() {
        saveGame("RESET")
    }

    function loadGame(slot, offlineTime = true) {
        const saveData = localStorage[getSlotName(slot)]
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
        const saveData = data?.split(".")?.at(-1) ?? null
        if (!saveData)
            return
        resetGame()
        const save = SaveProcessor.decode(saveData)
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
        const saveData = await SaveProcessor.encodeAsync({
            _meta: {
                date : Date.now(),
            },
            state
        })

        const userMeta = userMetaFunction?.() ?? {}
        const meta = btoa(JSON.stringify({
            _version : 1,
            _date : Date.now(),
            ...userMeta
        }))

        return `${meta}.${saveData}`
    }

    function getMetaData(slot = AUTOSAVE_SLOT) {
        const data = localStorage[getSlotName(slot)]
        const meta = data?.split(".")?.[0] ?? null
        if (!meta || meta === data)
            return {}
        return JSON.parse(atob(meta))
    }

    async function exportSave() {
        navigator.clipboard?.writeText?.(await prepareSave())
            .then(() => alert("Copied to clipboard"))
            .catch(() => alert("Export failed"))
    }

    function updateInfo(slots) {
        for (const slot of slots) {
            saveInfo[slot] = getMetaData(slot)
        }
        Trigger("save-info-updated", saveInfo)
    }

    onMount(() => {
        loadGame()
    })

    onDestroy(() => {
        clearInterval(interval)
    })

</script>
