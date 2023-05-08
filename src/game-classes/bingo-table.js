export default class BingoTable {
    static TABLE_TYPES = Object.freeze({
        BINGO : 1,
        SUPER_BINGO : 2,
        HELL_BINGO : 3,
    })
    
    static SLOT_TYPES = Object.freeze({
        UNKNOWN : 0,
        CELL : 1, //R#C#
        ROW : 2, //R#
        COLUMN : 3, //C#
        DIAGONAL : 4, //DL, DR
        SPECIAL : 5,
    })
    
    static SLOT_STATES = Object.freeze({
        UNKNOWN : 0,
        PREREQUISITES_MET : 1,
        CONDITIONS_MET : 2,
        VISIBLE : 4,
        UNLOCKABLE : 7, //VISIBLE + CON_MET + PRE_MET
        UNLOCKED : 16,
        ENABLED : 32,
    })
    
    static LINE_SLOT_TYPES = [BingoTable.SLOT_TYPES.ROW, BingoTable.SLOT_TYPES.COLUMN, BingoTable.SLOT_TYPES.DIAGONAL]
    
    static SLOT_LIST = [
        `R1C1`, `R1C2`, `R1C3`, `R1C4`, `R1C5`, `R1`,
        `R2C1`, `R2C2`, `R2C3`, `R2C4`, `R2C5`, `R2`,
        `R3C1`, `R3C2`, `R3C3`, `R3C4`, `R3C5`, `R3`,
        `R4C1`, `R4C2`, `R4C3`, `R4C4`, `R4C5`, `R4`,
        `R5C1`, `R5C2`, `R5C3`, `R5C4`, `R5C5`, `R5`,
        `C1`,   `C2`,   `C3`,   `C4`,   `C5`,   `DR`,
        `DL`
    ]
    
    static SLOTS = Object.freeze({
        R1C1 : {
            position: [1,0],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R1C2 : {
            position: [2,0],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R1C3 : {
            position: [3,0],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R1C4 : {
            position: [4,0],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R1C5 : {
            position: [5,0],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R2C1 : {
            position: [1,1],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R2C2 : {
            position: [2,1],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R2C3 : {
            position: [3,1],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R2C4 : {
            position: [4,1],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R2C5 : {
            position: [5,1],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R3C1 : {
            position: [1,2],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R3C2 : {
            position: [2,2],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R3C3 : {
            position: [3,2],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R3C4 : {
            position: [4,2],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R3C5 : {
            position: [5,2],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R4C1 : {
            position: [1,3],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R4C2 : {
            position: [2,3],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R4C3 : {
            position: [3,3],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R4C4 : {
            position: [4,3],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R4C5 : {
            position: [5,3],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R5C1 : {
            position: [1,4],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R5C2 : {
            position: [2,4],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R5C3 : {
            position: [3,4],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R5C4 : {
            position: [4,4],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R5C5 : {
            position: [5,4],
            type: BingoTable.SLOT_TYPES.CELL,
        },
        R1 : {
            type: BingoTable.SLOT_TYPES.ROW,
            position : [6,0],
            cells: [[0,0], [1,0], [2,0], [3,0], [4,0]],
            dependencies : ["R1C1", "R1C2", "R1C3", "R1C4", "R1C5"],
        },
        R2 : {
            type: BingoTable.SLOT_TYPES.ROW,
            position : [6,1],
            cells: [[0,1], [1,1], [2,1], [3,1], [4,1]],
            dependencies : ["R2C1", "R2C2", "R2C3", "R2C4", "R2C5"],
        },
        R3 : {
            type: BingoTable.SLOT_TYPES.ROW,
            position : [6,2],
            cells: [[0,2], [1,2], [2,2], [3,2], [4,2]],
            dependencies : ["R3C1", "R3C2", "R3C3", "R3C4", "R3C5"],
        },
        R4 : {
            type: BingoTable.SLOT_TYPES.ROW,
            position : [6,3],
            cells: [[0,3], [1,3], [2,3], [3,3], [4,3]],
            dependencies : ["R4C1", "R4C2", "R4C3", "R4C4", "R4C5"],
        },
        R5 : {
            type: BingoTable.SLOT_TYPES.ROW,
            position : [6,4],
            cells: [[0,4], [1,4], [2,4], [3,4], [4,4]],
            dependencies : ["R5C1", "R5C2", "R5C3", "R5C4", "R5C5"],
        },
        C1 : {
            type: BingoTable.SLOT_TYPES.COLUMN,
            position : [1,5],
            cells: [[0,0], [0,1], [0,2], [0,3], [0,4]],
            dependencies : ["R1C1", "R2C1", "R3C1", "R4C1", "R5C1"],
        },
        C2 : {
            type: BingoTable.SLOT_TYPES.COLUMN,
            position : [2,5],
            cells: [[1,0], [1,1], [1,2], [1,3], [1,4]],
            dependencies : ["R1C2", "R2C2", "R3C2", "R4C2", "R5C2"],
        },
        C3 : {
            type: BingoTable.SLOT_TYPES.COLUMN,
            position : [3,5],
            cells: [[2,0], [2,1], [2,2], [2,3], [2,4]],
            dependencies : ["R1C3", "R2C3", "R3C3", "R4C3", "R5C3"],
        },
        C4 : {
            type: BingoTable.SLOT_TYPES.COLUMN,
            position : [4,5],
            cells: [[3,0], [3,1], [3,2], [3,3], [3,4]],
            dependencies : ["R1C4", "R2C4", "R3C4", "R4C4", "R5C4"],
        },
        C5 : {
            type: BingoTable.SLOT_TYPES.COLUMN,
            position : [5,5],
            cells: [[4,0], [4,1], [4,2], [4,3], [4,4]],
            dependencies : ["R1C5", "R2C5", "R3C5", "R4C5", "R5C5"],
        },
        DL : {
            type: BingoTable.SLOT_TYPES.DIAGONAL,
            position : [0,5],
            cells: [[4,0], [3,1], [2,2], [1,3] ,[0,4]],
            dependencies : ["R1C5","R2C4","R3C3","R4C2","R5C1"],
        },
        DR : {
            type: BingoTable.SLOT_TYPES.DIAGONAL,
            position : [6,5],
            cells: [[0,0], [1,1], [2,2], [3,3], [4,4]],
            dependencies : ["R1C1","R2C2","R3C3","R4C4","R5C5"],
        },
    })
    
    constructor(id, data) {
        this.id = id
        this.name = this.id
    }
}
