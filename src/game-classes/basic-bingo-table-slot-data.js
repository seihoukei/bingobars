import SLOT_TYPES from "data/slot-types.js"
import Calculation from "game-classes/calculation.js"
import VALUES from "data/values.js"

export default class BasicBingoTableSlotData {
    static SLOT_REGEXP = {
        [SLOT_TYPES.CELL] : /^R\dC\d$/,
        [SLOT_TYPES.ROW] : /^R\d$/,
        [SLOT_TYPES.COLUMN] : /^C\d$/,
        [SLOT_TYPES.DIAGONAL] : /^D[LR]$/,
    }

    static getTypeForName(name) {
        for (const [type, regex] of Object.entries(BasicBingoTableSlotData.SLOT_REGEXP)) {
            if (name.match(regex))
                return +type
        }
        return SLOT_TYPES.UNKNOWN
    }


    prerequisites = []
    conditions = []
    modifiers = []
    conditionText = null
    modifierText = null
    oneWay = false
    bingoins = 1

    constructor(table, name) {
        this.address = `${table}${name}`
        this.type = BasicBingoTableSlotData.getTypeForName(name)
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
