<script>
    import VALUES from "data/values.js"
    import StringMaker from "utility/StringMaker.js"

    export let id
    export let game

    $: values = game?.state?.values ?? {}
    $: value = values[id]
    $: description = VALUES[id].description
</script>

<div class="container">
    <div class="value">
        <span class="name">
            {id}
        </span>
        =
        <span class="value">
            {StringMaker.formatValueById(value, id)}
        </span>
    </div>
    <div class="description">
        {VALUES[id].description}
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width : 10em;
        background-color: #444444;
        border-radius: 0.5em;
    }
    div.value {
        font-size : 1.2em;
    }
    div.description {
        font-size : 0.8em;
    }

</style>