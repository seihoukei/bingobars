<script>
    export let description
    export let formula
    export let active = false
</script>

<div class="container" class:active>
    <div class="description">
        {description}
    </div>
    <div class="formula">
        {formula}
    </div>
</div>

<style>
    .container {
        background-color: #555555;
        border-radius: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        width : 100%;
        height : 100%;

        transition: background-color 0.2s;
    }

    .container.active {
        background-color: #777777;
    }
    .description {
        font-size : 0.8em;
    }
    .formula {
        font-size: 1.2em;
    }
</style>
