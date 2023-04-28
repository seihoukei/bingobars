import formatString from "utility/format-string.js"

export default class Modifier {
    static unlock(stat) {
        return new Modifier(
            values =>
                values[`${stat}_seen`] = true,
            formatString`Unlock ${stat}`,
            0, stat
        )
    }
    
    static autoPrestige(stat) {
        return new Modifier(
            values =>
                values[`${stat}_auto`] = true,
            formatString`Automatic ${stat} prestige`,
            0, stat
        )
    }
    
    static add(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] += (values[value] ?? value),
            formatString`${stat} = ${stat} + ${value}`,
            1, stat, value
        )
    }
    
    static addLater(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] += (values[value] ?? value),
            formatString`${stat} = ${stat} + ${value} (late)`,
            3, stat, value
        )
    }
    
    static sub(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] -= (values[value] ?? value),
            formatString`${stat} = ${stat} - ${value}`,
            1, stat, value
        )
    }
    
    static subLater(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] -= (values[value] ?? value),
            formatString`${stat} = ${stat} - ${value} (late)`,
            3, stat, value
        )
    }
    
    static mul(stat, value = 2) {
        return new Modifier(
            values =>
                values[stat] *= (values[value] ?? value),
            formatString`${stat} = ${stat} * ${value}`,
            2, stat, value
        )
    }
    
    static div(stat, value = 2) {
        return new Modifier(
            values =>
                values[stat] /= (values[value] ?? value),
            formatString`${stat} = ${stat} / ${value}`,
            2, stat, value
        )
    }
    
    static assign(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] = (values[value] ?? value),
            formatString`${stat} = ${value} (initial)`,
            0, stat, value
        )
    }
    
    static fix(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] = (values[value] ?? value),
            formatString`${stat} = ${value} (hard)`,
            4, stat, value
        )
    }
    
    #modifier = null
    text = null
    
    constructor(modifier, text, priority = 1, target, value) {
        this.#modifier = modifier
        this.text = text
        this.priority = priority
        this.target = target
        this.value = value
    }
    
    apply(values) {
        return this.#modifier?.(values)
    }
    
    setSource(slot) {
        this.source = slot
    }
}
