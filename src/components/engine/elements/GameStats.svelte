<script>
    import getValuesCodes from "data/get-values-codes.js"
    import registerTrigger from "utility/register-trigger.js"

    export let state
    export let stats = {
        reset : {},
        secondly : [],
        minutely : [],
        hourly : [],
    }

    registerTrigger("stats-value-reset", storeReset)
    registerTrigger("stored-values-updated", updateStats)
    registerTrigger("stats-values-updated", updateStats)

    $: values = state?.values

    function updatePeriodStats(values, stats, period, maxTime) {
        if (stats.length && stats.at(-1).time > values.time - period)
            return
        stats.push(values)
        while (stats.at(-1).time > stats.at(0).time + maxTime)
            stats.shift()
    }

    function updateStats(values) {
        const storable = Object.fromEntries(
            Object.entries(values)
                .filter(x => !x[0].match(/_seen|_auto|_base/))
        )
        updatePeriodStats(storable, stats.secondly, 1, 300)
        updatePeriodStats(storable, stats.minutely, 60, 18000)
        updatePeriodStats(storable, stats.hourly, 3600, Infinity)
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

    $: values = state?.values ?? {}

</script>