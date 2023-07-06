<script>
    import Trigger from "utility/trigger.js"
    import UI_TABS from "data/ui-tabs.js"
    import UIMaxiHeader from "components/ui/maxis/UIMaxiHeader.svelte"
    import UIValueExplorer from "components/ui/dialogs/value-explorer/UIValueExplorer.svelte"
    import UISlotExplorer from "components/ui/dialogs/slot-explorer/UISlotExplorer.svelte"
    import registerTrigger from "utility/register-trigger.js"
    import {onDestroy, onMount} from "svelte"
    import UIHover from "components/ui/UIHover.svelte"

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

    let explorations = []

    registerTrigger("command-explore-value", exploreValue)
    registerTrigger("command-explore-slot", exploreSlot)
    registerTrigger("command-close-explorer", closeExplorer)

    function exploreValue(value) {
        history.pushState(value, `Explore value ${value}`)
        explorations.push({
            type : UIValueExplorer,
            id : value,
        })
    }

    function exploreSlot(slot) {
        history.pushState(slot, `Explore slot ${slot}`)
        explorations.push({
            type : UISlotExplorer,
            id : slot,
        })
    }


    function closeExplorer() {
        explorations.pop()
    }

    onMount(() => {
        addEventListener("popstate", closeExplorer)
    })

    onDestroy(() => {
        removeEventListener("popstate", closeExplorer)
    })

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
        {#each explorations as exploration}
            <svelte:component {game}
                              this={exploration.type}
                              id={exploration.id}
            />
        {/each}
        <UIHover {game} />
    {/key}
{/if}

<style>
    div.holder {
        position: absolute;
        left: 1rem;
        top: 1rem;
        right : 1rem;
        bottom : 1rem;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    div.layout {
        height : 100%;
        width: 100%;
        display : grid;
        grid-template-areas:
            "main main main main main main main main main main menu"
            "main main main main main main main main main main code"
            "main main main main main main main main main main help"
            "main main main main main main main main main main t1"
            "a b c ab ac bc abc t5 t4 t3 t2";
        font-size : min(0.98vw, 1.13vh);
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
        grid-column-gap: 1rem;
        grid-row-gap: 1rem;
    }

    div.main {
        grid-area : main;

        font-size: 1.2em;
        border-radius : 1em;

        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;

        row-gap: 1rem;
    }


    @media (min-aspect-ratio: 17/14) {
        div.layout {
            grid-template-areas:
                "a ab t1 main"
                "b ac t2 main"
                "c bc t3 main"
                "code abc t4 main"
                "menu help t5 main";
            font-size: min(0.72vw, 1.15vh);
            grid-template-columns: 10rem 10rem 10rem 1fr;
            grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
        }

        div.main {
            font-size: 1.5em;
        }
    }

    @media (max-aspect-ratio: 5/8) {
        div.layout {
            grid-template-areas:
                "main main main main main main main main"
                "a b c ab ac bc abc menu"
                "t1 t2 t3 t4 t5 code help menu";
            font-size: min(1.38vw, 0.98vh);
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr 25rem 25rem;
        }

        div.main {
            font-size: 1em;
        }
    }

    div.element {
        position: relative;
        display : flex;
        align-items: center;
        justify-content: center;
        background-color: #666666;
        overflow: hidden;
        border-radius: 1rem;
    }

    div.element:last-child {
        flex: 1;
    }
</style>
