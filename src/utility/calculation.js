import {create, all} from 'mathjs/number'
import toposort from "toposort"

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
        SUPER : 6,
        CHECK : 7,
        STEP : 10,
    }

    static sortList(list) {
        const edges = []
        for (let entry of list) {
            for (let source of entry.involved) {
                if (source !== entry.target)
                    edges.push([source,entry.target])
            }
        }

        const sortedTargets = toposort(edges)
        const targetPriorities = {}
        sortedTargets.forEach((item, index) => targetPriorities[item] = index * this.PRIORITIES.STEP)

        const priorities = new Map(
            list.map(entry => [entry, (targetPriorities[entry.target] ?? 0) + (entry.priority ?? 0)])
        )
        list.sort((x,y) => priorities.get(x) - priorities.get(y))
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

Calculation.sortList([
    new Calculation("A += 1"),
    new Calculation("A *= C"),
    new Calculation("B += 1"),
    new Calculation("C *= B")
])