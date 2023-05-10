import Calculation from "game-classes/calculation.js"
import BingoTable from "game-classes/bingo-table.js"
import Codes from "game-classes/codes.js"

export default class SuperBingoSlot {
    isBingoSlot = true
    
    effect = null
    modifier = null
    
    constructor(table, id, data = BingoTable.SLOTS[id]) {
        this.code = `${table}${id}`
        this.type = data.type ?? BingoTable.SLOT_TYPES.UNKNOWN
        this.table = table
        this.id = id
        this.cells = data.cells
        this.position = data.position
    
        Codes.registerCode(this.code, {
            table, id, data,
            type: Codes.TYPES.SLOT,
            isBingoSlot : true,
            slot: this,
        })
    }
    
    setModifier(data) {
        this.effect = data.replace(/~/g, this.code)
        this.modifier = new Calculation(this.effect, Calculation.PRIORITIES.SUPER)
        this.modifier.setSource(this.code)
    
        return this
    }
}
