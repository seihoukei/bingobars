import Calculation from "game-classes/calculation.js"
import VALUES from "data/values.js"
import BingoTable from "game-classes/bingo-table.js"

export default class MainBingoSlot {
    prerequisites = []
    conditions = []
    modifiers = []
    conditionText = null
    modifierText = null
    oneWay = false
    bingoins = 1
    
    table = ""
    id = ""

    constructor(table, id, data = BingoTable.SLOTS[id]) {
        this.table = table
        this.id = id
        this.address = `${table}${id}`
        this.type = data.type ?? BingoTable.SLOT_TYPES.UNKNOWN
        this.position = data.position ?? [0, 0]
        this.cells = data.cells ?? []
        const dependencies = data.dependencies ?? []
        this.dependencies = dependencies.map(x => `${table}${x}`)
    }

    addPrerequisite(data) {
        this.prerequisites.push(data)
        
        return this
    }

    addModifier(data, hidden = false) {
        const modifier = new Calculation(data)
        if (!modifier.assignment)
            throw new Error (`"${data}" is not a valid modifier`)
        modifier.setSource(this.address)
        modifier.setHidden(hidden)
        this.modifiers.push(modifier)

        return this
    }
    
    addHiddenModifier(data) {
        this.addModifier(data, true)
    
        return this
    }

    addCondition(data, hidden = false) {
        const condition = new Calculation(data)
        if (condition.assignment)
            throw new Error (`"${data}" is not a valid condition`)
        condition.setSource(this.address)
        condition.setHidden(hidden)
        this.conditions.push(condition)
    
        return this
    }
    
    addHiddenCondition(data) {
        this.addCondition(data, true)
    
        return this
    }
    
    
    setOneWay() {
        this.oneWay = true
    
        return this
    }

    setConditionText(data) {
        this.conditionText = data
    
        return this
    }

    setModifierText(data) {
        this.modifierText = data
    
        return this
    }

    setBingoins(data) {
        this.bingoins = data
    
        return this
    }

    getInvolvedInModifiers() {
        const involved = this.modifiers.map(x => x.involved).flat().map(x => VALUES[x]?.baseValue)
        return ["A","AB","B","BC","C","AC","ABC"].filter(x => involved.includes(x))
    }

    getInvolvedInConditions() {
        const involved = this.conditions.map(x => x.involved).flat().map(x => VALUES[x]?.baseValue)
        return ["A","AB","B","BC","C","AC","ABC"].filter(x => involved.includes(x))
    }
}
