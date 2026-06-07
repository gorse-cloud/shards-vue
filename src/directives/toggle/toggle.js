import target from '../../utils/target'
import { unbindTargets } from '../../utils/target'
import { COLLAPSE_EVENTS } from '../../utils/constants'
import { setAttr, addClass, removeClass } from '../../utils'
import { getEventBus } from '../../utils/events'

const inBrowser = typeof window !== 'undefined'
const DR_TOGGLE = '__DRTOGGLE'

export default {
    beforeMount(element, binding) {
        const bus = getEventBus(binding.instance)
        const targets = target(element, binding, { click: true }, ({ targets }) => {
            targets.forEach(target => bus.$emit(COLLAPSE_EVENTS.TOGGLE, target));
        });

        if (inBrowser && targets.length > 0) {
            setAttr(element, 'aria-controls', targets.join(' '))
            setAttr(element, 'aria-expanded', 'false')

            if (element.tagName !== 'BUTTON') {
                setAttr(element, 'role', 'button')
            }

            element[DR_TOGGLE] = function toggleDirectiveHandler(id, state) {
                if (targets.indexOf(id) !== -1) {
                    setAttr(element, 'aria-expanded', state ? 'true' : 'false');

                    if (state) {
                        removeClass(element, 'collapsed');
                        return;
                    }

                    addClass(element, 'collapsed');
                }
            }
            bus.$on(COLLAPSE_EVENTS.STATE, element[DR_TOGGLE])
        }
    },
    unmounted(element, binding) {
        unbindTargets(element, binding, { click: true })

        if (!element[DR_TOGGLE]) {
            return
        }

        getEventBus(binding.instance).$off(COLLAPSE_EVENTS.STATE, element[DR_TOGGLE])
        element[DR_TOGGLE] = null
    }
}
