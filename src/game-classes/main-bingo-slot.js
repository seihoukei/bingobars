import Calculation from "game-classes/calculation.js"
import BingoTable from "game-classes/bingo-table.js"
import Codes from "game-classes/codes.js"
import BASE_VALUES from "data/base-values.js"

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
        this.code = `${table}${id}`
        this.type = data.type ?? BingoTable.SLOT_TYPES.UNKNOWN
        this.position = data.position ?? [0, 0]
        this.cells = data.cells ?? []
        const dependencies = data.dependencies ?? []
        this.dependencies = dependencies.map(x => `${table}${x}`)
        
        Codes.registerCode(this.code, {
            table, id, data,
            type: Codes.TYPES.SLOT,
            slot: this,
        })
    }

    addPrerequisite(data) {
        this.prerequisites.push(data)
        
        return this
    }

    addModifier(data, hidden = false) {
        const modifier = new Calculation(data)
        if (!modifier.assignment)
            throw new Error (`"${data}" is not a valid modifier`)
        modifier.setSource(this.code)
        modifier.setHidden(hidden)
        this.modifiers.push(modifier)
        
        this.modifierBackground = this.#getBackground(this.modifiers)

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
        condition.setSource(this.code)
        condition.setHidden(hidden)
        this.conditions.push(condition)
    
        this.conditionBackground = this.#getBackground(this.conditions)

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

    #getBackground(calculations) {
        const involved = calculations
            .map(x => x.involved)
            .flat()
            .map(x => Codes.get(x)?.baseValue?.id)
        const colors = Object.keys(BASE_VALUES)
            .filter(x => involved.includes(x))
            .map(x => BASE_VALUES[x].colors.dark)
        
        return colors.length === 0 ? "linear-gradient(#000000, #000000)" :
            colors.length === 1 ? `linear-gradient(to right, ${colors[0]}, ${colors[0]})` :
                `linear-gradient(to right, ${colors.join(",")})`
    }
}
