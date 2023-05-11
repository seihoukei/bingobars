import Codes from "game-classes/codes.js"
import StringMaker from "utility/string-maker.js"

export default class BaseValue {
    static STORED_VALUES = ["X", "MX", "XP", "Xt", "XPt", "X_auto"]
    static DERIVED_VALUES = ["dX", "MX0", "MXm", "dXP", "XPc", "X_seen", "X_auto_seen"]
    static RELATED_VALUES = [...BaseValue.STORED_VALUES, ...BaseValue.DERIVED_VALUES]
    
    static DEFAULT_VALUES = {
        X : 0,
        MX : 5,
        XP : 0,
        Xt : 0,
        XPt : 0,
        
        dX : 1,
        MX0 : 5,
        MXm : 2,
        
        dXP : 1,
        XPc : 1,
        
        X_auto : true,
        
        X_seen : false,
        X_auto_seen : false,
    }
    
    static VALUE_DESCRIPTIONS = {
        'X' : {
            description : "Current ~ value",
            shortDescription: "~ value",
            format : {
                type : StringMaker.VALUE_FORMATS.SCIENTIFIC
            },
        },
        'dX' : {
            description: "Growth speed for ~",
            shortDescription: "~ growth",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            }
        },
        'MX' : {
            description: "Current ~ limit",
            shortDescription: "~ limit",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
        'MXm' : {
            description: "~ limit multiplier",
            shortDescription: "~ limit multi",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
        "MX0" : {
            description: "~ limit after reset",
            shortDescription: "Initial ~ limit",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
        'XP' : {
            description : "Current ~ points",
            shortDescription: "~ points",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
        'dXP' : {
            description : "~ points per prestige",
            shortDescription: "~ point prestige",
            format : {
                type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC,
            },
        },
        'XPc' : {
            description : "~ prestige cost",
            shortDescription: "~ prestige cost",
            format : {
                type: StringMaker.VALUE_FORMATS.PERCENTAGE,
            },
        },
        'Xt' : {
            description : "Time since ~ reset",
            shortDescription: "~ reset time",
            format : {
                type: StringMaker.VALUE_FORMATS.TIME,
            },
        },
        'XPt' : {
            description : "Time since ~ prestige",
            shortDescription: "~ prestige time",
            format : {
                type: StringMaker.VALUE_FORMATS.TIME,
            },
        },
        'X_seen' : {
            description : "~ unlocked",
            shortDescription: "~ unlocked",
            format : {
                type: StringMaker.VALUE_FORMATS.ONOFF,
            },
            hidden : true,
        },
        'X_auto' : {
            description : "~ auto prestige",
            shortDescription: "~ auto prestige",
            format : {
                type: StringMaker.VALUE_FORMATS.ONOFF,
            },
            hidden : true,
        },
        'X_auto_seen' : {
            description : "~ auto prestige unlocked",
            shortDescription: "~ auto prestige unlocked",
            format : {
                type: StringMaker.VALUE_FORMATS.ONOFF,
            },
            hidden : true,
        },
    }
    
    
    static DEFAULT_COLORS = {
        dark : "#222222",
        normal : "#555555",
        light : "#888888",
        bright : "#CCCCCC",
    }
    
    static getCodes(id, list = BaseValue.RELATED_VALUES) {
        return Object.fromEntries(
            list.map(code => [code, code.replace("X", id)])
        )
    }
    
    static getCodeList(id, list = BaseValue.RELATED_VALUES) {
        return list.map(code => code.replace("X", id))
    }
    
    id = null
    
    codes = null
    
    constructor(id, values = {}, colors = {}) {
        this.id = id
        this.codes = BaseValue.getCodes(id)
        this.storedCodesList = BaseValue.getCodeList(id, BaseValue.STORED_VALUES)
        this.derivedCodesList = BaseValue.getCodeList(id, BaseValue.DERIVED_VALUES)
        this.codesList = BaseValue.getCodeList(id, BaseValue.RELATED_VALUES)
    
        const defaults = Object.assign({}, BaseValue.DEFAULT_VALUES, values)
        defaults.MX = defaults.MX0
        
        this.defaults = Object.fromEntries(
            Object.entries(defaults)
                .map(([code, value]) => [this.codes[code], value])
        )
        
        this.derivedDefaults = Object.fromEntries(
            this.derivedCodesList.map(x => [x, this.defaults[x]])
        )
        
        this.colors = Object.assign({}, BaseValue.DEFAULT_COLORS, colors)
    
        this.#registerCodes()
    }
    
    #registerCode(code, valueData, description = {}) {
        for (const [id, value] of Object.entries(description)) {
            if (typeof value === 'string')
                valueData[id] = value.replace("~", this.id)
            else
                valueData[id] = description[id]
        }

        Codes.registerCode(code, valueData)
    }
    
    #registerCodes() {
        for (const value of BaseValue.STORED_VALUES) {
            const code = value.replace(/X/g, this.id)
            this.#registerCode(code,{
                type : Codes.TYPES.VALUE,
                derived : false,
                baseValue : this,
            }, BaseValue.VALUE_DESCRIPTIONS[value])
        }
        
        for (const value of BaseValue.DERIVED_VALUES) {
            const code = value.replace(/X/g, this.id)
            this.#registerCode(code,{
                type : Codes.TYPES.VALUE,
                derived : true,
                initialValue : this.defaults[code],
                baseValue : this,
            }, BaseValue.VALUE_DESCRIPTIONS[value])
        }
    }

}
