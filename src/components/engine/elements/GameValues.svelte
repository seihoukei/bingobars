<script>
    import GameValue from "components/engine/elements/GameValue.svelte"
    import GameModifierList from "components/engine/elements/GameModifierList.svelte"
    import GameTableValues from "components/engine/elements/GameTableValues.svelte"

    import BASE_VALUES from "data/base-values.js"

    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger.js"

    const VALUE_NAMES = Object.keys(BASE_VALUES)
    const MAX_TIME_PER_TICK = 600
    const MAX_TIME_PER_STEP = 10
    const MAX_TIME_PER_STATS = 10

    registerTrigger("command-tick", advance)
    registerTrigger("command-tick-step", updateValues)

    let tableValues = {}
    let activeModifierList = []
    let availableModifierList = []

    export let values = getInitialValues()
    export let state

    $: activeModifierList, tableValues, updateValues()

    if (import.meta.env.MODE === "development") {
        window.activeModifierList = activeModifierList
    }

    function resetDerivedValues(values = values) {
        for (const name of VALUE_NAMES) {
            values[`d${name}`]  = values[`d${name}_base`]  = BASE_VALUES[name].baseSpeed ?? 1
            values[`M${name}0`] = values[`M${name}0_base`] = BASE_VALUES[name].baseLimit ?? 5
            values[`M${name}m`] = values[`M${name}m_base`] = BASE_VALUES[name].baseLimitMultiplier ?? 2
            values[`d${name}P`] = values[`d${name}P_base`] = 1
            values[`${name}Pc`] = values[`${name}Pc_base`] = 1

            values[`d${name}_seen`] = false
            values[`M${name}0_seen`] = false
            values[`M${name}m_seen`] = false
            values[`d${name}P_seen`] = false
            values[`${name}Pc_seen`] = false
            values[`${name}_auto_seen`] = false
            values[`${name}_seen`] = BASE_VALUES[name].initialSeen ?? false


            Object.assign(values, tableValues)
        }
    }

    function getInitialValues() {
        const values = {
            time : 0,
            targetTime : 0,
        }

        resetDerivedValues(values)

        for (const name of VALUE_NAMES) {
            values[name] = 0
            values[`M${name}`] = values[`M${name}0`]
            values[`${name}P`] = 0
            values[`${name}Pt`] = 0
            values[`${name}t`] = 0
            values[`${name}_auto`] = true
        }

        return values
    }

    function updateValues() {
        resetDerivedValues(values)

        if (activeModifierList)
            for (const modifier of activeModifierList) {
                modifier.apply(values)
            }

        if (availableModifierList)
            for (const modifier of availableModifierList) {
                if (modifier.source) {
                    for (let value of modifier.involved)
                        if (values[`${value}_seen`] === false)
                            values[`${value}_seen`] = true
                } else if (modifier.target) {
                    if (values[`${modifier.target}_seen`] === false)
                        values[`${modifier.target}_seen`] = true

                }
            }

        for (let name of VALUE_NAMES) {
            values[`M${name}0`] = Math.max(1, values[`M${name}0`])
            values[`M${name}m`] = Math.max(1, values[`M${name}m`])
            values[`d${name}`] = Math.max(0, values[`d${name}`])
            values[`${name}Pc`] = Math.max(0, Math.min(values[`${name}Pc`], 1))
        }


        Trigger("derived-values-updated", values)
        Trigger("values-updated", values)
    }

    function getValueCapTime(name) {
        const seen = values[`${name}_seen`] ?? false
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

        values.targetTime += time

        let timeToProcess = Math.min(values.targetTime - values.time, MAX_TIME_PER_TICK)
        let timeTillStatsUpdate = MAX_TIME_PER_STATS

        while (timeToProcess > 0) {
            const valueCapTimes = VALUE_NAMES.map(getValueCapTime)
            let step = Math.min(
                MAX_TIME_PER_STEP,
                timeToProcess,
                ...valueCapTimes,
            )

            values.time += step
            timeToProcess -= step

            Trigger("command-tick-step", step)

            timeTillStatsUpdate -= step
            if (timeTillStatsUpdate < 0) {
                timeTillStatsUpdate = MAX_TIME_PER_STATS
                Trigger("command-update-stats", values)
            }
        }

        Trigger("stored-values-updated", values)
        Trigger("values-updated", values)
    }

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
                seen={values[`${value}_seen`]}
                canAutoPrestige={values[`${value}_auto_seen`]}

                bind:value={values[value]}
                bind:prestiges={values[`${value}P`]}
                bind:limit={values[`M${value}`]}
                bind:timeSinceReset={values[`${value}t`]}
                bind:timeSincePrestige={values[`${value}Pt`]}
                bind:autoPrestige={values[`${value}_auto`]}
        />
    {/each}

    <GameModifierList tables={state?.tables} bingo={state?.bingo} bind:availableModifierList bind:activeModifierList/>
    <GameTableValues tables={state?.tables} bingo={state?.bingo} bind:tableValues />
{/if}
