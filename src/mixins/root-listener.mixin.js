import { isArray } from '../utils';
import { getEventBus } from '../utils/events';

const _DR_RL_ = '_DR_RL_';

export default {
    methods: {
        listenOnRoot(event, callback) {
            if (!this[_DR_RL_] || !isArray(this[_DR_RL_])) {
                this[_DR_RL_] = []
            }

            const bus = getEventBus(this)
            const boundCallback = callback.bind(this)

            this[_DR_RL_].push({ event, callback: boundCallback })
            bus.$on(event, boundCallback)

            return this
        },
        emitOnRoot(event, ...args) {
            getEventBus(this).$emit(event, ...args)
            return this
        }
    },
    beforeUnmount() {
        if (!this[_DR_RL_] || !isArray(this[_DR_RL_])) {
            return
        }

        const bus = getEventBus(this)

        while (this[_DR_RL_].length > 0) {
            const { event, callback } = this[_DR_RL_].shift()
            bus.$off(event, callback)
        }
    }
}
