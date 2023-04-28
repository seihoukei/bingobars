<script>
    import interactive from "utility/interactive.js"
    import UIMiniSlotDisplay from "components/ui/elements/UIMiniSlotDisplay.svelte"
    import TABLES from "data/tables.js"
    export let game
    export let id
    export let active = false

    $: ready = false
    $: visible = game?.state?.tables?.[`${id}_seen`] ?? false
    $: uiSlot = id?.toLowerCase?.() ?? "none"

    $: table = TABLES[id]
    $: slots = Object.entries(table?.slots ?? {})

</script>

<div class="container"
     class:visible
     class:ready
     class:active
     style="--ui-slot:{uiSlot}"
>
    {#if visible}
        <div class="data"
             use:interactive
             on:basicaction
             on:specialaction
        >
            <div class="id"> {id} </div>
            <div class="spacer"></div>
            <div class="table">
                {#each slots as [slotId, slot]}
                    <UIMiniSlotDisplay
                            value={game?.state?.tables?.[`${id}${slotId}`] ?? 0}
                            id={slotId}
                            {slot} />
                {/each}
            </div>
        </div>
        <div class="highlight"></div>
    {/if}
</div>

<style>
    div.container {
        grid-area: var(--ui-slot);
        border-radius: 1em;
        background-color: #222222;
        position: relative;
        transition: background-color 0.2s;
    }
    div.container.visible:not(.active):hover {
        cursor: pointer;
    }
    div.container.ready {
        background-color: #888866;
    }
    div.container.visible {
        background-color: #666666;
    }

    div.highlight {
        z-index: 3;
        pointer-events: none;
        position: absolute;
        left : 0;
        top : 0;
        width : 100%;
        height : 100%;
        background-color: #FFFFFF;
        opacity : 0;
        transition: opacity 0.2s;
        border-radius: 1em;
    }
    div.container.visible:not(.active):hover div.highlight {
        opacity: 0.2;
    }

    div.container.active div.highlight {
        opacity: 0.4;
    }

    div.data {
        z-index : 1;
        position: absolute;
        left : 0;
        top : 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    div.id {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
    }
    div.spacer {
        height: 1em;
    }
    div.table {
        display: grid;
        grid-auto-rows: 1em 1em 1em 1em 1em 1em;
        grid-auto-columns: 1em 1em 1em 1em 1em 1em 1em;
        grid-row-gap: 0.1em;
        grid-column-gap: 0.1em;
        width: 7.6em;
    }
</style>
