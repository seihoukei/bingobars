<script>
    export let conditions = []
    export let game
</script>


<div class="title">Conditions:</div>
{#each conditions as condition}
    <div class="item">
        {condition.text}
    </div>
{:else}
    <div class="item">
        Unconditional
    </div>
{/each}
