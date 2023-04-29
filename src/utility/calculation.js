import {create, all, re} from 'mathjs'

const config = { }
const math = create(all, config)

export default class Calculation {
    static PRIORITIES = {
        AUTO : 0,
        INIT : 1,
        ADD : 2,
        MUL : 3,
        BONUS : 4,
        FIX : 5,
        CHECK : 6,
    }
    source = null
    hidden = false

    constructor(expression, priority = Calculation.PRIORITIES.AUTO) {
        this.expression = expression
        this.processedExpression = this.expression
            .replace(/^(\S*?) ([+\-/*])= (.*)/, "$1 = $1 $2 ($3)")
        this.parsed = math.parse(this.processedExpression)
        this.priority = priority
        this.compiled = this.parsed.compile()
        this.parse()
    }

    parse() {
        this.assignment = math.isAssignmentNode(this.parsed)
        this.shortText = this.expression
        this.involved = []
        if (this.assignment) {
            this.target = this.parsed.object.name
        } else {
            this.shortText = this.shortText.replace("==", "=")
        }
        this.parsed.traverse(node => {
            if (math.isSymbolNode(node) && !this.involved.includes(node.name))
                this.involved.push(node.name)
        })
        if (this.priority === Calculation.PRIORITIES.AUTO){
            this.priority = this.#getAutoPriority()
        }
    }

    #getAutoPriority() {
        if (!this.assignment) {
            return Calculation.PRIORITIES.CHECK
        }
        if (math.isOperatorNode(this.parsed.value)) {
            const operator = this.parsed.value.op
            return {
                "*" : Calculation.PRIORITIES.MUL,
                "/" : Calculation.PRIORITIES.MUL,
                "+" : Calculation.PRIORITIES.ADD,
                "-" : Calculation.PRIORITIES.ADD,
            }[operator]
        }
        if (math.isSymbolNode(this.parsed.value) || math.isConstantNode(this.parsed.value)) {
            return Calculation.PRIORITIES.FIX
        }
        //console.log(this.parsed)
//        if (math.isFunctionNode(this.parsed.value)
    }

    check(context) {
        if (this.assignment)
            throw new Error("Not a condition")
        return this.compiled.evaluate(context)
    }

    apply(context) {
        if (!this.assignment)
            throw new Error("Not a modifier")
        return this.compiled.evaluate(context)
    }

    evaluate(context) {
        return this.compiled.evaluate(context)
    }

    setSource(source) {
        this.source = source
    }

    setHidden(hidden) {
        this.hidden = hidden
    }
}