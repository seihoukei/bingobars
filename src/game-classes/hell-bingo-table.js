import HellBingoSlot from "game-classes/hell-bingo-slot.js"
import TableParser from "utility/table-parser.js"
import BingoTable from "game-classes/bingo-table.js"

export default class HellBingoTable extends BingoTable{
    init(data) {
        for (let id of BingoTable.SLOT_LIST)
            this.slots[id] = new HellBingoSlot(this.id, id)
        
        this.parse(data)
        
        return this
    }
    
    parse(data) {
        TableParser.parse(
            data,
            this,
            this.slots,
            {
                "N": "setName",
                "C": "addCondition",
                "E": "addEffect",
                "e": "setModifierText",
                "c": "setConditionText",
                "$": "setBingoins",
                "ONCE": "setOnce",
            }
        )
        
        return this
    }
    
}
