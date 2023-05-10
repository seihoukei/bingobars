import './app.css'
import App from './App.svelte'

//init BASE_VALUES before TABLES!
import Codes from "game-classes/codes.js"
import BASE_VALUES from "data/base-values.js"
import TABLES from "data/tables.js"

import MainBingoTable from "game-classes/main-bingo-table.js"

function initCodes() {
    Codes
    BASE_VALUES
    TABLES
    MainBingoTable.registerTableCounters("TX", false)
}

initCodes()

console.log("BASE_VALUES", BASE_VALUES)
console.log("TABLES", TABLES)
console.log("Codes", Codes.getCodes())

const app = new App({
    target: document.getElementById('app')
})

export default app
