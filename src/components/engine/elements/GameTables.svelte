<script>
    import TABLES from "data/tables.js"
    import SLOT_STATES from "data/slot-states.js"
    import SLOT_TYPES from "data/slot-types.js"

    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger.js"

    export let tables = {}
    export let state

    registerTrigger("stored-values-updated", updateTables)
    registerTrigger("command-toggle-slot", toggleSlot)
    registerTrigger("command-toggle-slots", toggleSlots)

    function checkConditions(conditions) {
        return conditions?.every(condition => condition.check(state.values)) ?? true
    }

    function getSlotDiscoveryState(slot) {
        let slotState = SLOT_STATES.UNKNOWN

        let dependencies = []
        if (slot.type === SLOT_TYPES.ROW) {
            dependencies = ["C1","C2","C3","C4","C5"].map(x => `${slot.address}${x}`)
        } else if (slot.type === SLOT_TYPES.COLUMN) {
            dependencies = ["R1","R2","R3","R4","R5"].map(x => `${slot.address.slice(0,2)}${x}${slot.address.slice(2)}`)
        } else if (slot.type === SLOT_TYPES.DIAGONAL && slot.address.slice(-2) === "DR") {
            dependencies = ["R1C1","R2C2","R3C3","R4C4","R5C5"].map(x => `${slot.address.slice(0,2)}${x}`)
        } else if (slot.type === SLOT_TYPES.DIAGONAL && slot.address.slice(-2) === "DL") {
            dependencies = ["R1C5","R2C4","R3C3","R4C2","R5C1"].map(x => `${slot.address.slice(0,2)}${x}`)
        }

        if (dependencies.every(x => tables[x] & SLOT_STATES.UNLOCKED)) {
            slotState |= SLOT_STATES.VISIBLE
        }

        if (slot?.prerequisites.every(prerequisite => tables[prerequisite] & SLOT_STATES.UNLOCKED) ?? true) {
            slotState |= SLOT_STATES.PREREQUISITES_MET
        }

        if (checkConditions(slot?.conditions)) {
            slotState |= SLOT_STATES.CONDITIONS_MET
        }

        return slotState
    }
    function updateTables() {
        if (!tables || !state?.values) return

        for (const [tableName,table] of Object.entries(TABLES)) {
            for (const [slotName,slot] of Object.entries(table.slots)) {
                const address = `${tableName}${slotName}`
                const state = tables[address]
                if (state & SLOT_STATES.UNLOCKED)
                    continue
                tables[address] = getSlotDiscoveryState(slot)
            }
            tables[`${tableName}_seen`] = checkConditions(table?.conditions)
        }

        Trigger("tables-updated", tables)
    }

    function toggleSlot(name, forceState = null, batch = false) {
        if (!(tables[name] & SLOT_STATES.UNLOCKED) && (tables[name] & SLOT_STATES.UNLOCKABLE) === SLOT_STATES.UNLOCKABLE) {
            tables[name] |= SLOT_STATES.UNLOCKED
            Trigger("slot-unlocked", name)
        }

        if (!(tables[name] & SLOT_STATES.UNLOCKED))
            return

        if (forceState === true)
            tables[name] |= SLOT_STATES.ENABLED
        else if (forceState === false)
            tables[name] &= ~SLOT_STATES.ENABLED
        else
            tables[name] ^= SLOT_STATES.ENABLED

        Trigger("slot-toggled", name, tables[name] & SLOT_STATES.ENABLED)

        if (!batch)
            Trigger("slots-toggled", name, tables[name] & SLOT_STATES.ENABLED)
    }

    function toggleSlots(toggles) {
        for (let [name, forceState] of toggles)
            toggleSlot(name, forceState, true)

        Trigger("slots-toggled", name, tables[name] & SLOT_STATES.ENABLED)
    }

</script>
