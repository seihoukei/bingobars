<script>
    import StringMaker from "utility/string-maker.js"

    export let game
    export let code

    $: value = game?.state?.values?.[code.code]
    $: valueTitle = code?.description ?? code?.shortDescription ?? "unknown"
    $: derived = code?.derived

</script>

<div class="content">
    <div>{code.code}: {valueTitle}</div>
    <div class="spacer"></div>
    <div>Current value: {StringMaker.formatValueById(value, code.code)} </div>
</div>

<style>
    div.content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    div.content div {
        white-space: nowrap;
    }

    div.content div.spacer {
        height: 0.5em;
    }
</style>
