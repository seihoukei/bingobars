import {create, all} from 'mathjs'

const config = { }
const math = create(all, config)

export default class Calculation {
    constructor(expression, priority = 0) {
        this.expression = expression
        this.processedExpression = this.expression
            .replace(/^(\S*?) ([+\-/*])= (.*)/, "$1 = $1 $2 ($3)")
        this.parsed = math.parse(this.processedExpression)
        this.compiled = this.parsed.compile()
        this.priority = priority
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


}