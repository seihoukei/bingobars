<script>
    import Calculation from "game-classes/calculation.js"
    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"
    import UIPrestigeCalculator from "components/ui/maxis/calculator/UIPrestigeCalculator.svelte"

    export let game
    export let id

    let expression = game?.state?.lastExpression ?? ""
    let error = null

    $: values = game?.state?.values ?? {}
    $: sandbox = Object.assign({
        seihoukei : "[●'◡'●]"
    }, values)

    $: calculation = tryCreateCalculation(expression)
    $: description = calculation ? StringMaker.formatCalculation(calculation) : ""

    function tryCreateCalculation(expression) {
        try {
            error = null
            calculation = new Calculation(expression)
            return calculation
        } catch(e) {
            error = e
            return null
        }
    }

    $: result = tryCalculate(calculation, sandbox) ?? "- ERROR -"

    function tryCalculate(calculation, sandbox) {
        if (!calculation) return
        try {
            const result = calculation.evaluate(sandbox)

            if (expression !== game?.state?.lastExpression)
                Trigger("command-update-expression", expression)

            try {
                return StringMaker.formatValue(result, {type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC})
            } catch(e) {
                return result
            }

        } catch (e) {
            error = e
            return null
        }
    }

</script>

<div class="content">
    <div class="title">Expression:</div>
    <input bind:value={expression} placeholder="Type expression here"/>
    <div class="description">{error ?? description}</div>
    <div class="result">{result}</div>

    <div class="title">Auto prestige estimates:</div>
    <UIPrestigeCalculator {game} />
</div>

<style>
    div.content {
        position: absolute;
        left: 1rem;
        top : 1rem;
        right : 1rem;
        bottom: 1rem;

        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        row-gap: 1rem;

        font-size: 4em;
    }

    input {
        font-size: 1em;
        background-color: #222222;
        color:#CCCCCC;
        border-radius: 0.2em;
        border: none;
        text-align: center;
    }

    div.content div {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    div.description {
        font-size: 0.5em;
        height: 3em;
        margin: -0.25em;
    }

    div.result {
        background-color: #333333;
        border-radius: 1rem;
    }
</style>
