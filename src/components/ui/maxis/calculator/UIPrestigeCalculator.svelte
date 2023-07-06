<script>
    import BASE_VALUES from "data/base-values.js"
    import interactive from "utility/interactive.js"
    import StringMaker from "utility/string-maker.js"

    export let game

    let current

    let prestiges = []
    const LIST_LENGTH = 20

    $: values = game?.state?.values ?? {}
    $: seen = game?.state?.seen ?? {}
    $: seenValues = Object.values(BASE_VALUES).filter(x => values[x.codes.X_seen]).map(x => x.id)
    $: current ??= seenValues[0]

    $: codes = BASE_VALUES[current]?.codes ?? {}
    $: updatePrestiges(codes, values)

    function updatePrestiges(codes, values) {
        let X = values[codes.X]
        let dX = values[codes.dX]
        let MX = values[codes.MX]
        let MXm = values[codes.MXm]
        let XP = values[codes.XP]
        let dXP = values[codes.dXP]
        let XPc = values[codes.XPc]

        prestiges.length = 0
        if (dX <= 0)
            return

        let T = 0

        for (let i = 0; i < LIST_LENGTH && T < 3600000; i++) {
            const PT = (MX - X) / dX
            T += PT
            XP += dXP
            X = MX * (1 - XPc)
            MX *= MXm

            prestiges.push({
                T, PT, MX, XP,
            })

        }
    }

</script>

<div class="select">
    {#each seenValues as id}
        <div class="option"
             class:active={current === id}
             style={`--background:${BASE_VALUES[id].colors.dark}; --highlight-background:${BASE_VALUES[id].colors.normal};`}
             use:interactive
             on:basicaction={() => current = id}
        > {id} </div>
    {/each}
</div>

<div class="headers">
    <div class="header" style="grid-area:n">#</div>
    <div class="header" style="grid-area:time">Time to reach from</div>
    <div class="header" style="grid-area:after">Values after</div>
    <div class="header" style="grid-area:t">Now</div>
    <div class="header" style="grid-area:pt">Prestige</div>
    <div class="header" style="grid-area:xp">{codes.XP}</div>
    <div class="header" style="grid-area:mx">{codes.MX}</div>
</div>
<div class="list">
    {#each prestiges as prestige, i}
        <div class="value">{i}</div>
        <div class="value">{i ? StringMaker.formatValue(prestige.PT, {type: StringMaker.VALUE_FORMATS.TIME, limit:3600000}) : "-"}</div>
        <div class="value">{StringMaker.formatValue(prestige.T, {type: StringMaker.VALUE_FORMATS.TIME, limit:3600000})}</div>
        <div class="value">{StringMaker.formatValue(prestige.XP, {type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC})}</div>
        <div class="value">{StringMaker.formatValue(prestige.MX, {type: StringMaker.VALUE_FORMATS.SHORT_SCIENTIFIC})}</div>
    {/each}
</div>

<style>
    div.select {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        font-size: 0.8em;
    }
    div.option {
        width: 2em;
        background-color: var(--background);
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor : pointer;
    }

    div.option.active {
        background-color: var(--highlight-background);
    }

    div.headers {
        display: grid;
        grid-template-columns: 2fr 4fr 4fr 3fr 5fr;
        grid-template-areas:
                "n time time after after"
                "n pt t xp mx";
        row-gap: 1rem;
        column-gap: 1rem;
        font-size: 0.6em;
    }

    div.list {
        display: grid;
        grid-template-columns: 2fr 4fr 4fr 3fr 5fr;
        row-gap: 1rem;
        column-gap: 1rem;
        overflow : hidden auto;
        font-size: 0.8em;
    }

    div.value {
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: #222222;
        border-radius: 1rem;
    }

    div.header {
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: #333333;
        border-radius: 1rem;
    }
</style>
