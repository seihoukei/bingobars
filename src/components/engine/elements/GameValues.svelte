<script>
    import GameValue from "components/engine/elements/GameValue.svelte"
    import {onDestroy, onMount} from "svelte"
    import Trigger from "utility/trigger.js"
    import VALUES from "data/values.js"
    import GameModifierList from "components/engine/GameModifierList.svelte"

    const VALUE_NAMES = Object.keys(VALUES)
    const MAX_TIME_STEP = 10000

    export let values = getInitialValues()
    export let state

    export let modifierList = []

    $: modifierList, updateValues()

    if (import.meta.env.MODE === "development") {
        window.modifierList = modifierList
    }

    function resetDerivedValues(values = values) {
        for (const name of VALUE_NAMES) {
            values[`d${name}`] = VALUES[name].baseSpeed ?? 1
            values[`M${name}0`] = VALUES[name].baseLimit ?? 5
            values[`M${name}m`] = VALUES[name].baseLimitMultiplier ?? 2
            values[`d${name}P`] = 1
            values[`${name}Pc`] = 1
            values[`${name}seen`] = VALUES[name].initialSeen ?? false
            values[`${name}auto`] = false
        }

        values[`slots`] = 0
        values[`rows`] = 0
        values[`columns`] = 0
        values[`diagonals`] = 0
    }

    function getInitialValues() {
        const values = {}

        resetDerivedValues(values)

        for (const name of VALUE_NAMES) {
            values[name] = 0
            values[`M${name}`] = values[`M${name}0`]
            values[`${name}P`] = 0
            values[`${name}Pt`] = 0
            values[`${name}t`] = 0
        }

        return values
    }

    function updateValues() {
        resetDerivedValues(values)

        for (let name of VALUE_NAMES) {
            if (VALUES[name].speedFactors)
                for (const factor of VALUES[name].speedFactors)
                    values[`d${name}`] *= values[factor]
        }

        if (modifierList)
            for (const modifier of modifierList) {
                modifier.apply(values)
            }

        for (let name of VALUE_NAMES) {
            values[`M${name}0`] = Math.max(1, values[`M${name}0`])
            values[`M${name}m`] = Math.max(1, values[`M${name}m`])
            values[`d${name}`] = Math.max(0, values[`d${name}`])
            values[`${name}Pc`] = Math.max(0, Math.min(values[`p${name}c`], 1))
        }

        Trigger("derived-values-updated", values)
        Trigger("values-updated", values)
    }

    function getValueTime(name) {
        const seen = values[`${name}seen`] ?? false
        if (!seen)
            return Infinity

        const max = values[`M${name}`] ?? 0
        if (max === 0)
            return Infinity

        const delta = values[`d${name}`] ?? 0
        if (delta === 0)
            return Infinity

        const value = values[`${name}`] ?? 0
        if (value >= max)
            return Infinity

        const time = (max - value) / delta

        return time
    }

    function advance(time) {
        if (!values) return

        let remainingTime = time
        while (remainingTime > 0) {
            const times = VALUE_NAMES.map(getValueTime)
            let step = Math.min(MAX_TIME_STEP, remainingTime, ...times)
            Trigger("command-tick-step", step)
            updateValues()
            remainingTime -= step
        }

        Trigger("stored-values-updated", values)
        Trigger("values-updated", values)
    }

    const triggers = []
    onMount(() => {
        triggers.push(Trigger.on("command-tick", advance))
    })

    onDestroy(() => {
        triggers.forEach(trigger => trigger.cancel())
    })

</script>

{#if values}
    {#each VALUE_NAMES as value}
        <GameValue
                state={state}

                name={value}
                delta={values[`d${value}`]}
                prestigeStep={values[`d${value}P`]}
                prestigeCost={values[`${value}Pc`]}
                baseLimit={values[`M${value}0`]}
                limitMultiplier={values[`M${value}m`]}
                seen={values[`${value}seen`]}
                autoPrestige={values[`${value}auto`]}

                bind:value={values[value]}
                bind:prestiges={values[`${value}P`]}
                bind:limit={values[`M${value}`]}
                bind:timeSinceReset={values[`${value}t`]}
                bind:timeSincePrestige={values[`${value}Pt`]}
        />
    {/each}

    <GameModifierList tables={state.tables} bind:modifierList />
{/if}
