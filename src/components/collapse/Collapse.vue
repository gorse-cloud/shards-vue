<template>
    <transition :enterActiveClass="'collapsing'"
        :leaveActiveClass="'collapsing'"
        @enter="onEnter"
        @afterEnter="onAfterEnter"
        @leave="onLeave"
        @afterLeave="onAfterLeave" >
        <component :is="tag"
            v-show="show"
            :class="[
                isNav ? 'navbar-collapse' : '',
                !transitioning ? 'collapse' : '',
                show && !transitioning ? 'show' : ''
            ]"
            :id="[ id ? id : '' ]"
            @click="handleClick">
            <slot />
        </component>
    </transition>
</template>

<script>
import { hasClass, isElement } from '../../utils'
import { COLLAPSE_EVENTS } from '../../utils/constants'
import rootListenerMixin from '../../mixins/root-listener.mixin'

export default {
    name: 'd-collapse',
    mixins: [ rootListenerMixin ],
    emits: ['update:modelValue', 'update:visible', 'input', 'show', 'shown', 'hide', 'hidden'],
    props: {
        /**
         * The component ID.
         */
        id: {
            type: String,
            required: true
        },
        /**
         * The component tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * The visibility state.
         */
        modelValue: {
            type: Boolean,
            default: undefined
        },
        visible: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it is located in a nav, or not.
         */
        isNav: {
            type: Boolean,
            default: false
        },
        /**
         * The accordion component identifier (not element ID).
         */
        accordion: {
            type: String,
            default: null
        }
    },
    watch: {
        computedVisible(newVal) {
            if (newVal !== this.show) {
                this.show = newVal
            }
        },
        show(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.emitStateChange()
            }
        }
    },
    data() {
        return {
            show: this.modelValue !== undefined ? this.modelValue : this.visible,
            transitioning: false
        }
    },
    computed: {
        computedVisible() {
            return this.modelValue !== undefined ? this.modelValue : this.visible
        }
    },
    methods: {
        toggle() {
            this.show = !this.show
        },
        emitStateChange() {
            this.$emit('update:modelValue', this.show)
            this.$emit('update:visible', this.show)
            this.$emit('input', this.show)
            this.emitOnRoot(COLLAPSE_EVENTS.STATE, this.id, this.show)

            if (this.accordion && this.show) {
                /**
                 * Triggered when the accordion is collapsed.
                 *
                 * @event accordion-collapse
                 */
                this.emitOnRoot(COLLAPSE_EVENTS.ACCORDION, this.id, this.accordion)
            }

        },
        handleClick(e) {
            const el = e.target
            if (!this.isNav || !el || getComputedStyle(this.$el).display !== 'block') {
                return
            }

            if (hasClass(el, 'nav-link') || hasClass(el, 'dropdown-item')) {
                this.show = false
            }
        },
        handleToggleEvent(e) {
            if (e !== this.id) {
                return
            }

            this.toggle()
        },
        handleAccordionEvent(id, acc) {
            if (!this.accordion || acc !== this.accordion) {
                return
            }

            if (id === this.id) {
                if(!this.show) {
                    this.toggle()
                }
            } else {
                if(this.show) {
                    this.toggle()
                }
            }
        },
        handleResize() {
            this.show = (getComputedStyle(this.$el).display === 'block')
        },
        onEnter(el) {
            el.style.height = 0
            isElement(el) && el.offsetHeight
            el.style.height = el.scrollHeight + 'px'
            this.transitioning = true
            /**
             * Triggered on show.
             *
             * @event show
             */
            this.$emit('show')
        },
        onAfterEnter(el) {
            el.style.height = null
            this.transitioning = false
            /**
             * Triggered after show.
             *
             * @event shown
             */
            this.$emit('shown')
        },
        onLeave(el) {
            el.style.height = 'auto'
            el.style.display = 'block'
            el.style.height = el.getBoundingClientRect().height + 'px'
            isElement(el) && el.offsetHeight
            this.transitioning = true
            el.style.height = 0
            /**
             * Triggered on hide.
             *
             * @event hide
             */
            this.$emit('hide')
        },
        onAfterLeave(el) {
            el.style.height = null
            this.transitioning = false
            /**
             * Triggered when hidden.
             *
             * @event hidden
             */
            this.$emit('hidden')
        }
    },
    created() {
        this.listenOnRoot(COLLAPSE_EVENTS.TOGGLE, this.handleToggleEvent)
        this.listenOnRoot(COLLAPSE_EVENTS.ACCORDION, this.handleAccordionEvent)
    },
    mounted() {
        if (this.isNav && typeof document !== 'undefined') {
            window.addEventListener('resize', this.handleResize, false)
            window.addEventListener('orientationchange', this.handleResize, false)
            this.handleResize()
        }

        this.emitStateChange()
    },
    beforeUnmount() {
        if (this.isNav && typeof document !== 'undefined') {
            window.removeEventListener('resize', this.handleResize, false)
            window.removeEventListener('orientationchange', this.handleResize, false)
        }
    }
}
</script>
