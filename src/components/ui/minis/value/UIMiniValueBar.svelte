<script>
    import BASE_VALUES from "data/base-values.js"

    export let id
    export let game

    $: values = game?.state?.values ?? {}
    $: codes = BASE_VALUES[id]?.codes ?? {}

    $: current = values[codes.X]
    $: max = values[codes.MX]

    $: colors = BASE_VALUES[id].colors

    $: progress = (100 * current / max).toFixed(2)
    $: cssVariables = `--progress:${progress}%;--bar-color:${colors.dark}`

</script>

<div class="bar" style={cssVariables}>
    <div class="fg"></div>
</div>

<style>
    div.bar {
        position: absolute;
        left : 0;
        top : 0;
        bottom : 0;
        right : 0;

        z-index : 0;
    }

    div.fg {
        position: absolute;
        left : 0;
        bottom : 0;
        right : 0;

        background-color: var(--bar-color);
        height: var(--progress);
    }

</style>
