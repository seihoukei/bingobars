<script>
    import TABLES from "data/tables"
    import SLOT_STATES from "data/slot-states"
    import GAME_RULES from "data/game-rules.js"

    import {onMount} from "svelte"
    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger"



    export let tables
    export let activeModifierList = []
    export let availableModifierList = []

    registerTrigger("slots-toggled", updateModifiers)
    registerTrigger("command-update-modifiers", updateModifiers)

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



</script>
