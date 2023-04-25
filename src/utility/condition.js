import formatString from "utility/format-string.js"

export default class Condition {
    static DEFAULT_MARGIN = 1
    
    static impossible() {
        return new Condition(
            () => false,
            formatString`Unattainable`
        )
    }
    
    static more(stat, value) {
        return new Condition(
            values =>
                values[stat] > (values[value] ?? value),
            formatString`${stat} > ${value}`
        )
    }
    
    static moreOrEqual(stat, value) {
        return new Condition(
            values =>
                values[stat] >= (values[value] ?? value),
            formatString`${stat} >= ${value}`
        )
    }
    
    static equal(stat, value) {
        return new Condition(
            values =>
                values[stat] === (values[value] ?? value),
            formatString`${stat} = ${value}`
        )
    }
    
    static unequal(stat, value) {
        return new Condition(
            values =>
                values[stat] !== (values[value] ?? value),
            formatString`${stat} ≠ ${value}`
        )
    }
    
    static lessOrEqual(stat, value) {
        return new Condition(
            values =>
                values[stat] <= (values[value] ?? value),
            formatString`${stat} <= ${value}`
        )
    }
    
    static less(stat, value) {
        return new Condition(
            values =>
                values[stat] < (values[value] ?? value),
            formatString`${stat} < ${value}`
        )
    }
    
    static around (stat, value, margin = Condition.DEFAULT_MARGIN) {
        return new Condition(
            values =>
                values[stat] >= (values[value] ?? value) - margin &&
                values[stat] <= (values[value] ?? value) - margin,
            formatString`|${stat} - ${value}| <= ${margin}`
        )
    }
    
    static range (stat, min, max) {
        return new Condition(
            values =>
                values[stat] >= (values[min] ?? min) &&
                values[stat] <= (values[max] ?? max),
            formatString`${min} <= ${stat} <= ${max}`
        )
    }
    
    #condition = null
    text = null
    
    constructor(condition, text) {
        this.#condition = condition
        this.text = text
    }
    
    check(values) {
        return this.#condition?.(values)
    }
}
