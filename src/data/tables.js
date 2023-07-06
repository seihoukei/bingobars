import MainBingoTable from "game-classes/main-bingo-table.js"
import SuperBingoTable from "game-classes/super-bingo-table.js"

import T1 from './tables/t1.table?raw'
import T2 from './tables/t2.table?raw'
import T3 from './tables/t3.table?raw'
import T4 from './tables/t4.table?raw'
import T5 from './tables/t5.table?raw'
import SB from "./tables/super-bingo.table?raw"
import HL from "./tables/hell-bingo.table?raw"
import HellBingoTable from "game-classes/hell-bingo-table.js"

const TABLES = {
    T1 : new MainBingoTable("T1").init(T1),
    T2 : new MainBingoTable("T2").init(T2),
    T3 : new MainBingoTable("T3").init(T3),
    T4 : new MainBingoTable("T4").init(T4),
    T5 : new MainBingoTable("T5").init(T5),
    SB : new SuperBingoTable("SB").init(SB),
    HL : new HellBingoTable("HL").init(HL),
}

export default TABLES
