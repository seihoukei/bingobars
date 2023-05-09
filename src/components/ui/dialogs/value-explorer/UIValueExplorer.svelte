<script>
    import StringMaker from "utility/string-maker.js"
    import VALUES from "data/values"
    import FG_COLORS from "data/fg-colors.js"

    import interactive from "utility/interactive.js"
    import getValuesCodes from "data/get-values-codes.js"
    import registerTrigger from "utility/register-trigger.js"
    import UIValueModifiers from "components/ui/dialogs/value-explorer/elements/UIValueModifiers.svelte"
    import UIValueResets from "components/ui/dialogs/value-explorer/elements/UIValueResets.svelte"
    import UIValueHistory from "components/ui/dialogs/value-explorer/elements/UIValueHistory.svelte"

    const PAGES = {
        "Modifiers" : UIValueModifiers,
        "History" : UIValueHistory,
        "Resets" : UIValueResets,
    }

    export let game

    registerTrigger("command-explore-value", exploreValue)

    let id = null
    let holder
    let openHistory = false

    let pages = []
    let currentPage = "stats"

    $: values = game?.state?.values ?? {}
    $: initialValue = values[`${id}_base`]
    $: finalValue = values[id]

    $: color = FG_COLORS[VALUES[id]?.baseValue] ?? "inherit"
    $: cssVariables = `--background: ${color};`

    $: baseValue = VALUES[id]?.baseValue
    $: derived = initialValue !== undefined
    $: resettable = getResettable(id)

    $: setPages(id)

    function getResettable(id) {
        if (!baseValue)
            return false
        const codes = getValuesCodes(baseValue)
        return [codes.X, codes.XP, codes.MX, codes.Xt].includes(id)
    }

    function exploreValue(value, forceHistory = false) {
        openHistory = forceHistory
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
        if (resettable)
            pages.push("Resets")
        currentPage = openHistory
            ? "History"
            : pages[0]
    }

    function setPage(page) {
        currentPage = page
    }

</script>

{#if id}
    <div class="holder" bind:this={holder} style={cssVariables} on:click={clickOutside}>
        <div class="dialog">
            <div class="title">
                <div class="id">{id}</div>
                <div class="description">{VALUES[id]?.description ?? "Unknown"}</div>
                <div class="close"
                     use:interactive
                     on:basicaction={close}>X</div>
            </div>
            <div class="values">
                <div class="value">
                    <span class="name">Base value</span> = <span class="value">{StringMaker.formatValueById(initialValue, id)}</span>
                </div>
                <div class="value">
                    <span class="name">Final value</span> = <span class="value">{StringMaker.formatValueById(finalValue, id)}</span>
                </div>
            </div>
            <div class="pages">
                {#each pages as page}
                    <div class="page"
                         class:active={page === currentPage}
                         use:interactive
                         on:basicaction={() => setPage(page)}
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

    div.dialog {
        background-color: #555555;
        font-size: 3vmin;
        position: absolute;
        top : 10vmin;
        right : 10vmin;
        left : 10vmin;
        bottom : 10vmin;

        border-radius: 1vmin;
        padding : 5vmin;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
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