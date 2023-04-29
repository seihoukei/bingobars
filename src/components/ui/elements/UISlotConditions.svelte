<script>
    export let conditions = []
    export let game
    export let debug = false
</script>


{#if !debug}<div class="title">Conditions:</div>{/if}
{#each conditions as condition}
    <div class="item">
        {debug?"C: ":""}{condition.shortText}
    </div>
{:else}
    <div class="item">
        Unconditional
    </div>
{/each}
