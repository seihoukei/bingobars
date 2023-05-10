<script>
    import GameValue from "components/engine/elements/GameValue.svelte"
    import GameModifierList from "components/engine/elements/GameModifierList.svelte"
    import GameTableValues from "components/engine/elements/GameTableValues.svelte"

    import registerTrigger from "utility/register-trigger.js"
    import Trigger from "utility/trigger.js"
    import BASE_VALUES from "data/base-values.js"
    import Codes from "game-classes/codes.js"

    const VALUE_NAMES = Object.keys(BASE_VALUES)
    const MAX_TIME_PER_TICK = 600
    const MAX_TIME_PER_STEP = 10
    const MAX_TIME_PER_STATS = 10

    const INITIAL_VALUES = Object.assign({}, ...Object.values(BASE_VALUES).map(x => x.derivedDefaults))

    registerTrigger("command-tick", advance)
    registerTrigger("command-tick-step", updateValues)

    let tableValues = {}
    let activeModifierList = []
    let availableModifierList = []

    export let values = getInitialValues()
    export let seen = {}

    export let state

    $: activeModifierList, tableValues, updateValues()

    if (import.meta.env.MODE === "development") {
        window.activeModifierList = activeModifierList
    }


    function resetDerivedValues(values = values) {
        Object.assign(values, INITIAL_VALUES)
        Object.assign(values, tableValues)
    }

    function getInitialValues() {
        const values = Object.assign({
            time : 0,
            targetTime : 0,
        }, ...Object.values(BASE_VALUES).map(x => x.defaults))

        resetDerivedValues(values)

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
                    for (let value of modifier.involved) {
                        const code = Codes.get(value)
                        if (code.derived && !code.hidden)
                            seen[value] = 1
                    }
                } else if (modifier.target) {
                    seen[modifier.target] = 1
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
        const codes = BASE_VALUES[name].codes
        if (!values[codes.X_seen])
            return Infinity

        const max = values[codes.MX] ?? 0
        if (max === 0)
            return Infinity

        const delta = values[codes.dX] ?? 0
        if (delta === 0)
            return Infinity

        const value = values[codes.X] ?? 0
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
        {@const codes = BASE_VALUES[value].codes}
        <GameValue
                name={value}
                delta={values[codes.dX]}
                prestigeStep={values[codes.dXP]}
                prestigeCost={values[codes.XPc]}
                baseLimit={values[codes.MX0]}
                limitMultiplier={values[codes.MXm]}
                seen={values[codes.X_seen]}
                canAutoPrestige={values[codes.X_auto_seen]}

                bind:value={values[codes.X]}
                bind:prestiges={values[codes.XP]}
                bind:limit={values[codes.MX]}
                bind:timeSinceReset={values[codes.Xt]}
                bind:timeSincePrestige={values[codes.XPt]}
                bind:autoPrestige={values[codes.X_auto]}
        />
    {/each}

    <GameModifierList tables={state?.tables} bingo={state?.bingo} bind:availableModifierList bind:activeModifierList/>
    <GameTableValues tables={state?.tables} bingo={state?.bingo} bind:tableValues />
{/if}
