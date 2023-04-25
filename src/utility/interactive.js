export default function interactive(node) {
    
    let timeout = null
    const mouseUpHandler = (event) => {
        cancelEvent(event)
        if (event.shiftKey || event.button)
            specialAction()
        else
            basicAction()
    }
    
    const touchStartHandler = (event) => {
        //TODO: filter extra touch
        timeout = setTimeout(() => {
            specialAction()
            timeout = null
        }, 500)
        cancelEvent(event)
    }
    
    const basicAction = () => {
        node.dispatchEvent(new CustomEvent("basicaction"))
    }
    const specialAction = () => {
        node.dispatchEvent(new CustomEvent("specialaction"))
    }
    
    const touchEndHandler = (event) => {
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
            node.dispatchEvent(new CustomEvent("basicaction"))
        }
        cancelEvent(event)
    }
    
    const cancelEvent = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }
    
    node.addEventListener("mouseup", mouseUpHandler, true)
    node.addEventListener("touchstart", touchStartHandler,true)
    node.addEventListener("touchend", touchEndHandler, true)
    node.addEventListener("contextmenu", cancelEvent, true)

    return {
        destroy() {
            node.removeEventListener("mouseup", mouseUpHandler, true)
            node.removeEventListener("touchstart", touchStartHandler, true)
            node.removeEventListener("touchend", touchEndHandler, true)
            node.removeEventListener("contextmenu", cancelEvent, true)
        }
    };
}
