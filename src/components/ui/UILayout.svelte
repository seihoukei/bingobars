<script>
    import UIValueExplorer from "components/ui/dialogs/UIValueExplorer.svelte"
    import UIMaxiHeader from "components/ui/maxis/elements/UIMaxiHeader.svelte"

    import Trigger from "utility/trigger.js"
    import UI_TABS from "data/ui-tabs.js"

    export let game

    let id

    $: id = game.id
    $: tabId = game?.state?.tab ?? 0
    $: tab = UI_TABS[tabId]

    let windowWidth = 100
    let windowHeight = 100

    function setTab(target) {
        Trigger("command-set-tab", target)
    }

</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

{#if game}
    {#key id}
        <div class="holder">
            <div class="layout">
                <div class="main">
                    <div class="element">
                        <UIMaxiHeader {game} />
                    </div>
                    <div class="element">
                        {#key tabId}
                            <svelte:component {game}
                                this={tab.maxi}
                                id={tab.id}
                            />
                        {/key}
                    </div>
                    <!--70x50em-->
                </div>

                {#each UI_TABS as tabInfo, i}
                    {#if tabInfo.mini}
                        <svelte:component {game}
                            this={tabInfo.mini}
                            id={tabInfo.id}
                            active={tabId === i}
                            on:basicaction={() => setTab(i)}
                        />
                    {/if}
                {/each}
            </div>
        </div>
        <UIValueExplorer {game} />
    {/key}
{/if}

<style>
    div.holder {
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    div.layout {
        display : grid;
        grid-template-areas:
            "a b c ab ac bc t5 t4 t3 t2 t1"
            "abc main main main main main main main main main main"
            "code main main main main main main main main main main"
            "help main main main main main main main main main main"
            "menu main main main main main main main main main main";
        font-size : min(0.98vw, 1.13vh);
        grid-auto-columns: 8em;
        grid-auto-rows: 16em;
        grid-column-gap: 1em;
        grid-row-gap: 1em;
    }

    div.main {
        font-size: 1.2em;
        border-radius : 1em;
    }


    @media (min-aspect-ratio: 17/14) {
        div.layout {
            grid-template-areas:
                "a ab t1 main main main main main main main main main main main main"
                "b ac t2 main main main main main main main main main main main main"
                "c bc t3 main main main main main main main main main main main main"
                "code abc t4 main main main main main main main main main main main main"
                "menu help t5 main main main main main main main main main main main main";
            font-size: min(0.72vw, 1.15vh);
            grid-auto-columns: 8em;
            grid-auto-rows: 16em;
            grid-column-gap: 1em;
            grid-row-gap: 1em;
        }
        div.main {
            font-size: 1.5em;
        }
    }

    @media (max-aspect-ratio: 7/8) {
        div.layout {
            grid-template-areas:
                "main main main main main main main main"
                "main main main main main main main main"
                "main main main main main main main main"
                "main main main main main main main main"
                "a b c ab ac bc abc menu"
                "t1 t2 t3 t4 t5 code help menu";
            font-size: min(1.38vw, 0.98vh);
            grid-auto-columns: 8em;
            grid-auto-rows: 16em;
            grid-column-gap: 1em;
            grid-row-gap: 1em;
        }

        div.main {
            font-size: 1em;
        }
    }

    div.main {
        grid-area : main;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
        row-gap: 0.5em;
    }

    div.element {
        display : flex;
        align-items: center;
        justify-content: center;
        background-color: #666666;
        overflow: hidden;
        border-radius: 1em;
    }

    div.element:last-child {
        flex: 1;
    }
</style>
