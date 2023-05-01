import StringMaker from "utility/string-maker.js"

const VALUES_PER_TABLE = {
    "~_SN" : {
        description : "Unlocked ~ slots",
        format : {
            type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
        },
    },
    "~_cN" : {
        description : "Unlocked ~ cell (~R#C#) slots",
        format : {
            type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
        },
    },
    "~_RN" : {
        description : "Unlocked ~ row (~R#) slots",
        format : {
            type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
        },
    },
    "~_CN" : {
        description : "Unlocked ~ column (~C#) slots",
        format : {
            type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
        },
    },
    "~_DN" : {
        description : "Unlocked ~ diagonal (~DX) slots",
        format : {
            type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
        },
    },
    "~_LN" : {
        description : "Unlocked ~ line (~R#/~C#/~DX) slots",
        format : {
            type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
        },
    },
}

export default VALUES_PER_TABLE