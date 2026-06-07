// Creates the cancelable event props.
function _makeCancelableEventProps() {
    return { enumerable: true, configurable: false, writable: false }
}

/**
 * Custom cancelable event.
 */
export class CancelableEvent {
    constructor (type, eventInit = {}) {
        Object.assign(this, CancelableEvent.defaults(), eventInit, { type })

        Object.defineProperties(this, {
            type: _makeCancelableEventProps(),
            cancelable: _makeCancelableEventProps(),
            nativeEvent: _makeCancelableEventProps(),
            target: _makeCancelableEventProps(),
            relatedTarget: _makeCancelableEventProps(),
            vueTarget: _makeCancelableEventProps()
        })

        let defaultPrevented = false

        this.preventDefault = function preventDefault() {
            if (this.cancelable) {
                defaultPrevented = true
            }
        }

        Object.defineProperty(this, 'defaultPrevented', {
            enumerable: true,
            get() {
                return defaultPrevented
            }
        })
    }

    static defaults() {
        return {
            type: '',
            cancelable: true,
            nativeEvent: null,
            target: null,
            relatedTarget: null,
            vueTarget: null
        }
    }
}

export function createEventBus() {
    const listeners = Object.create(null)

    return {
        $on(event, callback) {
            if (!listeners[event]) {
                listeners[event] = new Set()
            }

            listeners[event].add(callback)
        },

        $off(event, callback) {
            if (!listeners[event]) {
                return
            }

            if (callback) {
                listeners[event].delete(callback)
            } else {
                listeners[event].clear()
            }
        },

        $emit(event, ...args) {
            if (!listeners[event]) {
                return
            }

            listeners[event].forEach(callback => callback(...args))
        }
    }
}

const fallbackEventBus = createEventBus()

export function installEventBus(app) {
    if (!app || !app.config || !app.config.globalProperties) {
        return fallbackEventBus
    }

    if (!app.config.globalProperties.$shardsVueBus) {
        app.config.globalProperties.$shardsVueBus = createEventBus()
    }

    return app.config.globalProperties.$shardsVueBus
}

export function getEventBus(instance) {
    if (instance && instance.$shardsVueBus) {
        return instance.$shardsVueBus
    }

    if (
        instance
        && instance.appContext
        && instance.appContext.config
        && instance.appContext.config.globalProperties
        && instance.appContext.config.globalProperties.$shardsVueBus
    ) {
        return instance.appContext.config.globalProperties.$shardsVueBus
    }

    return fallbackEventBus
}
