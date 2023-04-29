<script>
    import StringMaker from "utility/string-maker.js"
    import interactive from "utility/interactive.js"
    import Trigger from "utility/trigger.js"

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
        min-width: 10em;
        height : 5.5em;
        row-gap: 0.5em;
        overflow: hidden;

        transition: background-color 0.2s;
    }
    .button.active {
        background-color: var(--value-color);
        cursor : pointer;
    }
    .description {
        font-size : 0.8em;
    }
    .value {
        font-size: 1.2em;
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
