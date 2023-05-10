<script>
    import TABLES from "data/tables"

    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger"
    import BingoTable from "game-classes/bingo-table.js"
    import MainBingoTable from "game-classes/main-bingo-table.js"

    export let tables = {}
    export let bingo = {}
    export let tableValues = {}

    registerTrigger("slot-unlocked", updateTableValues)
    registerTrigger("bingo-updated", updateTableValues)

    const counterNames = {
        [BingoTable.SLOT_TYPES.CELL]: "c",
        [BingoTable.SLOT_TYPES.ROW]: "R",
        [BingoTable.SLOT_TYPES.COLUMN]: "C",
        [BingoTable.SLOT_TYPES.DIAGONAL]: "D",
    }

    updateTableValues()

    function updateTableValues() {
         tableValues = {
            bingoins : 0,
        }
        for (const counter of MainBingoTable.COUNTER_LIST)
            tableValues[`TX${counter}`] = 0

        for (const [tableName,table] of Object.entries(TABLES)) {
            if (table.type !== BingoTable.TABLE_TYPES.BINGO)
                continue

            for (const counter of MainBingoTable.COUNTER_LIST)
                tableValues[`${tableName}${counter}`] = 0
            for (const [slotName,slot] of Object.entries(table.slots)) {
                const code = `${tableName}${slotName}`
                const slotState = tables[code]

                if (slotState & BingoTable.SLOT_STATES.UNLOCKED) {
                    tableValues[`${tableName}${counterNames[slot.type]}`]++
                    tableValues[`TX${counterNames[slot.type]}`]++
                    if (slot.type !== BingoTable.SLOT_TYPES.CELL) {
                        tableValues[`${tableName}L`]++
                        tableValues[`TXL`]++
                    }
                    tableValues[`${tableName}S`]++
                    tableValues[`TXS`]++
                    tableValues.bingoins += slot.bingoins ?? 0
                }
            }
        }

        for (const id of Object.keys(TABLES.SB.slots)) {
            tableValues[`SB${id}`] = bingo?.levels?.[id] ?? 0
        }

        Trigger("table-values-updated", tableValues)
    }


</script>
