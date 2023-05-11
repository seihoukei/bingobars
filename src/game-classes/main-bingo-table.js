import MainBingoSlot from "game-classes/main-bingo-slot.js"
import Calculation from "game-classes/calculation.js"
import TableParser from "utility/table-parser.js"
import BingoTable from "game-classes/bingo-table.js"
import StringMaker from "utility/string-maker.js"
import Codes from "game-classes/codes.js"

export default class MainBingoTable extends BingoTable{
    static COUNTERS = {
        "~S" : {
            description : "Unlocked ~ slots",
            shortDescription: "Unlocked ~ slots",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
        "~c" : {
            description : "Unlocked ~ cell (~R#C#) slots",
            shortDescription: "Unlocked ~ main cells",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
        "~R" : {
            description : "Unlocked ~ row (~R#) slots",
            shortDescription: "Unlocked ~ rows",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
        "~C" : {
            description : "Unlocked ~ column (~C#) slots",
            shortDescription: "Unlocked ~ columns",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
        "~D" : {
            description : "Unlocked ~ diagonal (~DX) slots",
            shortDescription: "Unlocked ~ diagonals",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
        "~L" : {
            description : "Unlocked ~ line (~R#/~C#/~DX) slots",
            shortDescription: "Unlocked ~ lines",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
    }
    
    static COUNTER_LIST = ["S","c","R","C","D","L"]
    
    static registerTableCounters(table, real = true) {
        for (const [code, data] of Object.entries(MainBingoTable.COUNTERS)) {
            const codeData = {
                type : Codes.TYPES.COUNTER,
                table,
            }
            for (const [id, value] of Object.entries(data)) {
                if (typeof value === 'string')
                    codeData[id] = real
                            ? value.replace(/~/g, table)
                            : value.replace(/~ ?/g, "")
                else
                    codeData[id] = value
            }
            Codes.registerCode(code.replace(/~/g, table), codeData)
        }
    }
    
    type = BingoTable.TABLE_TYPES.BINGO

    conditions = []
    slots = {}
    
    init(data) {
        for (let id of MainBingoTable.SLOT_LIST)
            this.slots[id] = new MainBingoSlot(this.id, id)
        
        this.parse(data)
        
        MainBingoTable.registerTableCounters(this.id, true)
        
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
