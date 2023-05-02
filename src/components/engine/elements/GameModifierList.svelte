<script>
    import TABLES from "data/tables"
    import SLOT_STATES from "data/slot-states"
    import GAME_RULES from "data/game-rules.js"

    import {onMount} from "svelte"
    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger"
    import SUPER_BINGO from "data/super-bingo.js"
    import Calculation from "utility/calculation.js"

    export let tables
    export let bingo
    export let activeModifierList = []
    export let availableModifierList = []

    registerTrigger("slots-toggled", updateModifiers)
    registerTrigger("bingo-updated", updateModifiers)
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

        for (const [id, data] of Object.entries(SUPER_BINGO.lines)) {
            const level = bingo?.levels?.[id]
            const modifier = data?.modifier
            if (!level || !modifier)
                continue
            availableModifierList.push(modifier)
            const active = bingo?.active?.[id]
            if (!active)
                continue
            activeModifierList.push(modifier)
        }

        activeModifierList.sort((x, y) => x.priority - y.priority)
        availableModifierList.sort((x, y) => x.priority - y.priority)

        Calculation.sortList(activeModifierList)
        Calculation.sortList(availableModifierList)

        Trigger("modifier-lists-updated", activeModifierList, availableModifierList)
    }

    onMount(() => updateModifiers())

</script>
