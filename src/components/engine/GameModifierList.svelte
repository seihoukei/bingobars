<script>
    import {onDestroy, onMount} from "svelte"
    import Trigger from "utility/trigger.js"
    import TABLES from "data/tables.js"
    import SLOT_STATES from "data/slot-states.js"
    import SLOT_TYPES from "data/slot-types.js"
    import Modifier from "utility/modifier.js"

    export let tables
    export let modifierList = []

    updateModifiers()

    function updateModifiers() {
        if (!modifierList || !tables) return
        modifierList.length = 0

        const counters = {}
        for (const type of Object.values(SLOT_TYPES))
            counters[type] = 0

        for (const [tableName,table] of Object.entries(TABLES)) {
            for (const [slotName,slot] of Object.entries(table.slots)) {
                const address = `${tableName}${slotName}`
                const slotState = tables[address]

                if (slot.modifiers && (slotState & SLOT_STATES.ENABLED))
                    modifierList.push(...slot.modifiers)

                if (slotState & SLOT_STATES.UNLOCKED)
                    counters[slot.type]++
            }
        }

        const totalSlots = Object.values(counters).reduce((v,x) => v + x)
        const totalLines = totalSlots - counters[SLOT_TYPES.CELL]
        modifierList.push(Modifier.assign("cN", counters[SLOT_TYPES.CELL]))
        modifierList.push(Modifier.assign("RN", counters[SLOT_TYPES.ROW]))
        modifierList.push(Modifier.assign("CN", counters[SLOT_TYPES.COLUMN]))
        modifierList.push(Modifier.assign("DN", counters[SLOT_TYPES.DIAGONAL]))
        modifierList.push(Modifier.assign("SN", totalSlots))
        modifierList.push(Modifier.assign("LN", totalLines))

        modifierList.sort((x,y) => x.priority - y.priority)

        Trigger("modifiers-updated", modifierList)
    }

    const triggers = []
    onMount(() => {
        triggers.push(Trigger.on("slot-toggled", updateModifiers))
    })

    onDestroy(() => {
        triggers.forEach(trigger => trigger.cancel())
    })


</script>
