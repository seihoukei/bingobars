<script>
    export let modifiers = []
    export let game
    export let debug = false
</script>

{#if !debug}<div class="title">Modifiers:</div>{/if}
{#each modifiers as modifier}
    <div class="item">
        {debug?"M: ":""}{modifier.shortText}
    </div>
{/each}
