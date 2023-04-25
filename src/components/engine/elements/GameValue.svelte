<script>
    import Trigger from "utility/trigger.js"
    import {onDestroy, onMount} from "svelte"

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
    export let autoPrestige = false
    export let timeSinceReset = 0

    export let seen = false

    function advance(step) {
        if (!seen)
            return

        timeSinceReset += step

        if (limit <= 0 || value >= limit)
            return

        value += delta * step

        if (value >= limit) {
            value = limit
            Trigger("value-capped", name)
            if (autoPrestige)
                prestige()
        }
    }

    function prestige(target = name) {
        if (!seen || target !== name || value < limit)
            return

        value -= value * prestigeCost
        limit *= limitMultiplier
        prestiges += prestigeStep

        Trigger("value-prestiged", target, prestigeStep)
    }

    function reset(target = name) {
        if (!seen || target !== name)
            return

        value = 0
        prestiges = 0
        limit = baseLimit
        timeSinceReset = 0

        Trigger("value-reset", target)
    }

    const triggers = []
    onMount(() => {
        triggers.push(Trigger.on("command-tick-step", advance))
        triggers.push(Trigger.on("command-prestige-value", prestige))
        triggers.push(Trigger.on("command-reset-value", reset))
    })

    onDestroy(() => {
        triggers.forEach(trigger => trigger.cancel())
    })


</script>
