<script>
    import getValuesCodes from "data/get-values-codes.js"
    import registerTrigger from "utility/register-trigger.js"

    export let state
    export let stats = {
        reset : {},
        secondly : [],
        minutely : [],
        hourly : [],
        unlocks : {},
    }

    registerTrigger("stats-value-reset", storeReset)
    registerTrigger("stats-value-prestige", (value) => updateStats(values, true))
    registerTrigger("stats-value-reset", (value) => updateStats(values, true))
    registerTrigger("slots-toggled", (value) => updateStats(values, true))
    registerTrigger("value-reset", (value) => delayUpdateStats(values, true))
    registerTrigger("value-prestiged", (value) => delayUpdateStats(values, true))
    registerTrigger("slots-toggled", (value) => delayUpdateStats(values, true))
    registerTrigger("stored-values-updated", updateStats)
    registerTrigger("stats-values-updated", updateStats)
    registerTrigger("slot-unlocked", storeUnlock)

    $: values = state?.values

    function updatePeriodStats(values, stats, period, maxTime, forced = false) {
        if (!forced && stats.length && stats.at(-1).time > values.time - period)
            return
        stats.push(values)
        while (stats.at(-1).time > stats.at(0).time + maxTime)
            stats.shift()
    }

    function updateStats(newValues, forced = false) {
        values = newValues
        const storable = Object.fromEntries(
            Object.entries(values)
                .filter(x => !x[0].match(/_seen|_auto|_base/))
        )
        updatePeriodStats(storable, stats.secondly, 1, 300, forced)
        updatePeriodStats(storable, stats.minutely, 60, 18000, forced)
        updatePeriodStats(storable, stats.hourly, 3600, Infinity, forced)
    }

    let delayTimeout = null
    function delayUpdateStats() {
        clearTimeout(delayTimeout)
        delayTimeout = setTimeout(() => updateStats(values, true), 0)
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