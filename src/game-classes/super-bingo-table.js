import TableParser from "utility/table-parser.js"
import SuperBingoSlot from "game-classes/super-bingo-slot.js"
import BingoTable from "game-classes/bingo-table.js"

export default class SuperBingoTable extends  BingoTable {
    static DEFAULT_COSTS = [
        [1, 1, 1, 1, 1,],
        [1, 1, 1, 1, 1,],
        [1, 1, 0, 1, 1,],
        [1, 1, 1, 1, 1,],
        [1, 1, 1, 1, 1,],
    ]
    
    type = BingoTable.TABLE_TYPES.SUPER_BINGO
    
    init(data) {
        this.costs = structuredClone(SuperBingoTable.DEFAULT_COSTS)
        for (const [id, data] of Object.entries(SuperBingoTable.SLOTS)) {
            if (!BingoTable.LINE_SLOT_TYPES.includes(data.type))
                continue
            this.slots[id] = new SuperBingoSlot(this.id, id)
        }
        
        this.parse(data)
        
        return this
    
    }
    
    parse(data) {
        TableParser.parse(
            data,
            this,
            this.slots,
            {
                "M" : "setModifier",
                "COSTS" : "setCosts",
            }
        )
    
        return this
    }
    
    setCosts(data) {
        const costs = data
            .match(/\d+/g)
            .map(Number)
        
        this.costs = SuperBingoTable.DEFAULT_COSTS
            .map((x, i) => Object.assign([], x, costs.slice(i * 5, i * 5 + 5)))
        
        return this
    }
}
