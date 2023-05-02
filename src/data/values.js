import BASE_VALUES from "data/base-values.js"
import VALUES_PER_BASE from "data/values-per-base.js"
import VALUES_PER_TABLE from "data/values-per-table.js"
import SUPER_BINGO from "data/super-bingo.js"
import StringMaker from "utility/string-maker.js"

const VALUES = {}

for (const tableName of ["T", "T1", "T2", "T3", "T4", "T5"]) {
    for (const [name, data] of Object.entries(VALUES_PER_TABLE)) {
        const valueName = name.replace("~", tableName)
        const valueData = {
            table : tableName,
        }
        for (const [id, value] of Object.entries(data)) {
            if (typeof value === 'string')
                valueData[id] = tableName === "T"
                    ? value.replace(/~ ?/g, "")
                    : value.replace(/~/g, tableName)
            else
                valueData[id] = data[id]
        }
        VALUES[valueName] = valueData
    }
}

for (const baseValue of Object.keys(BASE_VALUES)) {
    for (const [name, data] of Object.entries(VALUES_PER_BASE)) {
        const valueName = name.replace("~", baseValue)
        const valueData = {
            baseValue,
        }
        for (const [id, value] of Object.entries(data)) {
            if (typeof value === 'string')
                valueData[id] = value.replace("~", baseValue)
            else
                valueData[id] = data[id]
        }
        VALUES[valueName] = valueData
    }
}

for (const id of Object.keys(SUPER_BINGO.lines)) {
    const valueData = {
        isBingoLine : true
    }
    valueData.format = {type : StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC}
    VALUES[`SB${id}`] = valueData
}

export default VALUES