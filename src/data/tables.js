import Condition from "utility/condition.js"
import Modifier from "utility/modifier.js"
import {getSlotType} from "data/slot-types.js"

const TABLES = Object.freeze({
    T1 : {
        name : "Table 1",
        conditions : [],
        slots : {
            R1C1 : {
                prerequisites : [
                    "T1C3",
                ],
                conditions : [
                    Condition.moreOrEqual("A",2000),
                    Condition.lessOrEqual("Ap",10),
                ],
                modifiers : [
                    Modifier.add("dBp", 1)
                ],
                //oneWay : true,
            },
            R1C2 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R1C3 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.more("MA", 40),
                    Condition.range("A", 30, 50),
                ],
                modifiers : [
                    Modifier.add("MAm", 1)
                ],
                //oneWay : true,
            },
            R1C4 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R1C5 : {
                prerequisites : [
                    "T1R5C1",
                ],
                conditions : [
                    Condition.moreOrEqual("Ap", 10),
                    Condition.lessOrEqual("At", 120),
                ],
                modifiers : [
                    Modifier.mul("dB", 2)
                ],
                //oneWay : true,
            },
            R2C1 : {
                prerequisites : [
                    "T1R2C3",
                ],
                conditions : [
                    Condition.moreOrEqual("A", 50),
                ],
                modifiers : [
                    Modifier.add("dA", 1),
                ],
                //oneWay : true,
            },
            R2C2 : {
                prerequisites : [
                    "T1R3",
                ],
                conditions : [
                    Condition.moreOrEqual("Ap", 6),
                    Condition.lessOrEqual("MA", 50),
    
                ],
                modifiers : [
                    Modifier.add("dB", 2)
                ],
                //oneWay : true,
            },
            R2C3 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.moreOrEqual("A", 15),
                ],
                modifiers : [
                    Modifier.add("dA", 1),
                ],
                //oneWay : true,
            },
            R2C4 : {
                prerequisites : [
                    "T1R4C2",
                ],
                conditions : [
                    Condition.moreOrEqual("B", 100),
                ],
                modifiers : [
                    Modifier.sub("MBm", 0.1)
                ],
                //oneWay : true,
            },
            R2C5 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R3C1 : {
                prerequisites : [
                    "T1R4C2",
                ],
                conditions : [
                    Condition.moreOrEqual("Bp", 2),
                ],
                modifiers : [
                    Modifier.autoPrestige("B"),
                ],
                //oneWay : true,
            },
            R3C2 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.moreOrEqual("Ap", 5),
                ],
                modifiers : [
                    Modifier.sub("pAc", 0.1),
                ],
                //oneWay : true,
            },
            R3C3: {
                prerequisites : [],
                conditions : [
                    Condition.moreOrEqual("Ap", 2),
                ],
                modifiers : [
                    Modifier.autoPrestige("A"),
                ],
                //oneWay : true,
            },
            R3C4 : {
                prerequisites : [
                    "T1R4C2",
                ],
                conditions : [
                    Condition.more("A", 10),
                    Condition.less("B", 10),
                ],
                modifiers : [
                    Modifier.sub("MAm", 0.2)
                ],
                //oneWay : true,
            },
            R3C5 : {
                prerequisites : [
                    "T1R4C3",
                ],
                conditions : [
                    Condition.moreOrEqual("A", 120),
                ],
                modifiers : [
                    Modifier.add("dA", 2)
                ],
                //oneWay : true,
            },
            R4C1 : {
                prerequisites : [
                    "T1R4C2",
                ],
                conditions : [
                    Condition.moreOrEqual("B", 22),
                ],
                modifiers : [
                    Modifier.add("MAm", 1),
                ],
                //oneWay : true,
            },
            R4C2 : {
                prerequisites : [
                    "T1R3C5",
                ],
                conditions : [
                    Condition.moreOrEqual("A", 250),
                ],
                modifiers : [
                    Modifier.unlock("B")
                ],
                oneWay : true,
            },
            R4C3 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.moreOrEqual("A", 25),
                ],
                modifiers : [
                    Modifier.add("dA", 1)
                ],
                //oneWay : true,
            },
            R4C4 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.equal("A", 600),
                ],
                modifiers : [
                    Modifier.mul("dA", 2),
                ],
                //oneWay : true,
            },
            R4C5 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R5C1 : {
                prerequisites : [
                    "T1R4C2",
                ],
                conditions : [
                    Condition.moreOrEqual("A", 1000),
                ],
                modifiers : [
                    Modifier.add("dB", 2)
                ],
                //oneWay : true,
            },
            R5C2 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R5C3 : {
                prerequisites : [
                    "T1R3",
                ],
                conditions : [
                    Condition.moreOrEqual("LN", 2),
                ],
                modifiers : [
                    Modifier.mul("dA", "LN")
                ],
                //oneWay : true,
            },
            R5C4 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R5C5 : {
                prerequisites : [
                    "T1R5C1",
                ],
                conditions : [
                    Condition.moreOrEqual("Ap", 6),
                    Condition.range("A", 10, 20),
                ],
                modifiers : [
                    Modifier.add("MAm", 1),
                ],
                //oneWay : true,
            },
            R1 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R2 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R3 : {
                prerequisites : [
                    "T1R4C2",
                ],
                conditions : [
                ],
                modifiers : [
                    Modifier.add("dA", "Bp")
                ],
                //oneWay : true,
            },
            R4 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            R5 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            C1 : {
                prerequisites : [
                ],
                conditions : [
                ],
                modifiers : [
                    Modifier.sub("MAm", 0.1)
                ],
                //oneWay : true,
            },
            C2 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            C3 : {
                prerequisites : [
                ],
                conditions : [
                ],
                modifiers : [
                    Modifier.add("dAp", 1),
                ],
                //oneWay : true,
            },
            C4 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            C5 : {
                prerequisites : [
                ],
                conditions : [
                    Condition.impossible(),
                ],
                modifiers : [
                ],
                //oneWay : true,
            },
            DL : {
                prerequisites : [
                ],
                conditions : [
                ],
                modifiers : [
                    Modifier.sub("pAc", 0.1)
                ],
                //oneWay : true,
            },
            DR : {
                prerequisites : [
                ],
                conditions : [
                ],
                modifiers : [
                    Modifier.mul("dA", 2)
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
            modifier.source = address
    }
}
export default TABLES
