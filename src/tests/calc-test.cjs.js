import Calculation from "../utility/calculation.js"

const values = {a:1, b:2, c:3}
const c = new Calculation("c == a + b")
console.log(c, c.check(values), values)
