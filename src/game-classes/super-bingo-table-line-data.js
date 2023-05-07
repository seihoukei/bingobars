import Calculation from "game-classes/calculation.js"

export default class SuperBingoTableLineData {
    constructor(id, cells, position) {
        this.id = id
        this.cells = cells
        this.position = position
    }
    
    setModifier(data) {
        this.effect = data.replace(/~/g, this.id)
        this.modifier = new Calculation(this.effect, Calculation.PRIORITIES.SUPER)
        this.modifier.setSource(this.id)
    
        return this
    }
}
