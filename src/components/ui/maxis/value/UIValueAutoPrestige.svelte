<script>
    import StringMaker from "utility/string-maker"
    import interactive from "utility/interactive"
    import Trigger from "utility/trigger"

    export let id
    export let canAuto
    export let auto

    function toggle() {
        Trigger("command-toggle-auto-prestige", id)
    }
</script>

<div class="button" class:active={canAuto} use:interactive on:basicaction={toggle}>
    {#if canAuto}
        <div class="description">Auto prestige {id}</div>
        <div class="value">{StringMaker.formatValue(auto, {type: StringMaker.VALUE_FORMATS.ONOFF})}</div>
        <div class="highlight"></div>
    {/if}
</div>

<style>
    .button {
        position: relative;
        background-color: #555555;
        border-radius: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width : 100%;
        height : 100%;
        row-gap: 0.3em;
        overflow: hidden;

        transition: background-color 0.2s;
    }
    .button.active {
        background-color: var(--value-color);
        cursor : pointer;
    }
    .description {
        font-size : 1em;
    }
    .value {
        font-size: 1.5em;
    }
    div.highlight {
        z-index: 3;
        pointer-events: none;
        position: absolute;
        left : 0;
        top : 0;
        width : 100%;
        height : 100%;
        background-color: #FFFFFF;
        opacity : 0;
        transition: opacity 0.2s;
    }

    div.button.active:hover div.highlight {
        opacity: 0.2;
    }
</style>
