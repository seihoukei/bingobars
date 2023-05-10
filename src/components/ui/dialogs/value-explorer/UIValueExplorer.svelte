<script>
    import StringMaker from "utility/string-maker.js"

    import {fade, fly} from "svelte/transition"
    import interactive from "utility/interactive.js"
    import UIValueModifiers from "components/ui/dialogs/value-explorer/elements/UIValueModifiers.svelte"
    import UIValueResets from "components/ui/dialogs/value-explorer/elements/UIValueResets.svelte"
    import UIValueHistory from "components/ui/dialogs/value-explorer/elements/UIValueHistory.svelte"
    import Codes from "game-classes/codes.js"

    const PAGES = {
        "Modifiers" : UIValueModifiers,
        "History" : UIValueHistory,
        "Resets" : UIValueResets,
    }

    export let game
    export let id = null

    let holder

    let pages = []
    let currentPage = "stats"

    $: values = game?.state?.values ?? {}
    $: code = Codes.get(id) ?? {}

    $: initialValue = code.initialValue
    $: derived = code.derived

    $: finalValue = values[id]

    $: color = code.baseValue?.colors?.["dark"] ?? "inherit"
    $: cssVariables = `--background: ${color};`

    $: resettable = code.type === Codes.TYPES.VALUE && !derived

    $: setPages(id)

    function clickOutside(event) {
        if (event.target === holder)
            close()
    }

    function close() {
        Trigger("command-close-explorer", id)
    }

    function contextClose(event) {
        event.preventDefault()
        close()
    }

    function setPages(id) {
        pages = []
        if (derived)
            pages.push("Modifiers")
        pages.push("History")
        if (resettable)
            pages.push("Resets")
        currentPage = pages[0]
    }

    function setPage(page) {
        currentPage = page
    }

</script>

{#if id}
    <div class="holder"
         bind:this={holder}
         style={cssVariables}
         on:click={clickOutside}
         on:contextmenu={contextClose}
         transition:fade={{duration:200}}
    >
        <div class="dialog" transition:fly={{y:100,duration:200}}>
            <div class="title">
                <div class="id">{id}</div>
                <div class="description">{code.description ?? "Unknown"}</div>
                <div class="close"
                     use:interactive
                     on:basicaction={close}>X</div>
            </div>
            <div class="values">
                {#if derived}
                    <div class="value">
                        <span class="name">Initial value</span> = <span class="value">{StringMaker.formatValueById(initialValue, id)}</span>
                    </div>
                    <div class="value">
                        <span class="name">Effective value</span> = <span class="value">{StringMaker.formatValueById(finalValue, id)}</span>
                    </div>
                {:else}
                    <div class="value">
                        <span class="name">Current value</span> = <span class="value">{StringMaker.formatValueById(finalValue, id)}</span>
                    </div>
                {/if}
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
