<script>
    import registerTrigger from "utility/register-trigger.js"
    import SUPER_BINGO from "data/super-bingo.js"
    import Trigger from "utility/trigger.js"

    export let state
    export let bingo = getCleanBingo()

    registerTrigger("command-allocate-bingo-points", allocatePoints)
    registerTrigger("command-toggle-bingo-line", toggleLine)
    registerTrigger("command-toggle-bingo-lines", toggleLines)

    $: values = state?.values ?? {}
    $: bingoins = values.bingoins ?? 0
    $: availableBingoins = bingoins - bingo.cost

    function getCleanBingo() {
        const bingo = {
            field: [
                [0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0,],
                [0, 0, 1e6, 0, 0,],
                [0, 0, 0, 0, 0,],
                [0, 0, 0, 0, 0,],
            ],
            cost : 0,
            levels : Object.fromEntries(Object.keys(SUPER_BINGO.lines).map(x => [x, 0])),
            active : Object.fromEntries(Object.keys(SUPER_BINGO.lines).map(x => [x, true])),
        }
        return bingo
    }

    function updateCost() {
        let cost = bingo.field.reduce(
            (cost, line, y) => cost + line.reduce(
                (cost, value, x) => cost + value * SUPER_BINGO.costs[y][x]
            , 0)
        , 0)
        bingo.cost = cost
    }

    function updateLevels() {
        for (let [id, data] of Object.entries(SUPER_BINGO.lines)) {
            bingo.levels[id] = Math.min(...data.cells.map(([x,y]) => bingo.field[y][x]))
        }
    }

    function allocatePoints(x, y, change) {
        if (SUPER_BINGO.costs[y]?.[x] === undefined || x === 2 && y === 2)
            return

        const cost = SUPER_BINGO.costs[y][x]

        if (change < 0) {
            change = Math.max(change, -bingo.field[y][x])
        } else if (change > 0) {
            change = Math.min(change, Math.floor(availableBingoins / cost))
        }

        if (change === 0)
            return

        bingo.field[y][x] += change

        updateCost()
        updateLevels()

        Trigger("bingo-updated", bingo)
    }

    function toggleLine(id, forceValue = null, batch = false) {
        bingo.active ??= {}
        bingo.active[id] = forceValue ?? !bingo.active[id]

        if (!batch)
            Trigger("bingo-updated")
    }

    function toggleLines(list) {
        for (const [item, value] of list)
            toggleLine(item, value, true)
        Trigger("bingo-updated")
    }
</script>