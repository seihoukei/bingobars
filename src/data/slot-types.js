const SLOT_TYPES = Object.freeze({
    UNKNOWN : 0,
    CELL : 1, //R#C#
    ROW : 2, //R#
    COLUMN : 3, //C#
    DIAGONAL : 4, //DL, DR
    SPECIAL : 5,
})

const SLOT_REGEXP = {
    [SLOT_TYPES.CELL] : /^R\dC\d$/,
    [SLOT_TYPES.ROW] : /^R\d$/,
    [SLOT_TYPES.COLUMN] : /^C\d$/,
    [SLOT_TYPES.DIAGONAL] : /^D[LR]$/,
}

export function getSlotType(name) {
    for (const [type, regex] of Object.entries(SLOT_REGEXP)) {
        if (name.match(regex))
            return +type
    }
    return SLOT_TYPES.UNKNOWN
}

export default SLOT_TYPES
