import BasicBingoTableData from "game-classes/basic-bingo-table-data.js"
import T1 from './tables/t1.table?raw'
import T2 from './tables/t2.table?raw'
import SB from "./tables/super-bingo.table?raw"
import SuperBingoTableData from "game-classes/super-bingo-table-data.js"

const TABLES = {
    T1 : new BasicBingoTableData("T1").init(T1),
    T2 : new BasicBingoTableData("T2").init(T2),
    SB : new SuperBingoTableData("SB").init(SB),
}

export default TABLES
