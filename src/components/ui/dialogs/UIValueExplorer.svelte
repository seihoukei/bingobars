<script>
    import {onDestroy, onMount} from "svelte"
    import Trigger from "utility/trigger.js"
    import VALUES from "data/values"
    import FG_COLORS from "data/fg-colors.js"
    import UIExplorerModifiers from "components/ui/dialogs/elements/UIExplorerModifiers.svelte"
    import StringMaker from "utility/string-maker.js"
    import BASE_VALUES from "data/base-values.js"
    import UIExplorerHistory from "components/ui/dialogs/elements/UIExplorerHistory.svelte"
    import UIExplorerResets from "components/ui/dialogs/elements/UIExplorerResets.svelte"

    export let game

    const PAGES = {
        "Modifiers" : UIExplorerModifiers,
        "History" : UIExplorerHistory,
        "Resets" : UIExplorerResets,
    }

    let id = null
    let holder

    let pages = []
    let currentPage = "stats"

    $: values = game?.state?.values ?? {}
    $: baseValue = values[`${id}_base`]
    $: finalValue = values[id]

    $: color = FG_COLORS[VALUES[id]?.baseValue] ?? "inherit"
    $: cssVariables = `--background: ${color};`

    $: derived = baseValue !== undefined

    $: setPages(id)

    function exploreValue(value) {
        id = value
    }

    function clickOutside(event) {
        if (event.target === holder)
            close()
    }

    function close() {
        exploreValue(null)
    }

    function setPages(id) {
        pages = []
        if (derived)
            pages.push("Modifiers")
        pages.push("History")
        if (BASE_VALUES[id])
        pages.push("Resets")
        currentPage = pages[0]
    }

    function setPage(page) {
        currentPage = page
    }

    const triggers = []
    onMount(() => {
        triggers.push(Trigger.on("command-explore-value", exploreValue))
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
            <div class="pages">
                {#each pages as page}
                    <div class="page"
                         class:active={page === currentPage}
                         on:click={() => setPage(page)}
                    >
                        {page}
                    </div>
                {/each}
            </div>
            <svelte:component this={PAGES[currentPage]} {game} {id} />
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

    div.values {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin: 0.4em 0 0;
    }

    div.pages {
        margin: 0.4em 0;
        display : flex;
        align-items: center;
        justify-content: center;
        column-gap: 1em;
    }

    div.page {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.2em 1em;
        background-color: #222222;
        border-radius: 0.5em;
        cursor: pointer;
    }

    div.page:hover {
        background-color: #333333;
    }

    div.page.active {
        cursor: default;
        border: 0.1em solid #888888;
        padding: 0.1em 0.9em;
    }

</style>