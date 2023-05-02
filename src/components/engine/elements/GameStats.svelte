<script>
    import getValuesCodes from "data/get-values-codes.js"
    import registerTrigger from "utility/register-trigger.js"

    export let state
    export let stats = {
        reset : {},
        secondly : [],
        minutely : [],
        hourly : [],
        last : {
            secondly : {},
            minutely : {},
            hourly : {},
        },
        unlocks : {},
    }

    registerTrigger("stats-value-reset", storeReset)
    registerTrigger("stats-value-prestige", (value) => updateStats(values, 3))
    registerTrigger("stats-value-reset", (value) => updateStats(values, 3))
    registerTrigger("value-reset", (value) => delayUpdateStats(3))
    registerTrigger("value-prestiged", (value) => delayUpdateStats(3))
    registerTrigger("slots-toggled", (value) => updateStats(values, 2))
    registerTrigger("slots-toggled", (value) => delayUpdateStats(2))
    registerTrigger("bingo-updated", (value) => updateStats(values, 2))
    registerTrigger("bingo-updated", (value) => delayUpdateStats(2))
    registerTrigger("stored-values-updated", updateStats)
    registerTrigger("stats-values-updated", updateStats)
    registerTrigger("slot-unlocked", storeUnlock)

    $: values = state?.values

    function diffValues(before = {}, after) {
        return Object.fromEntries(
            Object.entries(after)
                  .filter(([id, value]) => before[id] !== value)
        )
    }

    function compressFirst(data, items) {
        const item = Object.assign(...data.slice(0, items + 1))
        data.splice(0, items + 1, item)
    }

    function updatePeriodStats(values, id, period, maxTime, forced = false) {
        const data = stats[id]
        if (!forced && data.length && data.at(-1).time > values.time - period)
            return

        const diff = diffValues(stats.last[id], values)
        if (Object.keys(diff).length === 0)
            return

        data.push(diff)
        stats.last[id] = values

        const startTime = data.at(-1).time - maxTime
        let cut = 0
        while (data[cut] && data[cut].time < startTime)
            cut++
        if (cut > 0)
            compressFirst(data, cut)
    }

    function updateStats(newValues, forced = 0) {
        values = newValues
        const storable = Object.fromEntries(
            Object.entries(values)
                .filter(x => !x[0].match(/_seen|_auto|_base/))
                .map(x => [x[0], typeof x[1] === "number" ? +x[1].toExponential(3) : x[1]])
        )
        updatePeriodStats(storable, 'secondly', 1, 300, forced > 0)
        updatePeriodStats(storable, 'minutely', 60, 18000, forced > 1)
        updatePeriodStats(storable, 'hourly', 3600, Infinity, forced > 2)
    }

    let delayTimeout = null
    function delayUpdateStats(forced) {
        clearTimeout(delayTimeout)
        delayTimeout = setTimeout(() => updateStats(values, forced), 0)
    }

    function storeReset(id) {
        const codes = getValuesCodes(id)
        const record = {
            [codes.X] : values[codes.X],
            [codes.MX] : values[codes.MX],
            [codes.XP] : values[codes.XP],
            [codes.Xt] : values[codes.Xt],
            time : values.time,
        }
        stats.reset[id] ??= []
        stats.reset[id].push(record)
    }

    function storeUnlock(slot) {
        stats.unlocks[slot] = values.time ?? 0
    }

    $: values = state?.values ?? {}

</script>