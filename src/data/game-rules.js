import Calculation from "game-classes/calculation.js"

const GAME_RULES = Object.freeze({
    baseModifiers : [
        new Calculation("dAB *= A * B"),
        new Calculation("MABm += (AP + BP) / 10"),
        
        new Calculation("dAC *= A * C"),
        new Calculation("dBC *= B * C"),
        new Calculation("dABC *= AP * BP * CP"),
    ]
})

export default GAME_RULES
