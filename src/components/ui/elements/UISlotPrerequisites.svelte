<script>
    export let prerequisites = []
    export let game

</script>

<div class="title">Requires:</div>
{#each prerequisites as prerequisite}
    <div class="item">
        {prerequisite}
    </div>
{/each}
