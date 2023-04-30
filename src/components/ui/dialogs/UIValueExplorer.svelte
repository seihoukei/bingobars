<script>
    import {onDestroy, onMount} from "svelte"
    import Trigger from "utility/trigger.js"
    import VALUES from "data/values"
    import UIExplorerModifier from "components/ui/dialogs/elements/UIExplorerModifier.svelte"
    import StringMaker from "utility/string-maker.js"
    import FG_COLORS from "data/fg-colors.js"

    export let game


    let id = null
    let holder

    let modifiers = []

    $: values = game?.state?.values ?? {}
    $: valueModifiers = modifiers.filter(x => x.target === id)
    $: baseValue = values[`${id}_base`]
    $: finalValue = values[id]
    $: color = FG_COLORS[VALUES[id]?.baseValue] ?? "inherit"
    $: cssVariables = `--background: ${color};`

    function exploreValue(value) {
        id = value
    }

    function updateModifiers(active, available) {
        modifiers = available
    }

    function clickOutside(event) {
        if (event.target === holder)
            close()
    }

    function close() {
        exploreValue(null)
    }

    const triggers = []
    onMount(() => {
        triggers.push(Trigger.on("command-explore-value", exploreValue))
        triggers.push(Trigger.on("modifier-lists-updated", updateModifiers))
        Trigger("command-update-modifiers")
    })

    onDestroy(() => {
        triggers.forEach(trigger => trigger.cancel())
    })


</script>

{#if id}
    <div class="holder" bind:this={holder} style={cssVariables} on:click={clickOutside}>
        <div class="dialog">
            <div class="title">
                <div class="id">{id}</div>
                <div class="description">{VALUES[id]?.description ?? "Unknown"}</div>
                <div class="close" on:click={close}>X</div>
            </div>
            <div class="values">
                <div class="value">
                    <span class="name">Base value</span> = <span class="value">{StringMaker.formatValueById(baseValue, id)}</span>
                </div>
                <div class="value">
                    <span class="name">Final value</span> = <span class="value">{StringMaker.formatValueById(finalValue, id)}</span>
                </div>
            </div>
            <div class="subtitle">Modifiers:</div>
            <div class="modifiers">
                {#each valueModifiers as modifier}
                    <UIExplorerModifier {game} {modifier} />
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    div.holder {
        position: absolute;
        left: 0;
        top : 0;
        width : 100vw;
        height : 100vh;
        background-color: #000000AA;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index : 10;
    }

    div.title {
        display: flex;
        align-items: center;
        column-gap: 1em;
    }

    div.subtitle {
        margin: 0.4em 0;
    }

    div.id {
        background: var(--background);
        font-size: 2em;
        padding : 0 0.3em;
        border-radius: 0.5em;
    }

    div.close {
        margin-left: auto;
        font-size: 2em;
        background-color: #222222;
        width : 1.2em;
        height : 1.2em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.2em;
    }

    div.close:hover {
        background-color: #333333;
    }

    div.dialog {
        background-color: #555555;
        font-size: 3vmin;
        width : 75vmin;
        height : 75vmin;
        border-radius: 1vmin;
        padding : 5vmin;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
    }

    div.modifiers {
        display: flex;
        flex-direction: column;
        row-gap: 0.5em;
        overflow : auto;
    }

    div.values {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin: 0.4em 0 0;
    }

</style>