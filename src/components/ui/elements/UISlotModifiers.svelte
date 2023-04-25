<script>
    export let modifiers = []
    export let game
</script>

<div class="title">Modifiers:</div>
{#each modifiers as modifier}
    <div class="item">
        {modifier.text}
    </div>
{/each}
