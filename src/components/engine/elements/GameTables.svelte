<script>
    import TABLES from "data/tables.js"

    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger.js"
    import BingoTable from "game-classes/bingo-table.js"

    export let tables = {}
    export let state

    registerTrigger("stored-values-updated", updateTables)
    registerTrigger("debug-unlock-slot", debugUnlockSlot)
    registerTrigger("command-toggle-slot", toggleSlot)
    registerTrigger("command-toggle-slots", toggleSlots)

    function checkConditions(conditions) {
        return conditions?.every(condition => condition.check(state.values)) ?? true
    }

    function getSlotDiscoveryState(slot) {
        let slotState = BingoTable.SLOT_STATES.UNKNOWN

        if (slot?.dependencies.every(dependency => tables[dependency] & BingoTable.SLOT_STATES.UNLOCKED) ?? true) {
            slotState |= BingoTable.SLOT_STATES.VISIBLE

            if (slot?.prerequisites.every(prerequisite => tables[prerequisite] & BingoTable.SLOT_STATES.UNLOCKED) ?? true) {
                slotState |= BingoTable.SLOT_STATES.PREREQUISITES_MET

                if (checkConditions(slot?.conditions)) {
                    slotState |= BingoTable.SLOT_STATES.CONDITIONS_MET
                }
            }
        }

        return slotState
    }

    function updateTables() {
        if (!tables || !state?.values) return

        for (const [tableName,table] of Object.entries(TABLES)) {
            if (table.type !== BingoTable.TABLE_TYPES.BINGO)
                continue

            for (const slot of Object.values(table.slots)) {
                const code = slot.code
                const state = tables[code]

                if (state & BingoTable.SLOT_STATES.UNLOCKED)
                    continue

                tables[code] = getSlotDiscoveryState(slot)
            }

            tables[`${tableName}_seen`] = checkConditions(table?.conditions)
        }

        Trigger("tables-updated", tables)
    }

    function toggleSlot(name, forceState = null, batch = false) {
        if (!(tables[name] & BingoTable.SLOT_STATES.UNLOCKED) && (tables[name] & BingoTable.SLOT_STATES.UNLOCKABLE) === BingoTable.SLOT_STATES.UNLOCKABLE) {
            tables[name] |= BingoTable.SLOT_STATES.UNLOCKED
            Trigger("slot-unlocked", name)
        }

        if (!(tables[name] & BingoTable.SLOT_STATES.UNLOCKED))
            return

        if (forceState === true)
            tables[name] |= BingoTable.SLOT_STATES.ENABLED
        else if (forceState === false)
            tables[name] &= ~BingoTable.SLOT_STATES.ENABLED
        else
            tables[name] ^= BingoTable.SLOT_STATES.ENABLED

        Trigger("slot-toggled", name, tables[name] & BingoTable.SLOT_STATES.ENABLED)

        if (!batch)
            Trigger("slots-toggled", name, tables[name] & BingoTable.SLOT_STATES.ENABLED)
    }

    function toggleSlots(toggles) {
        for (let [name, forceState] of toggles)
            toggleSlot(name, forceState, true)

        Trigger("slots-toggled", name, tables[name] & BingoTable.SLOT_STATES.ENABLED)
    }

    function debugUnlockSlot(name) {
        tables[name] |= BingoTable.SLOT_STATES.UNLOCKED
        Trigger("slot-unlocked", name)
    }

</script>
