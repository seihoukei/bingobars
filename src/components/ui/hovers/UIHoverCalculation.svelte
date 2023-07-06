<script>
    import StringMaker from "utility/string-maker.js"
    import Codes from "game-classes/codes.js"

    export let game
    export let calculation

    $: values = game?.state?.values
    $: involved = calculation.involved ?? []
    $: involvedValues = involved.map(x => [x, values[x]])

</script>

<div class="content">
    <div>Calculation: {calculation.shortText}</div>
    <div class="spacer"></div>
    <div>Description:</div>
    <div>{StringMaker.formatCalculation(calculation)}</div>
    {#if involved.length}
        <div class="spacer"></div>
        {#each involvedValues as [element, value]}
            <div>{element}: {Codes.get(element).description} = {StringMaker.formatValueById(value, element)}</div>
        {/each}
    {/if}
</div>

<style>
    div.content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    div.content div {
        white-space: nowrap;
    }

    div.content div.spacer {
        height: 0.5em;
    }
</style>
