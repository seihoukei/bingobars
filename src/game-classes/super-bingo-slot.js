import Calculation from "game-classes/calculation.js"
import BingoTable from "game-classes/bingo-table.js"

export default class SuperBingoSlot {
    effect = null
    modifier = null
    
    constructor(table, id, data = BingoTable.SLOTS[id]) {
        this.address = `${table}${id}`
        this.type = data.type ?? BingoTable.SLOT_TYPES.UNKNOWN
        this.table = table
        this.id = id
        this.cells = data.cells
        this.position = data.position
    }
    
    setModifier(data) {
        this.effect = data.replace(/~/g, this.address)
        this.modifier = new Calculation(this.effect, Calculation.PRIORITIES.SUPER)
        this.modifier.setSource(this.address)
    
        return this
    }
}
