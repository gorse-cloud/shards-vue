const allListenTypes = {
    hover: true,
    click: true,
    focus: true
}

const BEL_KEY = '__DR_BOUND_EVENT_LISTENERS__'

const getElement = el => el && (el.elm || el.el || el)

const bindTargets = (el, binding, listenTypes, callback) => {
    const element = getElement(el)

    if (!element) {
        return []
    }

    const targets = Object.keys(binding.modifiers || {}).filter(t => !allListenTypes[t])

    if (binding.value) {
        targets.push(binding.value)
    }

    const listener = () => {
        callback({ targets, el: element, binding })
    }

    Object.keys(allListenTypes).forEach(type => {
        if (listenTypes[type] || binding.modifiers[type]) {
            element.addEventListener(type, listener)
            const boundListeners = element[BEL_KEY] || {}
            boundListeners[type] = boundListeners[type] || []
            boundListeners[type].push(listener)
            element[BEL_KEY] = boundListeners
        }
    })

    return targets
}

const unbindTargets = (el, binding, listenTypes) => {
    const element = getElement(el)

    if (!element) {
        return
    }

    Object.keys(allListenTypes).forEach(type => {
        if (listenTypes[type] || binding.modifiers[type]) {
            const boundListeners = element[BEL_KEY] && element[BEL_KEY][type]
            if (boundListeners) {
                boundListeners.forEach(listener => element.removeEventListener(type, listener))
                delete element[BEL_KEY][type]
            }
        }
    })
}

export {
    bindTargets,
    unbindTargets
}

export default bindTargets
