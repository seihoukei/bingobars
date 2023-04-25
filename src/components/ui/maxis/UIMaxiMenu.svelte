<script>
    import Trigger from "utility/trigger.js"

    export let game
    export let id
</script>

<button on:click={() => confirm("Reset game?") && Trigger("command-reset-game")}>Reset game</button>

<style>
    button {
        font-size : 4em;
        padding : 0.5em;
        border-radius: 0.5em;
        background-color: #000077;
        cursor : pointer;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #222277;

    }
</style>
