export default function interactive(node) {

    const basicAction = () => {
        node.dispatchEvent(new CustomEvent("basicaction"))
    }
    const specialAction = () => {
        node.dispatchEvent(new CustomEvent("specialaction"))
    }
    const enter = () => {
        node.dispatchEvent(new CustomEvent("enter"))
    }
    const leave = () => {
        node.dispatchEvent(new CustomEvent("leave"))
    }

    const mouseUpHandler = (event) => {
        cancelEvent(event)
        if (event.shiftKey || event.button)
            specialAction()
        else
            basicAction()
    }

    let timeout = null
    const touchStartHandler = (event) => {
        //TODO: filter extra touch
        timeout = setTimeout(() => {
            specialAction()
            timeout = null
        }, 500)
        cancelEvent(event)
    }

    const touchEndHandler = (event) => {
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
            node.dispatchEvent(new CustomEvent("basicaction"))
        }
        cancelEvent(event)
    }

    const mouseInHandler = (event) => {
        if (event.target === node)
            enter()
    }

    const mouseOutHandler = (event) => {
        if (event.target === node)
            leave()
    }

    const cancelEvent = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const handlers = {
        mouseup: mouseUpHandler,
        mouseenter: mouseInHandler,
        mouseleave: mouseOutHandler,
        touchstart: touchStartHandler,
        touchend: touchEndHandler,
        contextmenu: cancelEvent,
    }

    for (let [event, handler] of Object.entries(handlers))
        node.addEventListener(event, handler, true)

    return {
        destroy() {
            for (let [event, handler] of Object.entries(handlers))
                node.removeEventListener(event, handler, true)
        }
    };
}
