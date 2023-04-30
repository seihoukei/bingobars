import Calculation from "utility/calculation.js"

const GAME_RULES = Object.freeze({
    baseModifiers : [
        new Calculation("dAB *= A * B"),
        new Calculation("dAC *= A * C"),
        new Calculation("dBC *= B * C"),
        new Calculation("dABC *= AP * BP * CP"),
    ]
})

export default GAME_RULES