import {onDestroy, onMount} from "svelte"

export default function registerTrigger(...args) {
    let trigger = null
    onMount(() => {
        trigger = Trigger.on(...args)
    })
    onDestroy(() => {
        trigger?.cancel?.()
    })
}