<script>
    import {onDestroy, onMount} from "svelte"
    import Trigger from "utility/trigger.js"
    import TABLES from "data/tables.js"
    import SLOT_STATES from "data/slot-states.js"
    import SLOT_TYPES from "data/slot-types.js"

    export let tables
    export let activeModifierList = []
    export let availableModifierList = []

    const counterNames = {
        [SLOT_TYPES.CELL]: "cN",
        [SLOT_TYPES.ROW]: "RN",
        [SLOT_TYPES.COLUMN]: "CN",
        [SLOT_TYPES.DIAGONAL]: "DN",
    }

    updateModifiers()

    function updateModifiers() {
        if (!activeModifierList || !tables) return
        activeModifierList.length = 0
        availableModifierList.length = 0

        const tableValues = {
            T_SN : 0,
            T_cN : 0,
            T_RN : 0,
            T_CN : 0,
            T_DN : 0,
            T_LN : 0,
        }

        for (const [tableName,table] of Object.entries(TABLES)) {
            tableValues[`${tableName}_SN`] = 0
            tableValues[`${tableName}_cN`] = 0
            tableValues[`${tableName}_RN`] = 0
            tableValues[`${tableName}_CN`] = 0
            tableValues[`${tableName}_DN`] = 0
            tableValues[`${tableName}_LN`] = 0
            for (const [slotName,slot] of Object.entries(table.slots)) {
                const address = `${tableName}${slotName}`
                const slotState = tables[address]

                if (slot.modifiers) {
                    if (slotState & SLOT_STATES.UNLOCKED)
                       availableModifierList.push(...slot.modifiers)

                    if (slotState & SLOT_STATES.ENABLED)
                        activeModifierList.push(...slot.modifiers)
                }

                if (slotState & SLOT_STATES.UNLOCKED) {
                    tableValues[`${tableName}_${counterNames[slot.type]}`]++
                    tableValues[`T_${counterNames[slot.type]}`]++
                    if (slot.type !== SLOT_TYPES.CELL) {
                        tableValues[`${tableName}_LN`]++
                        tableValues[`T_LN`]++
                    }
                    tableValues[`${tableName}_SN`]++
                    tableValues[`T_SN`]++
                }
            }
        }

        Trigger("command-update-table-values", tableValues)
/*
        activeModifierList.push(Modifier.assign("cN", counters[SLOT_TYPES.CELL]))
        activeModifierList.push(Modifier.assign("RN", counters[SLOT_TYPES.ROW]))
        activeModifierList.push(Modifier.assign("CN", counters[SLOT_TYPES.COLUMN]))
        activeModifierList.push(Modifier.assign("DN", counters[SLOT_TYPES.DIAGONAL]))
        activeModifierList.push(Modifier.assign("SN", totalSlots))
        activeModifierList.push(Modifier.assign("LN", totalLines))
        availableModifierList.push(Modifier.assign("cN", counters[SLOT_TYPES.CELL]))
        availableModifierList.push(Modifier.assign("RN", counters[SLOT_TYPES.ROW]))
        availableModifierList.push(Modifier.assign("CN", counters[SLOT_TYPES.COLUMN]))
        availableModifierList.push(Modifier.assign("DN", counters[SLOT_TYPES.DIAGONAL]))
        availableModifierList.push(Modifier.assign("SN", totalSlots))
        availableModifierList.push(Modifier.assign("LN", totalLines))
*/

        activeModifierList.sort((x, y) => x.priority - y.priority)
        availableModifierList.sort((x, y) => x.priority - y.priority)

        Trigger("modifiers-updated", activeModifierList, availableModifierList)
    }

    const triggers = []
    onMount(() => {
        triggers.push(Trigger.on("slot-toggled", updateModifiers))
    })

    onDestroy(() => {
        triggers.forEach(trigger => trigger.cancel())
    })


</script>
