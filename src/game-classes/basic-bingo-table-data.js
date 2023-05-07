import BasicBingoTableSlotData from "game-classes/basic-bingo-table-slot-data.js"
import Calculation from "game-classes/calculation.js"
import TableParser from "utility/table-parser.js"
import BingoTableData from "game-classes/bingo-table-data.js"

export default class BasicBingoTableData extends BingoTableData{
    type = BingoTableData.TABLE_TYPES.BINGO

    conditions = []
    slots = {}
    
    
    init(data) {
        for (let name of BasicBingoTableData.SLOT_LIST)
            this.slots[name] = new BasicBingoTableSlotData(this.id, name)
        
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
