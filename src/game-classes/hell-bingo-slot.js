import BingoTable from "game-classes/bingo-table.js"
import Codes from "game-classes/codes.js"
import Calculation from "game-classes/calculation.js"

export default class HellBingoSlot {
    
    conditions = []
    effects = []
    once = false
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
    
    addEffect(data, hidden = false) {
        const effect = new Calculation(data)
        if (!effect.assignment)
            throw new Error (`"${data}" is not a valid effect`)
        effect.setSource(this.code)
        effect.setHidden(hidden)
        this.effects.push(effect)
        
        return this
    }

    
    addCondition(data, hidden = false) {
        const condition = new Calculation(data)
        if (condition.assignment)
            throw new Error (`"${data}" is not a valid condition`)
        condition.setSource(this.code)
        condition.setHidden(hidden)
        this.conditions.push(condition)
        
        return this
    }

    
    setOnce() {
        this.once = true
        
        return this
    }
    
    setBingoins(data) {
        this.bingoins = data
        
        return this
    }
}
