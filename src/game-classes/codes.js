export default class Codes {
    static TYPES = {
        ANY : 0,
        SLOT : 1,
        VALUE : 2,
        COUNTER : 3,
        VARIABLE : 4,
    }
    static #codes = {}
    
    static registerCode(code, data) {
        this.#codes[code] = data
    }
    
    static get(code, type = Codes.TYPES.ANY) {
        const data = this.#codes[code]
        
        if (type === Codes.TYPES.ANY || data.type === type)
            return data
        
        return null
    }
    
    static getCodes() {return this.#codes}
    
    static getSlot(code) {
        return this.get(code, Codes.TYPES.SLOT)
    }
    
    static getValue(code) {
        return this.get(code, Codes.TYPES.VALUE)
    }
}
