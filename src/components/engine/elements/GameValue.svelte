<script>
    import Trigger from "utility/trigger.js"
    import registerTrigger from "utility/register-trigger.js"

    export let state

    export let name = "A"
    export let value = 0
    export let prestiges = 0
    export let prestigeStep = 1
    export let prestigeCost = 1
    export let delta = 0
    export let baseLimit = 5
    export let limit = baseLimit
    export let limitMultiplier = 2
    export let canAutoPrestige = false
    export let autoPrestige = false
    export let timeSinceReset = 0
    export let timeSincePrestige = 0

    export let seen = false

    registerTrigger("command-tick-step", advance)
    registerTrigger("command-prestige-value", prestige)
    registerTrigger("command-reset-value", reset)
    registerTrigger("command-toggle-auto-prestige", toggleAuto)

    function advance(step) {
        if (!seen)
            return

        timeSinceReset += step
        timeSincePrestige += step

        if (limit <= 0 || value >= limit)
            return

        value += delta * step

        if (value >= limit) {
            value = limit
            Trigger("value-capped", name)
            if (canAutoPrestige && autoPrestige)
                prestige()
        }
    }

    function prestige(target = name) {
        if (!seen || target !== name || value < limit)
            return

        Trigger("stats-value-prestige", target)

        value -= value * prestigeCost
        limit *= limitMultiplier
        prestiges += prestigeStep
        timeSincePrestige = 0

        Trigger("value-prestiged", target, prestigeStep)
    }

    function reset(target = name) {
        if (!seen || target !== name)
            return

        Trigger("stats-value-reset", target)

        value = 0
        prestiges = 0
        limit = baseLimit
        timeSinceReset = 0
        timeSincePrestige = 0

        Trigger("value-reset", target)
    }

    function toggleAuto(target = name) {
        if (!canAutoPrestige || !seen || target !== name)
            return
        autoPrestige = !autoPrestige

        if (value >= limit && canAutoPrestige && autoPrestige) {
                prestige()
        }
    }

</script>
