<script>
    import TABLES from "data/tables"
    import SLOT_STATES from "data/slot-states.js"
    import SLOT_TYPES from "data/slot-types.js"

    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger"

    export let tables = {}
    export let tableValues = {}

    registerTrigger("slot-unlocked", updateTableValues)

    const counterNames = {
        [SLOT_TYPES.CELL]: "cN",
        [SLOT_TYPES.ROW]: "RN",
        [SLOT_TYPES.COLUMN]: "CN",
        [SLOT_TYPES.DIAGONAL]: "DN",
    }

    updateTableValues()

    function updateTableValues() {
         tableValues = {
            T_SN: 0,
            T_cN: 0,
            T_RN: 0,
            T_CN: 0,
            T_DN: 0,
            T_LN: 0,
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
        Trigger("table-values-updated", tableValues)
    }


</script>