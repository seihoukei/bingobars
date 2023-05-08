import MainBingoSlot from "game-classes/main-bingo-slot.js"
import Calculation from "game-classes/calculation.js"
import TableParser from "utility/table-parser.js"
import BingoTable from "game-classes/bingo-table.js"

export default class MainBingoTable extends BingoTable{
    type = BingoTable.TABLE_TYPES.BINGO

    conditions = []
    slots = {}
    
    init(data) {
        for (let id of MainBingoTable.SLOT_LIST)
            this.slots[id] = new MainBingoSlot(this.id, id)
        
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
                "R": "addPrerequisite",
                "M": "addModifier",
                "C": "addCondition",
                "M!": "addHiddenModifier",
                "C!": "addHiddenCondition",
                "m": "setModifierText",
                "c": "setConditionText",
                "$": "setBingoins",
                "LOCK": "setOneWay",
            }
        )
        
        return this
    }

    setName(name) {
        this.name = name
        return this
    }
    
    addCondition(data, hidden = false) {
        const condition = new Calculation(data)
        if (condition.assignment)
            throw new Error (`"${data}" is not a valid condition`)
        condition.setHidden(hidden)
        this.conditions.push(condition)
        return this
    }
}
