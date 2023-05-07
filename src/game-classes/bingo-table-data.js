export default class BingoTableData {
    static TABLE_TYPES = {
        BINGO : 1,
        SUPER_BINGO : 2,
        HELL_BINGO : 3,
    }
    
    static SLOT_LIST = [
        `R1C1`, `R1C2`, `R1C3`, `R1C4`, `R1C5`, `R1`,
        `R2C1`, `R2C2`, `R2C3`, `R2C4`, `R2C5`, `R2`,
        `R3C1`, `R3C2`, `R3C3`, `R3C4`, `R3C5`, `R3`,
        `R4C1`, `R4C2`, `R4C3`, `R4C4`, `R4C5`, `R4`,
        `R5C1`, `R5C2`, `R5C3`, `R5C4`, `R5C5`, `R5`,
        `C1`,   `C2`,   `C3`,   `C4`,   `C5`,   `DR`,
        `DL`
    ]
    
    static LINES = {
        R1 : {
            cells: [[0,0], [1,0], [2,0], [3,0], [4,0]],
            position : [6,0],
        },
        R2 : {
            cells: [[0,1], [1,1], [2,1], [3,1], [4,1]],
            position : [6,1],
        },
        R3 : {
            cells: [[0,2], [1,2], [2,2], [3,2], [4,2]],
            position : [6,2],
        },
        R4 : {
            cells: [[0,3], [1,3], [2,3], [3,3], [4,3]],
            position : [6,3],
        },
        R5 : {
            cells: [[0,4], [1,4], [2,4], [3,4], [4,4]],
            position : [6,4],
        },
        C1 : {
            cells: [[0,0], [0,1], [0,2], [0,3], [0,4]],
            position : [1,5],
        },
        C2 : {
            cells: [[1,0], [1,1], [1,2], [1,3], [1,4]],
            position : [2,5],
        },
        C3 : {
            cells: [[2,0], [2,1], [2,2], [2,3], [2,4]],
            position : [3,5],
        },
        C4 : {
            cells: [[3,0], [3,1], [3,2], [3,3], [3,4]],
            position : [4,5],
        },
        C5 : {
            cells: [[4,0], [4,1], [4,2], [4,3], [4,4]],
            position : [5,5],
        },
        DL : {
            cells: [[4,0], [3,1], [2,2], [1,3] ,[0,4]],
            position : [0,5],
        },
        DR : {
            cells: [[0,0], [1,1], [2,2], [3,3], [4,4]],
            position : [6,5],
        },
    }
    
    constructor(id, data) {
        this.id = id
        this.name = this.id
    }
}
