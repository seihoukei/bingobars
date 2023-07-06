<script>
    import StringMaker from "utility/string-maker.js"
    import Trigger from "utility/trigger.js"
    import interactive from "utility/interactive.js"
    import hoverable from "utility/hoverable.js"

    export let game
    export let evaluate = false
    export let calculation

    $: values = game?.state?.values ?? {}
    $: met = evaluate && calculation?.check(values)

    $: variables = [...new Set(calculation.involved)]

    function explore(variable) {
        Trigger("command-explore-value", variable)
    }

</script>

<div class="calculation"
     class:evaluate
     class:met
     use:hoverable={{calculation}}
>
    {StringMaker.formatCalculation(calculation)}
</div>
{#if variables.length}
    <div class="variables">
        {#each variables as variable}
            <div class="variable"
                 use:interactive
                 on:basicaction={() => explore(variable)}
                 use:hoverable={{code:variable}}
            >
                    <span class="name">
                        {variable}
                    </span> = <span class="value">
                        {StringMaker.formatValueById(values[variable], variable)}
                    </span>
            </div>
        {/each}
    </div>
{/if}

<style>
    div.calculation {
        display : flex;
        align-items: center;
        justify-content: center;
        padding: 0.2em;
        border-radius: 1em;
        background-color: #222222;
    }

    div.calculation.evaluate {
        background-color: #442222;
    }

    div.calculation.evaluate.met {
        background-color: #224422;
    }

    div.variables {
        display: flex;
        flex-direction: row;
        justify-content: end;
        column-gap: 1rem;
        margin: -1rem 5rem 0;
    }

    div.variable {
        background-color: #222222;
        border-radius: 0 0 1rem 1rem;
        padding : 0 1rem;
        cursor : pointer;
    }
</style>
