import Codes from "game-classes/codes.js"

export default class StringMaker {
    static VALUE_FORMATS = {
        SCIENTIFIC : 0,
        SHORT_SCIENTIFIC : 1,
        PERCENTAGE : 2,
        TIME : 3,
        ONOFF : 4,
    }

    static DEFAULT_FORMAT = {
        prefix : "",
        type : this.VALUE_FORMATS.SCIENTIFIC,
        postfix : "",
    }

    static formatValue(value = 0, format) {
        const usedFormat = Object.assign({}, this.DEFAULT_FORMAT, format)
        let displayValue = ""
        let absoluteValue = Math.abs(value)

        switch (usedFormat.type) {
            case this.VALUE_FORMATS.SCIENTIFIC:
                displayValue = absoluteValue < 1e-2 && value !== 0 ? value.toExponential(2) :
                               absoluteValue < 10000 ? value.toFixed(2) :
                               absoluteValue < 100000 ? value.toFixed(1) :
                               absoluteValue < 1000000 ? value.toFixed(0) :
                               value.toExponential(2)
                break
            case this.VALUE_FORMATS.SHORT_SCIENTIFIC:
                displayValue = absoluteValue < 1e-2 && value !== 0 ? value.toExponential(2) :
                               absoluteValue < 10000 ? value.toFixed(2) :
                               absoluteValue < 100000 ? value.toFixed(1) :
                               absoluteValue < 1000000 ? value.toFixed(0) :
                               value.toExponential(2)
                displayValue = displayValue
                    .replace(/(?<!e.*)(?<=\..*)0*$/,"")
                    .replace(/\.$/,"")
                break
            case this.VALUE_FORMATS.PERCENTAGE:
                const percent = value * 100
                displayValue = percent < 10000 && percent > -10000
                                   ? percent.toFixed(2)
                                   : percent.toExponential(2)
                displayValue = displayValue
                    .replace(/(?<!e.*)(?<=\..*)0*$/,"")
                    .replace(/\.$/,"")
                displayValue += `%`
                break
            case this.VALUE_FORMATS.TIME:
                if (value > (usedFormat.limit ?? Infinity)) {
                    displayValue = usedFormat.limitMessage ?? "months"
                } else if (value < 60) {
                    displayValue = value.toFixed(1) + "s"
                } else {
                    const seconds = value % 60 | 0
                    const minutes = value / 60 % 60 | 0
                    const hours = value / 3600 | 0
                    displayValue = (hours > 100
                            ? `${hours}:${minutes}`
                            : `${hours}:${minutes}:${seconds}`
                        )
                        .replace(/:(\d)(?=:|$)/g, ":0$1") // add leading zeroes for parts
                        .replace(/^(00?:)*0?/g, "") // remove leading zeroes overall
                }
                break
            case this.VALUE_FORMATS.ONOFF:
                displayValue = value ? "ON" : "OFF"
                break
            default:
                displayValue = value
                break
        }

        return `${usedFormat.prefix}${displayValue}${usedFormat.postfix}`
    }

    static formatValueById(value, id) {
        return this.formatValue(value, Codes.get(id)?.format ?? {})
    }
    
    static #lastValue = null
    static #smartReplace(value, calculation, short) {
        if (value.slice(-1) === "%") {
            return value
        }
        
        if (!isNaN(+value)) {
            return StringMaker.formatValueById(+value, this.#lastValue ?? calculation.target ?? calculation.involved[0] ?? "A")
        }
        
        this.#lastValue = value
        return short
            ? value
            : Codes.get(value)?.shortDescription ?? value
    }
    
    static formatCalculation(calculation, short = false) {
        this.#lastValue = null
        return calculation.shortText.replace(/[A-Za-z0-9.%]+/g, (x) => this.#smartReplace(x, calculation, short))
    }

    static template(strings, ...values) {
        return new StringMaker(strings, values)
    }

    #strings = []
    #values = []
    #base = {}
    #baseFormat = StringMaker.DEFAULT_FORMAT

    staticString = ""

    constructor(strings, values, base = Codes.get([values[0]]) ?? {}) {
        this.#strings = strings
        this.#values = values
        this.#base = base
        this.#baseFormat =  Object.assign({}, StringMaker.DEFAULT_FORMAT, base.format)

        this.updateStaticString()
    }

    updateStaticString() {
        const result = []
        for (let i = 0; i < this.#strings.length; i++) {
            result.push(this.#strings[i])
            const value = this.#values[i]
            if (typeof value === "number")
                result.push(StringMaker.formatValue(value, this.#baseFormat))
            else
                result.push(value)
        }
        this.staticString = result.join("")
    }

    dynamicString(values, ignoreFirst = 0) {
        const result = []
        for (let i = 0; i < this.#strings.length; i++) {
            result.push(this.#strings[i])
            const value = this.#values[i]
            if (typeof value === "number")
                result.push(StringMaker.formatValue(value, this.#baseFormat))
            else if (values[value])
                result.push(StringMaker.formatValue(values[value], this.#baseFormat))
            else
                result.push(value)
        }
        return result.join("")
    }

    getInvolved() {
        return this.#values.filter(x => x.type !== "number")
    }
}
