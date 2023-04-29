import {getSlotType} from "data/slot-types.js"
import Calculation from "utility/calculation.js"

const TABLES = Object.freeze({
    T1 : {
        name : "Table 1",
        conditions : [],
        slots : {
            R1C1 : {
                prerequisites : [
                    "???",
                ],
                conditions : [
//                    new Calculation(""),
                ],
                modifiers : [
//                    new Calculation(""),
                ],
                //oneWay : true,
            },
            R1C2 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R1C3 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("AP >= 1"),
                ],
                modifiers : [
                    new Calculation("dA += 1")
                ],
                //oneWay : true,
            },
            R1C4 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R1C5 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R2C1 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R2C2 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("A > 16"),
                ],
                modifiers : [
                    new Calculation("dA += 1")
                ],
                //oneWay : true,
            },
            R2C3 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R2C4 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("A > 32"),
                ],
                modifiers : [
                    new Calculation("MAm += 1")
                ],
                //oneWay : true,
            },
            R2C5 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R3C1 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("AP >= 4"),
                ],
                modifiers : [
                    new Calculation("dA += 2"),
                ],
                //oneWay : true,
            },
            R3C2 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                ],
                modifiers : [
                    new Calculation("B_seen = true")
                ],
                oneWay : true,
            },
            R3C3: {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("A >= 1000"),
                ],
                modifiers : [
                    new Calculation("B_seen = true")
                ],
                oneWay : true,
            },
            R3C4 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                ],
                modifiers : [
                    new Calculation("dA *= AP + 1"),
                ],
                //oneWay : true,
            },
            R3C5 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("AP >= 3"),
                    new Calculation("MA < 30"),
                ],
                modifiers : [
                    new Calculation("dA += AP")
                ],
                //oneWay : true,
            },
            R4C1 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R4C2 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("MA > 400"),
                    new Calculation("100 < A < 200"),
                ],
                modifiers : [
                    new Calculation("A_auto_seen = true")
                ],
                oneWay : true,
            },
            R4C3 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("AP > 1"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R4C4 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("A >= 100"),
                ],
                modifiers : [
                    new Calculation("MAm -= 0.2")
                ],
                //oneWay : true,
            },
            R4C5 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R5C1 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R5C2 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R5C3 : {
                prerequisites : [
                    "T1R3C3"
                ],
                conditions : [
                    new Calculation("A * B > 1e8"),
                ],
                modifiers : [
                    new Calculation("AB_seen = true")
                ],
                oneWay : true,
            },
            R5C4 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R5C5 : {
                prerequisites : [
                    "???"
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R1 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R2 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R3 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R4 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R5 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            C1 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            C2 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            C3 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("AP > 1"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            C4 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            C5 : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            DL : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            DR : {
                prerequisites : [
                ],
                conditions : [
                    new Calculation("false"),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
        },
    },
})

for (const [tableName,table] of Object.entries(TABLES)) {
    for (const [slotName, slot] of Object.entries(table.slots)) {
        slot.type ??= getSlotType(slotName)
        slot.address = `${tableName}${slotName}`
        if (!slot.modifiers)
            continue
        const address = `${tableName}${slotName}`
        for (const modifier of slot.modifiers)
            modifier.setSource(address)
    }
}
export default TABLES
