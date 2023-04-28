import VALUES from "data/values.js" //important
import StringMaker from "utility/StringMaker.js"

export default class Modifier {
    static unlock(stat) {
        return new Modifier(
            values =>
                values[`${stat}_seen`] = true,
            StringMaker.template`Unlock ${stat}`,
            0, stat
        )
    }

    static autoPrestige(stat) {
        return new Modifier(
            values =>
                values[`${stat}_auto`] = true,
            StringMaker.template`Automatic ${stat} prestige`,
            0, stat
        )
    }

    static add(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] += (values[value] ?? value),
            StringMaker.template`${stat} += ${value}`,
            1, stat, value
        )
    }

    static addLater(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] += (values[value] ?? value),
            StringMaker.template`${stat} += ${value} (late)`,
            3, stat, value
        )
    }

    static sub(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] -= (values[value] ?? value),
            StringMaker.template`${stat} -= ${value}`,
            1, stat, value
        )
    }

    static subLater(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] -= (values[value] ?? value),
            StringMaker.template`${stat} -= ${value} (late)`,
            3, stat, value
        )
    }

    static mul(stat, value = 2) {
        return new Modifier(
            values =>
                values[stat] *= (values[value] ?? value),
            StringMaker.template`${stat} *= ${value}`,
            2, stat, value
        )
    }

    static div(stat, value = 2) {
        return new Modifier(
            values =>
                values[stat] /= (values[value] ?? value),
            StringMaker.template`${stat} /= ${value}`,
            2, stat, value
        )
    }

    static assign(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] = (values[value] ?? value),
            StringMaker.template`${stat} = ${value} (initial)`,
            0, stat, value
        )
    }

    static fix(stat, value = 1) {
        return new Modifier(
            values =>
                values[stat] = (values[value] ?? value),
            StringMaker.template`${stat} = ${value} (hard)`,
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
        this.involved = text.getInvolved()
    }
    
    apply(values) {
        return this.#modifier?.(values)
    }
    
    setSource(slot) {
        this.source = slot
    }
}
