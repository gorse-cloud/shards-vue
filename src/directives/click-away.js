const KEY = '__DR_CLICK_AWAY__'

function onClickAway(el, binding, event) {
    if (!el || el === event.target || el.contains(event.target)) {
        return
    }

    if (typeof binding.value === 'function') {
        binding.value(event)
    }
}

export default {
    beforeMount(el, binding) {
        if (typeof document === 'undefined') {
            return
        }

        const handler = event => onClickAway(el, binding, event)

        el[KEY] = handler
        document.addEventListener('click', handler)
        document.addEventListener('touchstart', handler)
    },

    unmounted(el) {
        if (typeof document === 'undefined') {
            return
        }

        if (!el[KEY]) {
            return
        }

        document.removeEventListener('click', el[KEY])
        document.removeEventListener('touchstart', el[KEY])
        delete el[KEY]
    }
}
