<script>
    import StringMaker from "utility/string-maker.js"
    import interactive from "utility/interactive.js"

    export let game
    export let id

    let animationFrame = null

    const RENDER_RESOLUTION = 300

    const VIEWS = [
        {
            name: "5m",
            stats : "secondly",
            weakGrid : 60,
            strongGrid : 300,
        },
        {
            name: "6h",
            stats : "minutely",
            weakGrid : 600,
            strongGrid: 3600,
        },
        {
            name: "Days",
            stats : "hourly",
            weakGrid : 3600 * 6,
            strongGrid: 3600 * 24,
        },
    ]

    let renderWidth = 300
    let renderHeight = 180

    let currentView = 1
    let logarithmic = false
    let canvas

    $: stats = game?.state?.stats ?? {}
    $: viewData = VIEWS[currentView]
    $: data = stats[viewData.stats] ?? []
    $: updateGraph(data)

    $: enoughData = (data.at(-1).time ?? 0) - (data.at(0).time ?? 0) >= viewData.weakGrid / 6

    $: context = canvas?.getContext("2d")

    $: mouse = null

    function updatePosition(event) {
        const rect = canvas.getBoundingClientRect()
        mouse = {
            x : (event.clientX - rect.x) / canvas.width * renderWidth,
            y : (event.clientY - rect.y) / canvas.height * renderHeight,
        }
        updateGraph()
    }

    function updateGraph() {
        cancelAnimationFrame(animationFrame)
        animationFrame = requestAnimationFrame(render)
    }

    function render() {
        if (!canvas || !context || !data)
            return

        const width = canvas.width = canvas.clientWidth
        const height = canvas.height = canvas.clientHeight

        const ratio = width / height

        renderHeight = Math.min(RENDER_RESOLUTION, width / ratio)
        renderWidth = renderHeight * ratio

        if (renderWidth > RENDER_RESOLUTION) {
            renderWidth = RENDER_RESOLUTION
            renderHeight = renderWidth / ratio
        }

        if (mouse) {
            mouse.closestX = 0
            mouse.closestY = 0
        }

        const start = data.at(0).time
        const end = data.at(-1).time
        const timeScale = renderWidth / (end - start)

        context.clearRect(0, 0, width, height)
        context.save()
        context.scale(width / renderWidth, height / renderHeight)

        if (enoughData) {
            context.font = "10px Rajdhani"
            context.fillStyle = "#CCCCCC"
            context.beginPath()
            for (let moment = viewData.weakGrid * Math.floor(start / viewData.weakGrid);
                 moment < end;
                 moment += viewData.weakGrid) {
                const x = (moment - start) * timeScale
                context.moveTo(x, 0)
                context.lineTo(x, renderHeight)
            }
            context.strokeStyle = "#888888"
            context.lineWidth = 0.25
            context.stroke()
            context.beginPath()
            for (let moment = viewData.strongGrid * Math.floor(start / viewData.strongGrid);
                 moment < end;
                 moment += viewData.strongGrid) {
                const x = (moment - start) * timeScale
                context.moveTo(x, renderHeight)
                context.lineTo(x, 0)
                context.fillText(StringMaker.formatValue(moment, {type: StringMaker.VALUE_FORMATS.TIME}), x, renderHeight - 2)
            }
            context.strokeStyle = "#AAAAAA"
            context.stroke()

            const realMax = Math.max(...data.filter(x => x[id] !== undefined).map(x => x[id]))
            const realMin = Math.min(...data.filter(x => x[id] !== undefined).map(x => x[id]).filter(x => x))
            if (logarithmic) {
                const logMin = Math.log10(Math.max(realMin))
                const logMax = Math.log10(realMax)
                const pad = Math.max(0, 2 - (logMax - logMin))
                const min = logMin - 0.1 * Math.abs(logMin) - pad
                const max = logMax + 0.1 * Math.abs(logMax) + pad
                const valueScale = renderHeight / (max - min)

                //render bars
                context.beginPath()
                const step = 10 ** Math.floor(Math.log10(max - min))
                for (let i = 0; i < 11; i++) {
                    context.moveTo(0, renderHeight - (i * step - min) * valueScale)
                    context.lineTo(renderWidth, renderHeight - (i * step - min) * valueScale)
                    context.fillText(StringMaker.formatValue(10 ** (i * step)), 2, renderHeight - (i * step - min) * valueScale)
                }
                context.lineWidth = 0.25
                context.strokeStyle = "#888888"
                context.stroke()

                context.beginPath()
                context.lineWidth = 1
                context.moveTo(0, renderHeight)
                let value = 0
                let time = 0
                for (let item of data) {
                    value = item[id] ?? value
                    time = item.time ?? time
                    const x = (time - start) * timeScale
                    const y = renderHeight - (Math.log10(value) - min) * valueScale
                    if (mouse && x < mouse.x) {
                        mouse.closestX = x
                        mouse.closestY = y
                        mouse.time = time
                        mouse.value = value
                    }
                    context.lineTo(x, y)
                }
                context.lineTo(renderWidth, renderHeight)
                context.lineTo(0, renderHeight)
                context.fillStyle = "#CCCCCC88"
                context.strokeStyle = "#CCCCCC"
                context.fill()
                context.stroke()

            } else {
                const max = realMax + 0.1 * Math.abs(realMax)
                const valueScale = renderHeight / max

                const step = 10 ** Math.floor(Math.log10(max))
                for (let i = 1; i < 11; i++) {
                    context.moveTo(0, renderHeight - i * step * valueScale)
                    context.lineTo(renderWidth, renderHeight - i * step * valueScale)
                    context.fillText(StringMaker.formatValue(i * step), 2, renderHeight - i * step * valueScale)
                }
                context.lineWidth = 0.25
                context.strokeStyle = "#888888"
                context.stroke()

                context.beginPath()
                context.lineWidth = 1
                context.moveTo(0, renderHeight)
                let value = 0
                let time = 0
                for (let item of data) {
                    value = item[id] ?? value
                    time = item.time ?? time
                    const x = (time - start) * timeScale
                    const y = renderHeight - value * valueScale
                    if (mouse && x < mouse.x) {
                        mouse.closestX = x
                        mouse.closestY = y
                        mouse.time = time
                        mouse.value = value
                    }
                    context.lineTo(x, y)
                }
                context.lineTo(renderWidth, renderHeight)
                context.lineTo(0, renderHeight)
                context.fillStyle = "#CCCCCC88"
                context.strokeStyle = "#CCCCCC"
                context.fill()
                context.stroke()

            }

            if (mouse) {
                context.beginPath()
                context.moveTo(mouse.closestX, 0)
                context.lineTo(mouse.closestX, renderHeight)
                context.moveTo(0, mouse.closestY)
                context.lineTo(renderWidth, mouse.closestY)
                context.strokeStyle = "#444444"
                context.stroke()

                context.save()
                context.fillStyle = "#CCCCCC"
                if (mouse.x > 0.5) {
                    context.textAlign = "right"
                    context.fillText(StringMaker.formatValueById(mouse.value, id), mouse.closestX - 2, mouse.closestY - 2)
                    context.textBaseline = "top"
                    context.fillText(StringMaker.formatValue(mouse.time, {type: StringMaker.VALUE_FORMATS.TIME}), mouse.closestX - 2, mouse.closestY + 2)
                } else {
                    context.textAlign = "left"
                    context.fillText(StringMaker.formatValueById(mouse.value, id), mouse.closestX + 2, mouse.closestY - 2)
                    context.textBaseline = "top"
                    context.fillText(StringMaker.formatValue(mouse.time, {type: StringMaker.VALUE_FORMATS.TIME}), mouse.closestX + 2, mouse.closestY + 2)
                }
                context.restore()
            }

            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(0, renderHeight)
            context.lineTo(renderWidth, renderHeight)
            context.lineTo(renderWidth, 0)
            context.lineTo(0, 0)
            context.strokeStyle = "#222222"
            context.lineWidth = 2
            context.stroke()
        } else {
            context.font = "32px Rajdhani"
            context.fillStyle = "#CCCCCC"
            context.textBaseline = "middle"
            context.textAlign = "center"
            context.fillText("Not enough data", renderWidth / 2, renderHeight / 2)
        }

        context.restore()
    }

    function setView(view) {
        currentView = view
    }

    function toggleLogarithmic() {
        logarithmic = !logarithmic
    }

</script>

<canvas bind:this={canvas}
    on:mousemove={updatePosition}>
</canvas>
<div class="buttons">
    {#each VIEWS as viewData, index}
        <div class="button"
             class:active={index === currentView}
             use:interactive
             on:basicaction={() =>setView(index)}
        >
            {viewData.name}
        </div>
    {/each}
    <div class="toggle button"
         class:active={logarithmic}
         use:interactive
         on:basicaction={toggleLogarithmic}
    >
        Logarithmic
    </div>
</div>

<style>
    canvas {
        flex : 1;
    }

    div.buttons {
        margin: 0.4em 0;
        display : flex;
        align-items: center;
        justify-content: center;
        column-gap: 1em;
        font-size: 1em;
    }

    div.button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.2em 1em;
        background-color: #222222;
        border-radius: 0.5em;
        cursor: pointer;
    }

    div.button:hover {
        background-color: #333333;
    }

    div.button.active {
        cursor: default;
        border: 0.1em solid #888888;
        padding: 0.1em 0.9em;
    }

    div.toggle {
        margin-left: auto;
    }
</style>
