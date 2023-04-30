import StringMaker from "utility/string-maker.js"
import BASE_VALUES from "data/base-values.js"

const VALUES_PER_BASE = {
    '~' : {
        description : "Current ~ value",
        format : {
            type : StringMaker.VALUE_FORMATS.SCIENTIFIC
        },
    },
    'd~' : {
        description: "Growth speed for ~",
        format : {
            type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            postfix: "/s",
        }
    },
    'M~' : {
        description: "Current ~ limit",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
    'M~m' : {
        description: "~ limit multiplier",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
    "M~0" : {
        description: "~ limit after reset",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
    '~P' : {
        description : "Current ~ points",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
    'd~P' : {
        description : "~ points per prestige",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
    '~Pc' : {
        description : "~ prestige cost",
        format : {
			type: StringMaker.VALUE_FORMATS.PERCENTAGE,
		},
    },
    '~t' : {
        description : "Time since ~ reset",
        format : {
			type: StringMaker.VALUE_FORMATS.TIME,
		},
    },
    '~Pt' : {
        description : "Time since ~ prestige",
        format : {
			type: StringMaker.VALUE_FORMATS.TIME,
		},
    },
    '~_seen' : {
        description : "~ unlocked",
        hidden : true,
        format : {
			type: StringMaker.VALUE_FORMATS.ONOFF,
		},
    },
    '~_auto_seen' : {
        description : "~ prestige unlocked",
        hidden : true,
        format : {
			type: StringMaker.VALUE_FORMATS.ONOFF,
		},
    },
}

const VALUES = {
    "SN" : {
        description : "Unlocked slots",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
    "cN" : {
        description : "Unlocked cell (R#C#) slots",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
    "RN" : {
        description : "Unlocked row (R#) slots",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
    "CN" : {
        description : "Unlocked column (C#) slots",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
    "DN" : {
        description : "Unlocked diagonal (DX) slots",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
    "LN" : {
        description : "Unlocked line (R#/C#/DX) slots",
        format : {
			type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
		},
    },
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

//console.log("VALUES", VALUES)

export default VALUES