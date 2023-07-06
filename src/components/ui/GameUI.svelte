<script>
    import UILayout from "components/ui/UILayout.svelte"

    export let game
</script>

{#if game?.state}
    <UILayout {game} />
{/if}
