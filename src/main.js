import './app.css'
import App from './App.svelte'

import Codes from "game-classes/codes.js"
import TABLES from "data/tables.js"
import BASE_VALUES from "data/base-values.js"

import MainBingoTable from "game-classes/main-bingo-table.js"

function initCodes() {
    MainBingoTable.registerTableCounters("TX", false)
}

initCodes()

if (import.meta.env.MODE === "development") {
    console.log("BASE_VALUES", BASE_VALUES)
    console.log("TABLES", TABLES)
    console.log("Codes", Codes.getCodes())
}

const app = new App({
    target: document.getElementById('app')
})

export default app
