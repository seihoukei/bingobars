import TableParser from "utility/table-parser.js"
import SuperBingoTableLineData from "game-classes/super-bingo-table-line-data.js"
import BingoTableData from "game-classes/bingo-table-data.js"

export default class SuperBingoTableData extends  BingoTableData {
    static DEFAULT_COSTS = [
        [1, 1, 1, 1, 1,],
        [1, 1, 1, 1, 1,],
        [1, 1, 0, 1, 1,],
        [1, 1, 1, 1, 1,],
        [1, 1, 1, 1, 1,],
    ]
    
    type = BingoTableData.TABLE_TYPES.SUPER_BINGO
    
    init(data) {
        this.costs = structuredClone(SuperBingoTableData.DEFAULT_COSTS)
        this.lines = {}
        for (const [id, {cells, position}] of Object.entries(SuperBingoTableData.LINES)) {
            this.lines[id] = new SuperBingoTableLineData(`${this.id}${id}`, cells, position)
        }
        
        this.parse(data)
        
        return this
    
    }
    
    parse(data) {
        TableParser.parse(
            data,
            this,
            this.lines,
            {
                "M" : "setModifier",
                "COSTS" : "setCosts",
            }
        )
    
        return this
    }
    
    setCosts(data) {
        const costs = [
            ...data
                .match(/\d+/g)
                .map(Number),
            ...Array(25)
                .fill(0),
        ]
        
        this.costs = [
            costs.slice(0, 5),
            costs.slice(5, 10),
            costs.slice(10, 15),
            costs.slice(15, 20),
            costs.slice(20, 25),
        ]
        
        return this
    }
}
