<script>
    import {onDestroy, onMount} from "svelte"
    import Trigger from "utility/trigger"
    import TABLES from "data/tables"
    import SLOT_STATES from "data/slot-states"
    import GAME_RULES from "data/game-rules.js"

    export let tables
    export let activeModifierList = []
    export let availableModifierList = []

    updateModifiers()

    function updateModifiers() {
        if (!activeModifierList || !tables) return
        activeModifierList.length = 0
        availableModifierList.length = 0

        activeModifierList.push(...GAME_RULES.baseModifiers)
        availableModifierList.push(...GAME_RULES.baseModifiers)

        for (const [tableName,table] of Object.entries(TABLES)) {
            for (const [slotName,slot] of Object.entries(table.slots)) {
                const address = `${tableName}${slotName}`
                const slotState = tables[address]

                if (slot.modifiers) {
                    if (slotState & SLOT_STATES.UNLOCKED)
                       availableModifierList.push(...slot.modifiers)

                    if (slotState & SLOT_STATES.ENABLED)
                        activeModifierList.push(...slot.modifiers)
                }
            }
        }

        activeModifierList.sort((x, y) => x.priority - y.priority)
        availableModifierList.sort((x, y) => x.priority - y.priority)

        Trigger("modifier-lists-updated", activeModifierList, availableModifierList)
    }

    onMount(() => updateModifiers())

    const triggers = []
    onMount(() => {
        triggers.push(Trigger.on("slot-toggled", updateModifiers))
        triggers.push(Trigger.on("command-update-modifiers", updateModifiers))
    })

    onDestroy(() => {
        triggers.forEach(trigger => trigger.cancel())
    })

</script>
