import BingoTableSlotData from "utility/bingo-table-slot-data.js"
import Calculation from "utility/calculation.js"

const SLOT_LIST = [
    `R1C1`, `R1C2`, `R1C3`, `R1C4`, `R1C5`, `R1`,
    `R2C1`, `R2C2`, `R2C3`, `R2C4`, `R2C5`, `R2`,
    `R3C1`, `R3C2`, `R3C3`, `R3C4`, `R3C5`, `R3`,
    `R4C1`, `R4C2`, `R4C3`, `R4C4`, `R4C5`, `R4`,
    `R5C1`, `R5C2`, `R5C3`, `R5C4`, `R5C5`, `R5`,
    `C1`,   `C2`,   `C3`,   `C4`,   `C5`,   `DR`,
    `DL`
]

export default class BingoTableData {
    conditions = []
    slots = {}

    constructor(id, data) {
        this.id = id
        this.name = this.id

        this.init()
        this.parse(data)
    }

    init() {
        for (let name of SLOT_LIST)
            this.slots[name] = new BingoTableSlotData(this.id, name)
    }

    parse(data) {
        const lines = data
            .split("\n")
            .map(x => x
                .replace(/\/\/[\s\S]*/, "")
                .trim()
            )
            .filter(x => x.length)

        let context = this

        for (let line of lines) {
            const parsed = line.match(/^([^\s:]*)\s*:?\s*(.*)$/)
            if (!parsed) {
                console.log(`Failed to parse "${line}"`)
                continue
            }
            const [, command, data] = parsed

            switch (command) {
                case "#":
                    context = this.slots[data]
                    break
                case "N":
                    context.setName(data)
                    break
                case "R":
                    context.addPrerequisite(data)
                    break
                case "M":
                    context.addModifier(data)
                    break
                case "C":
                    context.addCondition(data)
                    break
                case "M!":
                    context.addModifier(data, true)
                    break
                case "C!":
                    context.addCondition(data, true)
                    break
                case "m":
                    context.setModifierText(data)
                    break
                case "c":
                    context.setConditionText(data)
                    break
                case "$":
                    context.setBingoins(data)
                    break
                case "LOCK":
                    context.setOneWay()
                    break
            }
        }
    }

    setName(name) {
        this.name = name
    }

    addCondition(data) {
        const condition = new Calculation(data)
        if (condition.assignment)
            throw new Error (`"${data}" is not a valid condition`)
        this.conditions.push(condition)
    }

}