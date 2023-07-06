<script>
    export let game
    export let id
</script>

<div class="help">
    Fulfil conditions to unlock cells!
    Unlock cells to manipulate variables!
    Manipulate variables to fulfil conditions!
    FUN!

    Cells with locks show conditions, tap or click for details!
    Green cells are ready to be unlocked with a tap or click!
    Click or tap unlocked cell to toggle its effect!
    Right-click/long-tap unlocked cell to see its details!
    CLICKY!

    You can long-tap/right-click value tab to prestige!
    You can long-tap/right-click variables to inspect them!
    You have a chance to do something while catching up with offline time!
    COMFY!

    Resetting value allows to fulfil some conditions, and has no other benefits!
    You can restore game state before last value reset if you made a mistake!
    Try to achieve several simple conditions in one reset to progress faster!
    TRICKY!

    Use Bingoins from unlocked cells in SUPER BINGO for more boosts!
    Lowest level cell in a line defines line's level!
    Check Super Bingo for new line effects when you discover a new variable!
    SHINY!

    Libraries/frameworks used:
    ViteJS (MIT), Svelte (MIT), math.js (Apache-2.0 license), lz-string (MIT), toposort (MIT)
    THANKY!
</div>

<style>
    div.help {
        position: absolute;
        left : 1rem;
        top : 1rem;
        right : 1rem;
        bottom : 1rem;

        font-size: 2em;
        padding : 2em;
        white-space: pre-line;
        overflow: auto;
    }
</style>
