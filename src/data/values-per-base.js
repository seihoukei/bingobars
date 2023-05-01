import StringMaker from "utility/string-maker.js"

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
        format : {
            type: StringMaker.VALUE_FORMATS.ONOFF,
        },
        hidden : true,
    },
    '~_auto_seen' : {
        description : "~ auto prestige unlocked",
        format : {
            type: StringMaker.VALUE_FORMATS.ONOFF,
        },
        hidden : true,
    },
}

export default VALUES_PER_BASE