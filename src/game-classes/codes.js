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
    
    static getCode(code, type = Codes.TYPES.ANY) {
        const data = this.#codes[code]
        
        if (type === Codes.TYPES.ANY || data.type === type)
            return data
        
        return null
    }
    
    static getCodes() {return this.#codes}
    
    static getSlot(code) {
        return this.getCode(code, Codes.TYPES.SLOT)
    }
    
    static getValue(code) {
        return this.getCode(code, Codes.TYPES.VALUE)
    }
}
