/*
* Shards Vue v1.0.8 (https://designrevision.com/downloads/shards-vue/)
* Based on: Bootstrap ^4.1.3 (https://getbootstrap.com)
* Based on: Shards ^3.0.1 (https://designrevision.com/downloads/shards/)
* Copyright 2017-2026 DesignRevision (https://designrevision.com)
* Copyright 2017-2026 Catalin Vasile (http://catalin.me)
*/
import { openBlock, createElementBlock, normalizeClass, renderSlot, createTextVNode, resolveComponent, createBlock, createCommentVNode, resolveDynamicComponent, mergeProps, withCtx, toDisplayString, Fragment, renderList, toHandlers, Transition, withDirectives, vShow, resolveDirective, createElementVNode, vModelCheckbox, vModelRadio, vModelSelect, normalizeStyle, withModifiers, createVNode, normalizeProps, guardReactiveProps } from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import noUiSlider from 'nouislider';

// Creates the cancelable event props.
function _makeCancelableEventProps() {
    return { enumerable: true, configurable: false, writable: false }
}

/**
 * Custom cancelable event.
 */
class CancelableEvent {
    constructor (type, eventInit = {}) {
        Object.assign(this, CancelableEvent.defaults(), eventInit, { type });

        Object.defineProperties(this, {
            type: _makeCancelableEventProps(),
            cancelable: _makeCancelableEventProps(),
            nativeEvent: _makeCancelableEventProps(),
            target: _makeCancelableEventProps(),
            relatedTarget: _makeCancelableEventProps(),
            vueTarget: _makeCancelableEventProps()
        });

        let defaultPrevented = false;

        this.preventDefault = function preventDefault() {
            if (this.cancelable) {
                defaultPrevented = true;
            }
        };

        Object.defineProperty(this, 'defaultPrevented', {
            enumerable: true,
            get() {
                return defaultPrevented
            }
        });
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

function createEventBus() {
    const listeners = Object.create(null);

    return {
        $on(event, callback) {
            if (!listeners[event]) {
                listeners[event] = new Set();
            }

            listeners[event].add(callback);
        },

        $off(event, callback) {
            if (!listeners[event]) {
                return
            }

            if (callback) {
                listeners[event].delete(callback);
            } else {
                listeners[event].clear();
            }
        },

        $emit(event, ...args) {
            if (!listeners[event]) {
                return
            }

            listeners[event].forEach(callback => callback(...args));
        }
    }
}

const fallbackEventBus = createEventBus();

function installEventBus(app) {
    if (!app || !app.config || !app.config.globalProperties) {
        return fallbackEventBus
    }

    if (!app.config.globalProperties.$shardsVueBus) {
        app.config.globalProperties.$shardsVueBus = createEventBus();
    }

    return app.config.globalProperties.$shardsVueBus
}

function getEventBus(instance) {
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

/*--------------------------------------------------------------------------
/* UTILITY FUNCTIONS
/*--------------------------------------------------------------------------*/


// Register a component plugin.
function registerComponent(app, name, definition) {
    installEventBus(app);
    app._shards_vue_components_ = app._shards_vue_components_ || {};
    const loaded = app._shards_vue_components_[name];

    if (!loaded && definition && name) {
        app._shards_vue_components_[name] = true;
        app.component(name, definition);
    }

    return loaded
}

// Register a group of components.
function registerComponents(app, components) {
    for (let component in components) {
        registerComponent(app, component, components[component]);
    }
}

// Register a directive as being loaded. returns true if directive plugin already registered
function registerDirective(app, name, definition) {
    installEventBus(app);
    app._shards_vue_directives_ = app._shards_vue_directives_ || {};
    const loaded = app._shards_vue_directives_[name];

    if (!loaded && definition && name) {
        app._shards_vue_directives_[name] = true;
        app.directive(name, definition);
    }

    return loaded
}

// Register a group of directives as being loaded.
function registerDirectives(app, directives) {
    for (let directive in directives) {
        registerDirective(app, directive, directives[directive]);
    }
}

// Array check
if (!Array.isArray) {
    Array.isArray = arg => Object.prototype.toString.call(arg) === '[object Array]';
}
const isArray = Array.isArray;

// Element.matches polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            // eslint-disable-next-line
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}

// Converts a value to an array.
function convertToArray(value) {
    if (typeof value === 'string') {
        value = value.split(' ');
    }
    return value
}

// Mocks SVGAnimatedString
let SVGAnimatedString = function () {};
if (typeof window !== 'undefined') {
    SVGAnimatedString = window.SVGAnimatedString;
}

// Generates a GUID
const guid = () => {
    var lut = [];

    for (var i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }

    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;

    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
};


/*--------------------------------------------------------------------------
/* DOM UTILITY FUNCTIONS
/*--------------------------------------------------------------------------*/

// Get an element by id
const getById = (id) => {
    return document.getElementById(/^#/.test(id) ? id.slice(1) : id) || null
};

// Checks whether a variable is a DOM element, or not.
const isElement = el => {
    return el && el.nodeType === Node.ELEMENT_NODE
};

// Checks whether an element has a particular class name, or not.
const hasClass = (el, className) => {
    if (className && isElement(el)) {
        return el.classList.contains(className)
    }

    return false
};

// Adds a class to an element
const addClass = (el, className) => {
    if (className && isElement(el)) {
        el.classList.add(className);
    }
};

// Removes a class from an element
const removeClass = (el, className) => {
    if (className && isElement(el)) {
        el.classList.remove(className);
    }
};

// Removes multiple classes
function removeClasses(el, classes) {
    const newClasses = convertToArray(classes);
    let classList;

    if (el.className instanceof SVGAnimatedString) {
        classList = convertToArray(el.className.baseVal);
    } else {
        classList = convertToArray(el.className);
    }

    newClasses.forEach((newClass) => {
        const index = classList.indexOf(newClass);
        if (index !== -1) {
            classList.splice(index, 1);
        }
    });

    if (el instanceof SVGElement) {
        el.setAttribute('class', classList.join(' '));
    } else {
        el.className = classList.join(' ');
    }
}

// Sets an attribute on an element
const setAttr = (el, attr, value) => {
    if (attr && isElement(el)) {
        el.setAttribute(attr, value);
    }
};

// Removes an attribute from an element
const removeAttr = (el, attr) => {
    if (isElement(el)) {
        el.removeAttribute(attr);
    }
};

// Gets an attribute value from an element
const getAttr = (el, attr) => {
    if (attr && isElement(el)) {
        return el.getAttribute(attr)
    }

    return null
};

// Checks whether an element is disabled, or not.
const isDisabled = el => {
    return !isElement(el)
        || el.disabled
        || el.classList.contains('disabled')
        || Boolean(el.getAttribute('disabled'))
};

// Determines if an HTML element is visible - Faster than CSS check
const isVisible = el => {
    return isElement(el)
        && document.body.contains(el)
        && el.getBoundingClientRect().height > 0
        && el.getBoundingClientRect().width > 0
};

// Selects an element.
const selectElement = (selector, root) => {
    if (!isElement(root)) {
        root = document;
    }

    return root.querySelector(selector) || null
};

// Finds closest element matching selector.
const closest = (selector, root) => {
    if (!isElement(root)) {
        return null
    }

    const Closest = Element.prototype.closest ||
        function (sel) {
            let element = this;
            if (!document.documentElement.contains(element)) {
                return null
            }

            do {
                if (element.matches(sel)) {
                    return element
                }

                element = element.parentElement;
            } while (element !== null)

            return null
        };

    const el = Closest.call(root, selector);

    return el === root ? null : el
};

const getComputedStyles = el => {
    return isElement(el) ? window.getComputedStyle(el) : {}
};

/**
 * Various constants used across the project.
 */

// Theme Colors
const THEMECOLORS = [
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark'
];

/**
 * EVENTS
 */

// Accordion
const COLLAPSE_EVENTS = {
    ACCORDION: 'collapse-accordion',
    TOGGLE: 'collapse-toggle',
    STATE: 'collapse-state'
};

// Modal events
const MODAL_EVENTS = {
    HIDDEN: 'modal-hidden'
};

// Alert Events
const ALERT_EVENTS = {
    DISMISS_COUNTDOWN: 'alert-dismiss-countdown',
    DISMISSED: 'alert-dismissed'
};

// Dropdown Events
const DROPDOWN_EVENTS = {
    SHOWN: 'dropdown-shown',
    SHOW: 'dropdown-show',
    HIDE: 'dropdown-hide',
    HIDDEN: 'dropdown-hidden'
};

// Link Events
const LINK_EVENTS = {
    CLICKED: 'link-clicked'
};

/**
 * TOOLTIP / POPOVER
 */

// Tooltip / Popover placements
const TP_PLACEMENTS = {
    TOP: 'top',
    TOPLEFT: 'topleft',
    TOPRIGHT: 'topright',
    RIGHT: 'right',
    RIGHTTOP: 'righttop',
    RIGHTBOTTOM: 'rightbottom',
    BOTTOM: 'bottom',
    BOTTOMLEFT: 'bottomleft',
    BOTTOMRIGHT: 'bottomright',
    LEFT: 'left',
    LEFTTOP: 'lefttop',
    LEFTBOTTOM: 'leftbottom',
    AUTO: 'auto'
};

// Normalized placements
const N_TP_PLACEMENTS = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left',
    TOPLEFT: 'top',
    TOPRIGHT: 'top',
    RIGHTTOP: 'right',
    RIGHTBOTTOM: 'right',
    BOTTOMLEFT: 'bottom',
    BOTTOMRIGHT: 'bottom',
    LEFTTOP: 'left',
    LEFTBOTTOM: 'left'
};

// Tooltip/Popover offset map
const TP_OFFSET_MAP = {
    AUTO: 0,
    TOPLEFT: -1,
    TOP: 0,
    TOPRIGHT: 1,
    RIGHTTOP: -1,
    RIGHT: 0,
    RIGHTBOTTOM: 1,
    BOTTOMLEFT: -1,
    BOTTOM: 0,
    BOTTOMRIGHT: 1,
    LEFTTOP: -1,
    LEFT: 0,
    LEFTBOTTOM: 1
};

// Popover state classes
const TP_STATE_CLASSES = {
    FADE: 'fade',
    SHOW: 'show'
};

// Popover selectors
const POPOVER_SELECTORS = {
    HEADER: '.popover-header',
    BODY: '.popover-body'
};

// Tooltip selectors
const TOOLTIP_SELECTORS = {
    TOOLTIP_INNER: '.tooltip-inner',
    ARROW: '.arrow'
};

// Tooltip hover state classes
const TOOLTIP_HOVER_STATE_CLASSES = {
    SHOW: 'show',
    OUT: 'out'
};

/**
 * FORMS
 */

 const INPUT_TYPES = [
     'text',
     'password',
     'email',
     'number',
     'tel',
     'url',
     'search',
     'range',
     'color',
     'date',
     'time',
     'datetime',
     'datetime-local',
     'month',
     'week',
     'file'
 ];

 /**
  * EMBEDS
  */

const EMBED_TYPES = [
    'iframe',
    'video',
    'embed',
    'object',
    'img',
    'd-img'
];

const EMBED_ASPECTS = [
    '21by9',
    '16by9',
    '4by3',
    '1by1'
];

// Keycodes
const KEYCODES = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13,
    SPACE: 32
};

var script$Z = {
    name: 'd-button-close',
    emits: ['click'],
    props: {
        /**
         * Whether it should be displayed as disabled, or not.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * The theme color value.
         */
        theme: {
            type: String,
            default: null
        },
        /**
         * The aria-label value.
         */
        ariaLabel: {
            type: String,
            default: 'Close'
        }
    },
    methods: {
        handleClick(e) {
            if (this.disabled && e instanceof Event) {
                e.stopPropagation();
                e.preventDefault();
            }

            this.$emit('click', e);
        }
    }
};

const _hoisted_1$n = ["disabled", "aria-label"];

function render$Z(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("button", {
    class: normalizeClass([ 'close', $props.theme ? `text-${$props.theme}` : '' ]),
    disabled: $props.disabled,
    "aria-label": $props.ariaLabel,
    onClick: _cache[0] || (_cache[0] = (...args) => ($options.handleClick && $options.handleClick(...args)))
  }, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      _cache[1] || (_cache[1] = createTextVNode("×", -1 /* CACHED */))
    ])
  ], 10 /* CLASS, PROPS */, _hoisted_1$n))
}

script$Z.render = render$Z;
script$Z.__file = "src/components/button/ButtonClose.vue";

var script$Y = {
    name: 'd-alert',
    components: {
        dButtonClose: script$Z
    },
    emits: ['update:modelValue', 'update:show', 'input', ALERT_EVENTS.DISMISSED, ALERT_EVENTS.DISMISS_COUNTDOWN],
    props: {
        /**
         * Alert color theme.
         */
        theme: {
            type: String,
            default: 'primary',
            validator: v => THEMECOLORS.includes(v)
        },
        /**
         * Whether the alert is dismissible, or not.
         */
        dismissible: {
            type: Boolean,
            default: false
        },
        /**
         * Dismiss button label.
         */
        dismissLabel: {
            type: String,
            default: 'Close'
        },
        /**
         * Show state or duration.
         */
        modelValue: {
            type: [Boolean, Number, String],
            default: undefined
        },
        show: {
            type: [Boolean, Number, String],
            default: false
        }
    },
    data() {
        return {
            timer: null,
            dismissed: false
        }
    },
    watch: {
        computedShowValue() {
            this.showChanged();
        }
    },
    mounted() {
        this.showChanged();
    },
    beforeUnmount() {
        this.clearCounter();
    },
    computed: {
        computedShowValue() {
            return this.modelValue !== undefined ? this.modelValue : this.show
        },
        computedShow() {
            return !this.dismissed && (this.timer || this.computedShowValue);
        }
    },
    methods: {
        clearCounter() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },

        dismiss() {
            this.clearCounter();
            this.dismissed = true;

            /**
             * Alert dismissed event.
             *
             * @event alert-dismissed
             * @type {Boolean}
             */
            this.$emit(ALERT_EVENTS.DISMISSED);
            this.$emit('update:modelValue', false);
            this.$emit('update:show', false);
            this.$emit('input', false);

            if (typeof this.computedShowValue === 'boolean') {
                return;
            }

            /**
             * Alert dismiss countdown event.
             *
             * @event alert-dismiss-countdown
             * @type {Number}
             */
            this.$emit(ALERT_EVENTS.DISMISS_COUNTDOWN, 0);
            this.$emit('update:modelValue', 0);
            this.$emit('update:show', 0);
            this.$emit('input', 0);
        },

        showChanged() {
            this.clearCounter();
            this.dismissed = false;

            if (typeof this.computedShowValue === 'boolean' || this.computedShowValue === null || this.computedShowValue === 0)
                return

            let dismissTimer = this.computedShowValue;
            this.timer = setInterval(() => {
                if (dismissTimer < 1) {
                    this.dismiss();
                    return;
                }

                dismissTimer--;

                /**
                 * Alert dismiss countdown event.
                 *
                 * @event alert-dismiss-countdown
                 * @type {Number}
                 */
                this.$emit(ALERT_EVENTS.DISMISS_COUNTDOWN, dismissTimer);
                this.$emit('update:modelValue', dismissTimer);
                this.$emit('update:show', dismissTimer);
                this.$emit('input', dismissTimer);
            }, 1000);
        }
    }
};

function render$Y(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_d_button_close = resolveComponent("d-button-close");

  return ($options.computedShow)
    ? (openBlock(), createElementBlock("div", {
        key: 0,
        role: "alert",
        "aria-live": "polite",
        "aria-atomic": "true",
        class: normalizeClass([
            'alert',
            $props.theme ? `alert-${$props.theme}` : '',
            $props.dismissible ? `alert-dismissible` : ''
        ])
      }, [
        renderSlot(_ctx.$slots, "default"),
        ($props.dismissible)
          ? (openBlock(), createBlock(_component_d_button_close, {
              key: 0,
              "aria-label": $props.dismissLabel,
              onClick: $options.dismiss,
              href: "#"
            }, null, 8 /* PROPS */, ["aria-label", "onClick"]))
          : createCommentVNode("v-if", true)
      ], 2 /* CLASS */))
    : createCommentVNode("v-if", true)
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$d = "\n.close[data-v-7b926c69] {\n    min-height: 100%;\n    padding: 0.625rem 1.25rem 0.75rem 1.25rem;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFsZXJ0LnZ1ZSUzRnZ1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9N2I5MjZjNjkmc2NvcGVkPXRydWUmbGFuZy5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBO0lBQ0ksZ0JBQWdCO0lBQ2hCLHlDQUF5QztBQUM3QyIsImZpbGUiOiJBbGVydC52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD03YjkyNmM2OSZzY29wZWQ9dHJ1ZSZsYW5nLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLmNsb3NlW2RhdGEtdi03YjkyNmM2OV0ge1xuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XG4gICAgcGFkZGluZzogMC42MjVyZW0gMS4yNXJlbSAwLjc1cmVtIDEuMjVyZW07XG59XG4iXX0= */";
styleInject(css_248z$d);

script$Y.render = render$Y;
script$Y.__scopeId = "data-v-7b926c69";
script$Y.__file = "src/components/alert/Alert.vue";

const components$u = {
    dAlert: script$Y
};

const VuePlugin$w = {
  install (Vue) {
    registerComponents(Vue, components$u);
  }
};

const _DR_RL_ = '_DR_RL_';

var rootListenerMixin = {
    methods: {
        listenOnRoot(event, callback) {
            if (!this[_DR_RL_] || !isArray(this[_DR_RL_])) {
                this[_DR_RL_] = [];
            }

            const bus = getEventBus(this);
            const boundCallback = callback.bind(this);

            this[_DR_RL_].push({ event, callback: boundCallback });
            bus.$on(event, boundCallback);

            return this
        },
        emitOnRoot(event, ...args) {
            getEventBus(this).$emit(event, ...args);
            return this
        }
    },
    beforeUnmount() {
        if (!this[_DR_RL_] || !isArray(this[_DR_RL_])) {
            return
        }

        const bus = getEventBus(this);

        while (this[_DR_RL_].length > 0) {
            const { event, callback } = this[_DR_RL_].shift();
            bus.$off(event, callback);
        }
    }
};

var script$X = {
    name: 'd-link',
    emits: ['click'],
    mixins: [ rootListenerMixin ],
    props: {
        /**
         * The link href.
         */
        href: {
            type: String,
            default: null
        },
        /**
         * The router location.
         */
        to: {
            type: [String, Object],
            default: null
        },
        /**
         * Whether the link is disabled, or not.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * The link target.
         */
        target: {
            type: String,
            default: '_self'
        },
        /**
         * The link rel.
         */
        rel: {
            type: String,
            default: null
        },
        /**
         * Whether the route is exact, or not.
         */
        exact: {
            type: Boolean,
            default: false
        },
        /**
         * The class name attached when the route is exact,
         */
        exactActiveClass: {
            type: String
        },
        /**
         * Whether the link is active, or not.
         */
        active: {
            type: Boolean,
            default: false
        },
        /**
         * The class applied when the link is active.
         */
        activeClass: {
            type: String
        },
        /**
         * The component tag.
         */
        tag: {
            type: String,
            default: 'a'
        }
    },
    computed: {
        computedTag() {
            return this.to
                && !this.disabled
                && Boolean(this.$router) ? 'router-link' : 'a'
        },
        computedRel() {
            return this.target === '_blank'
                && this.rel === null ? 'noopener' : this.rel || null
        },
        computedHref() {
            if (this.computedTag === 'router-link') {
                return;
            }

            if (this.href) {
                return this.href;
            }

            if (this.to) {
                if (typeof this.to === 'string') {
                    return this.to;
                }

                if (typeof this.to === 'object' && this.to.path) {
                    return this.to.path;
                }
            }

            return '#';
        },
        computedTabindex() {
            return this.disabled ? '-1' : (this.$attrs ? this.$attrs.tabindex : null);
        },
        computedAriaDisabled() {
            return (this.tag === 'a' && this.disabled) ? 'true' : null;
        }
    },
    methods: {
        handleClick(event) {
            const isRouterLink = this.computedTag === 'router-link';

            if (this.disabled && event instanceof Event) {
                event.stopPropagation();
                event.stopImmediatePropagation();
            } else {
                this.$emit('click', event);
                this.emitOnRoot(LINK_EVENTS.CLICKED, event);
            }

            if ((!isRouterLink && this.computedHref === '#') || this.disabled) {
                event.preventDefault();
            }
        }
    }
};

function render$X(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($options.computedTag), mergeProps(_ctx.$props, {
    rel: $options.computedRel,
    href: $options.computedHref,
    target: $props.target,
    to: $props.to,
    tabindex: $options.computedTabindex,
    class: [
            $props.active ? ($props.exact ? $props.exactActiveClass : $props.activeClass) : '',
            $props.disabled ? 'disabled' : ''
        ],
    "aria-disabled": $options.computedAriaDisabled,
    onClick: $options.handleClick
  }), {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default", {}, () => [
        _cache[0] || (_cache[0] = createTextVNode("Link", -1 /* CACHED */))
      ])
    ]),
    _: 3 /* FORWARDED */
  }, 16 /* FULL_PROPS */, ["rel", "href", "target", "to", "tabindex", "class", "aria-disabled", "onClick"]))
}

script$X.render = render$X;
script$X.__file = "src/components/link/Link.vue";

function createLinkProps() {
    return {
        href: {
            type: String,
            default: null
        },
        to: {
            type: [String, Object],
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        },
        target: {
            type: String,
            default: '_self'
        },
        rel: {
            type: String,
            default: null
        },
        exact: {
            type: Boolean,
            default: false
        },
        exactActiveClass: {
            type: String
        },
        active: {
            type: Boolean,
            default: false
        },
        activeClass: {
            type: String
        },
        tag: {
            type: String,
            default: 'a'
        },
        routerTag: {
            type: String,
            default: 'a'
        },
        event: {
            type: [String, Array],
            default: 'click'
        },
        append: {
            type: Boolean,
            default: false
        }
    }
}

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
var script$W = {
    name: 'd-badge',
    components: {
        dLink: script$X
    },
    props: {...createLinkProps(), ...{
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'span'
        },
        /**
         * The theme color.
         */
        theme: {
            type: String,
            default: 'primary',
            validator: v => THEMECOLORS.includes(v)
        },
        /**
         * Whether it should be displayed as a pill, or not.
         */
        pill: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed with an outline, or not.
         */
        outline: {
            type: Boolean,
            default: false
        }
    }},
    computed: {
        computedTag() {
            return this.href || this.to ? 'd-link' : this.tag
        }
    }
};

function render$W(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($options.computedTag), {
    class: normalizeClass([
        'badge',
        _ctx.theme && !_ctx.outline ? `badge-${_ctx.theme}` : '',
        _ctx.outline ? `badge-outline-${_ctx.theme}` : '',
        _ctx.pill ? `badge-pill` : '',
    ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$W.render = render$W;
script$W.__file = "src/components/badge/Badge.vue";

const components$t = {
    dBadge: script$W
};

const VuePlugin$v = {
  install (Vue) {
    registerComponents(Vue, components$t);
  }
};

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
var script$V = {
    name: 'd-breadcrumb-link',
    components: {
        dLink: script$X
    },
    props: {...createLinkProps(), ...{
        /**
         * The breadcrumb link text.
         */
        text: {
            type: String,
            default: null
        },
        /**
         * The active state.
         */
        active: {
            type: Boolean,
            default: false
        },
        /**
         * The href.
         */
        href: {
            type: String,
            default: '#'
        },
        /**
         * The aria-current state.
         */
        ariaCurrent: {
            type: String,
            default: 'location'
        }
    }},
    computed: {
        computedTag() {
            return this.active ? 'span' : 'd-link'
        }
    }
};

function render$V(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($options.computedTag), {
    innerHTML: _ctx.text,
    "aria-current": _ctx.ariaCurrent,
    href: _ctx.href
  }, null, 8 /* PROPS */, ["innerHTML", "aria-current", "href"]))
}

script$V.render = render$V;
script$V.__file = "src/components/breadcrumb/BreadcrumbLink.vue";

var script$U = {
    name: 'd-breadcrumb-item',
    components: {
        BreadcrumbLink: script$V
    },
    props: {
        /**
         * The breadcrumb item text.
         */
        text: {
            type: String,
            default: null
        },
        /**
         * The breadcrumb item href.
         */
        href: {
            type: String,
            default: '#'
        },
        /**
         * Whether it is active, or not.
         */
        active: {
            type: Boolean,
            default: false
        }
    }
};

const _hoisted_1$m = { key: 1 };

function render$U(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BreadcrumbLink = resolveComponent("BreadcrumbLink");

  return (openBlock(), createElementBlock("li", {
    class: normalizeClass([ 'breadcrumb-item', $props.active ? 'active' : '' ]),
    role: "presentation"
  }, [
    (!$props.active)
      ? (openBlock(), createBlock(_component_BreadcrumbLink, {
          key: 0,
          text: $props.text,
          href: $props.href
        }, null, 8 /* PROPS */, ["text", "href"]))
      : createCommentVNode("v-if", true),
    ($props.active)
      ? (openBlock(), createElementBlock("span", _hoisted_1$m, toDisplayString($props.text), 1 /* TEXT */))
      : createCommentVNode("v-if", true)
  ], 2 /* CLASS */))
}

script$U.render = render$U;
script$U.__file = "src/components/breadcrumb/BreadcrumbItem.vue";

var script$T = {
    name: 'd-breadcrumb',
    components: {
        BreadcrumbItem: script$U
    },
    props: {
        /**
         * The breadcrumb items array.
         */
        items: {
            type: Array,
            default: null
        }
    },
    computed: {
        computedItems() {
            let isActiveDefined = false;

            if (!this.items || !this.items.length) {
                return []
            }

            return this.items.map((item, idx) => {
                if (typeof item !== 'object') {
                    item = { text: item };
                }

                if (item.active) {
                    isActiveDefined = true;
                }

                if (!item.active && !isActiveDefined) {
                    item.active = idx + 1 === this.items.length;
                }

                return item
            })
        }
    }
};

const _hoisted_1$l = { class: "breadcrumb" };

function render$T(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BreadcrumbItem = resolveComponent("BreadcrumbItem");

  return (openBlock(), createElementBlock("ol", _hoisted_1$l, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.computedItems, (item, index) => {
      return (openBlock(), createBlock(_component_BreadcrumbItem, {
        key: `dr-breadcrumb-${index}`,
        active: item.active,
        text: item.text,
        href: item.href
      }, null, 8 /* PROPS */, ["active", "text", "href"]))
    }), 128 /* KEYED_FRAGMENT */)),
    renderSlot(_ctx.$slots, "default")
  ]))
}

script$T.render = render$T;
script$T.__file = "src/components/breadcrumb/Breadcrumb.vue";

const components$s = {
    dLink: script$X,
    dBreadcrumb: script$T,
    dBreadcrumbItem: script$U,
    dBreadcrumbLink: script$V
};

const VuePlugin$u = {
  install (Vue) {
    registerComponents(Vue, components$s);
  }
};

var script$S = {
    name: 'd-button',
    emits: ['click'],
    props: {
        /**
         * The theme style.
         */
        theme: {
            type: String,
            validator: v => THEMECOLORS.includes(v),
            default: 'primary'
        },
        /**
         * Whether it should be displayed as an outline, or not.
         */
        outline: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed as a pill, or not.
         */
        pill: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed as a squared, or not.
         */
        squared: {
            type: Boolean,
            default: false
        },
        /**
         * The button's sizesize.
         */
        size: {
            type: String,
            validator: v => ['sm', 'lg', null].includes(v),
            default: null
        },
        /**
         * Whether it should be displayed as block, or not.
         */
        blockLevel: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed as disabled, or not.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed as active, or not.
         */
        active: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        sizeClass() {
            if (this.size && this.size !== '') {
                return `btn-${this.size}`;
            }

            return this.size;
        },

        themeClass() {
            return this.theme ? `btn-${this.outline ? 'outline-' : ''}${this.theme}` : '';
        }
    },
    methods: {
        /**
         * Triggered when the button is clicked.
         *
         * @event click
         */
        handleClick(e) {
            this.$emit('click', e);
        }
    }
};

const _hoisted_1$k = ["disabled", "aria-pressed"];

function render$S(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("button", {
    class: normalizeClass(["btn", [
            $options.themeClass,
            $options.sizeClass,
            $props.pill ? 'btn-pill' : '',
            $props.squared ? 'btn-squared' : '',
            $props.blockLevel ? 'btn-block' : '',
            $props.active ? 'active' : ''
        ]]),
    onClick: _cache[0] || (_cache[0] = (...args) => ($options.handleClick && $options.handleClick(...args))),
    disabled: this.disabled,
    "aria-pressed": this.active
  }, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      _cache[1] || (_cache[1] = createTextVNode("Button", -1 /* CACHED */))
    ])
  ], 10 /* CLASS, PROPS */, _hoisted_1$k))
}

script$S.render = render$S;
script$S.__file = "src/components/button/Button.vue";

const components$r = {
    dButton: script$S,
    dBtn: script$S,
    dButtonClose: script$Z,
    dBtnClose: script$Z
};

const VuePlugin$t = {
  install (Vue) {
    registerComponents(Vue, components$r);
  }
};

var script$R = {
    name: 'd-button-group',
    props: {
        /**
         * Whether it is a vertical button group, or not.
         */
        vertical: {
            type: Boolean,
            default: false
        },
        /**
         * The button group size.
         */
        size: {
            type: String,
            validator: v => ['small', 'large', null].includes(v),
            default: null
        },
        /**
         * The button group's aria role.
         */
        ariaRole: {
            type: String,
            default: 'group'
        },
        /**
         * The button group's aria label.
         */
        ariaLabel: {
            type: String,
            default: 'Button group'
        }
    },
    computed: {
        btnGroupSizeClass() {
            const buttonGroupSizes = { small: 'sm', large: 'lg' };

            if (this.size !== '') {
                return `btn-group-${buttonGroupSizes[this.size]}`;
            }

            return this.size;
        }
    }
};

const _hoisted_1$j = ["aria-role", "aria-label"];

function render$R(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", {
    class: normalizeClass([
            $options.btnGroupSizeClass,
            $props.vertical ? 'btn-group-vertical' : 'btn-group'
        ]),
    "aria-role": $props.ariaRole,
    "aria-label": $props.ariaLabel
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 10 /* CLASS, PROPS */, _hoisted_1$j))
}

var css_248z$c = ".btn-group-vertical .btn + .btn[data-v-0c139bf2] {\n  margin-left: 0 !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJ1dHRvbkdyb3VwLnZ1ZSUzRnZ1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9MGMxMzliZjImc2NvcGVkPXRydWUmbGFuZy5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSx5QkFBeUI7QUFDM0IiLCJmaWxlIjoiQnV0dG9uR3JvdXAudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9MGMxMzliZjImc2NvcGVkPXRydWUmbGFuZy5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYnRuLWdyb3VwLXZlcnRpY2FsIC5idG4gKyAuYnRuW2RhdGEtdi0wYzEzOWJmMl0ge1xuICBtYXJnaW4tbGVmdDogMCAhaW1wb3J0YW50O1xufSJdfQ== */";
styleInject(css_248z$c);

script$R.render = render$R;
script$R.__scopeId = "data-v-0c139bf2";
script$R.__file = "src/components/button-group/ButtonGroup.vue";

const components$q = {
    dButtonGroup: script$R,
    sBtnGroup: script$R
};

const VuePlugin$s = {
  install (Vue) {
    registerComponents(Vue, components$q);
  }
};

var script$Q = {
    name: 'd-button-toolbar',
    props: {
        /**
         * Button toolbar aria role.
         */
        ariaRole: {
            type: String,
            default: 'toolbar'
        },
        /**
         * Button toolbar aria label.
         */
        ariaLabel: {
            type: String,
            default: 'Button toolbar'
        }
    }
};

const _hoisted_1$i = ["aria-role", "aria-label"];

function render$Q(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", {
    class: "btn-toolbar",
    "aria-role": $props.ariaRole,
    "aria-label": $props.ariaLabel
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 8 /* PROPS */, _hoisted_1$i))
}

script$Q.render = render$Q;
script$Q.__file = "src/components/button-toolbar/ButtonToolbar.vue";

const components$p = {
    dButtonToolbar: script$Q,
    dBtnToolbar: script$Q
};

const VuePlugin$r = {
  install (Vue) {
    registerComponents(Vue, components$p);
  }
};

var script$P = {
    name: 'd-card',
    props: {
        /**
         * Element tag type.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Background theme color.
         */
        bgTheme: {
            type: String,
            default: null
        },
        /**
         * Border theme color.
         */
        borderTheme: {
            type: String,
            default: null
        },
        /**
         * Text theme color.
         */
        textTheme: {
            type: String,
            default: null
        },
        /**
         * Alignment
         */
        align: {
            type: String,
            default: null
        }
    }
};

function render$P(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), mergeProps(_ctx.$attrs, toHandlers(_ctx.$listeners), {
    class: [
            'card',
            Boolean($props.align) ? `text-${$props.align}` : '',
            Boolean($props.bgTheme) ? `bg-${$props.bgTheme}` : '',
            Boolean($props.borderTheme) ? `border-${$props.borderTheme}` : '',
            Boolean($props.textTheme) ? `text-${$props.textTheme}` : ''
        ]
  }), {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 16 /* FULL_PROPS */, ["class"]))
}

script$P.render = render$P;
script$P.__file = "src/components/card/Card.vue";

var script$O = {
    name: 'd-card-body',
    props: {
        /**
         * Element tag type.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Background theme color.
         */
        bgTheme: {
            type: String,
            default: null
        },
        /**
         * Border theme color.
         */
        borderTheme: {
            type: String,
            default: null
        },
        /**
         * Text theme color.
         */
        textTheme: {
            type: String,
            default: null
        },
        /**
         * Body class.
         */
        bodyClass: {
            type: String,
            default: ''
        },
        /**
         * Body title value.
         */
        title: {
            type: String,
            default: null
        },
        /**
         * Body title element tag type.
         */
        titleTag: {
            type: String,
            default: 'h4'
        },
        /**
         * Body subtitle value.
         */
        subtitle: {
            type: String,
            default: null
        },
        /**
         * Body subtitle element tag type.
         */
        subtitleTag: {
            type: String,
            default: 'h6'
        },
        /**
         * Overlay.
         */
        overlay: {
            type: Boolean,
            default: false
        }
    }
};

function render$O(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
        'card-body',
        $props.overlay ? 'card-img-overlay' : '',
        Boolean($props.bgTheme) ? `bg-${$props.bgTheme}` : '',
        Boolean($props.borderTheme) ? `border-${$props.borderTheme}` : '',
        Boolean($props.textTheme) ? `text-${$props.textTheme}` : '',
        $props.bodyClass
    ])
  }, {
    default: withCtx(() => [
      ($props.title)
        ? (openBlock(), createBlock(resolveDynamicComponent($props.titleTag), {
            key: 0,
            class: "card-title",
            innerHTML: $props.title
          }, null, 8 /* PROPS */, ["innerHTML"]))
        : createCommentVNode("v-if", true),
      ($props.subtitle)
        ? (openBlock(), createBlock(resolveDynamicComponent($props.subtitleTag), {
            key: 1,
            class: "card-subtitle mb-2 text-muted",
            innerHTML: $props.subtitle
          }, null, 8 /* PROPS */, ["innerHTML"]))
        : createCommentVNode("v-if", true),
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$O.render = render$O;
script$O.__file = "src/components/card/CardBody.vue";

var script$N = {
    name: 'd-card-footer',
    props: {
        /**
         * Element tag type.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Background theme color.
         */
        bgTheme: {
            type: String,
            default: null
        },
        /**
         * Border theme color.
         */
        borderTheme: {
            type: String,
            default: null
        },
        /**
         * Text theme color.
         */
        textTheme: {
            type: String,
            default: null
        },
        /**
         * Footer value.
         */
        footer: {
            type: String,
            default: null
        },
        /**
         * Footer class.
         */
        footerClass: {
            type: String,
            default: ''
        }
    }
};

function render$N(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
        'card-footer',
        Boolean($props.bgTheme) ? `bg-${$props.bgTheme}` : '',
        Boolean($props.borderTheme) ? `border-${$props.borderTheme}` : '',
        Boolean($props.textTheme) ? `text-${$props.textTheme}` : '',
        $props.footerClass
    ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$N.render = render$N;
script$N.__file = "src/components/card/CardFooter.vue";

var script$M = {
    name: 'd-card-group',
    props: {
        /**
         * Component tag type.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether it should be displayed as a deck, or not.
         */
        deck: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be displayed as columns, or not.
         */
        columns: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedClass() {
            if (this.columns) {
                return 'card-columns'
            }

            if (this.deck) {
                return 'card-deck'
            }

            return 'card-group'
        }
    }
};

function render$M(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass($options.computedClass)
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$M.render = render$M;
script$M.__file = "src/components/card/CardGroup.vue";

var script$L = {
    name: 'd-card-header',
    props: {
        /**
         * Element tag type.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Background theme color.
         */
        bgTheme: {
            type: String,
            default: null
        },
        /**
         * Border theme color.
         */
        borderTheme: {
            type: String,
            default: null
        },
        /**
         * Text theme color.
         */
        textTheme: {
            type: String,
            default: null
        },
        /**
         * Header value.
         */
        header: {
            type: String,
            default: null
        },
        /**
         * Header class.
         */
        headerClass: {
            type: String,
            default: ''
        }
    }
};

function render$L(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
        'card-header',
        Boolean($props.bgTheme) ? `bg-${$props.bgTheme}` : '',
        Boolean($props.borderTheme) ? `border-${$props.borderTheme}` : '',
        Boolean($props.textTheme) ? `text-${$props.textTheme}` : '',
        $props.headerClass
    ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$L.render = render$L;
script$L.__file = "src/components/card/CardHeader.vue";

var script$K = {
    name: 'd-card-img',
    props: {
        /**
         * The image source.
         */
        src: {
            type: String,
            default: null,
            required: true
        },
        /**
         * Alternative image text.
         */
        alt: {
            type: String,
            default: null
        },
        /**
         * Top positioned.
         */
        top: {
            type: Boolean,
            default: false
        },
        /**
         * Bottom positioned.
         */
        bottom: {
            type: Boolean,
            default: false
        },
        /**
         * Fluid display.
         */
        fluid: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedClass() {
            let _classList = [];

            _classList.push(this.fluid ? 'img-fluid' : '');

            if (this.top && !this.bottom) {
                _classList.push('card-img-top');
            }

            if (this.bottom && !this.top) {
                _classList.push('card-img-bottom');
            }

            return _classList
        }
    }
};

const _hoisted_1$h = ["src", "alt"];

function render$K(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("img", {
    class: normalizeClass($options.computedClass),
    src: $props.src,
    alt: $props.alt
  }, null, 10 /* CLASS, PROPS */, _hoisted_1$h))
}

script$K.render = render$K;
script$K.__file = "src/components/card/CardImg.vue";

const components$o = {
    dCard: script$P,
    dCardBody: script$O,
    dCardFooter: script$N,
    dCardGroup: script$M,
    dCardHeader: script$L,
    dCardImg: script$K
};

const VuePlugin$q = {
  install (Vue) {
    registerComponents(Vue, components$o);
  }
};

var script$J = {
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
                this.show = newVal;
            }
        },
        show(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.emitStateChange();
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
            this.show = !this.show;
        },
        emitStateChange() {
            this.$emit('update:modelValue', this.show);
            this.$emit('update:visible', this.show);
            this.$emit('input', this.show);
            this.emitOnRoot(COLLAPSE_EVENTS.STATE, this.id, this.show);

            if (this.accordion && this.show) {
                /**
                 * Triggered when the accordion is collapsed.
                 *
                 * @event accordion-collapse
                 */
                this.emitOnRoot(COLLAPSE_EVENTS.ACCORDION, this.id, this.accordion);
            }

        },
        handleClick(e) {
            const el = e.target;
            if (!this.isNav || !el || getComputedStyle(this.$el).display !== 'block') {
                return
            }

            if (hasClass(el, 'nav-link') || hasClass(el, 'dropdown-item')) {
                this.show = false;
            }
        },
        handleToggleEvent(e) {
            if (e !== this.id) {
                return
            }

            this.toggle();
        },
        handleAccordionEvent(id, acc) {
            if (!this.accordion || acc !== this.accordion) {
                return
            }

            if (id === this.id) {
                if(!this.show) {
                    this.toggle();
                }
            } else {
                if(this.show) {
                    this.toggle();
                }
            }
        },
        handleResize() {
            this.show = (getComputedStyle(this.$el).display === 'block');
        },
        onEnter(el) {
            el.style.height = 0;
            isElement(el) && el.offsetHeight;
            el.style.height = el.scrollHeight + 'px';
            this.transitioning = true;
            /**
             * Triggered on show.
             *
             * @event show
             */
            this.$emit('show');
        },
        onAfterEnter(el) {
            el.style.height = null;
            this.transitioning = false;
            /**
             * Triggered after show.
             *
             * @event shown
             */
            this.$emit('shown');
        },
        onLeave(el) {
            el.style.height = 'auto';
            el.style.display = 'block';
            el.style.height = el.getBoundingClientRect().height + 'px';
            isElement(el) && el.offsetHeight;
            this.transitioning = true;
            el.style.height = 0;
            /**
             * Triggered on hide.
             *
             * @event hide
             */
            this.$emit('hide');
        },
        onAfterLeave(el) {
            el.style.height = null;
            this.transitioning = false;
            /**
             * Triggered when hidden.
             *
             * @event hidden
             */
            this.$emit('hidden');
        }
    },
    created() {
        this.listenOnRoot(COLLAPSE_EVENTS.TOGGLE, this.handleToggleEvent);
        this.listenOnRoot(COLLAPSE_EVENTS.ACCORDION, this.handleAccordionEvent);
    },
    mounted() {
        if (this.isNav && typeof document !== 'undefined') {
            window.addEventListener('resize', this.handleResize, false);
            window.addEventListener('orientationchange', this.handleResize, false);
            this.handleResize();
        }

        this.emitStateChange();
    },
    beforeUnmount() {
        if (this.isNav && typeof document !== 'undefined') {
            window.removeEventListener('resize', this.handleResize, false);
            window.removeEventListener('orientationchange', this.handleResize, false);
        }
    }
};

function render$J(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(Transition, {
    enterActiveClass: 'collapsing',
    leaveActiveClass: 'collapsing',
    onEnter: $options.onEnter,
    onAfterEnter: $options.onAfterEnter,
    onLeave: $options.onLeave,
    onAfterLeave: $options.onAfterLeave,
    persisted: ""
  }, {
    default: withCtx(() => [
      withDirectives((openBlock(), createBlock(resolveDynamicComponent($props.tag), {
        class: normalizeClass([
                $props.isNav ? 'navbar-collapse' : '',
                !$data.transitioning ? 'collapse' : '',
                $data.show && !$data.transitioning ? 'show' : ''
            ]),
        id: [ $props.id ? $props.id : '' ],
        onClick: $options.handleClick
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3 /* FORWARDED */
      }, 8 /* PROPS */, ["class", "id", "onClick"])), [
        [vShow, $data.show]
      ])
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"]))
}

script$J.render = render$J;
script$J.__file = "src/components/collapse/Collapse.vue";

const components$n = {
    dCollapse: script$J
};

const VuePlugin$p = {
  install (Vue) {
    registerComponents(Vue, components$n);
  }
};

var script$I = {
    name: 'd-container',
    props: {
        /**
         * Container element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether the container is fluid or not.
         */
        fluid: {
            type: Boolean,
            default: false
        }
    }
};

function render$I(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
            !$props.fluid ? 'container' : 'container-fluid'
        ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$I.render = render$I;
script$I.__file = "src/components/container/Container.vue";

const ALIGNMENT = ['start', 'end', 'center'];

/**
 * The row subcomponent.
 */
var script$H = {
    name: 'd-row',
    props: {
        /**
         * Row element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether to remove gutters, or not.
         */
        noGutters: {
            type: Boolean,
            default: false
        },
        /**
         * Align items vertically.
         */
        alignV: {
            type: String,
            default: null,
            validator: v => ALIGNMENT.concat(['baseline', 'stretch']).includes(v)
        },
        /**
         * Justify content horizontally.
         */
        alignH: {
            type: String,
            default: null,
            validator: v => ALIGNMENT.concat(['between', 'around']).includes(v)
        },
        /**
         * Align content.
         */
        alignContent: {
            type: String,
            default: null,
            validator: v => ALIGNMENT.concat(['between', 'around', 'stretch']).includes(v)
        }
    }
};

function render$H(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass(["row", [
            $props.noGutters ? 'no-gutters' : '',
            $props.alignV ? `align-items-${$props.alignV}` : '',
            $props.alignH ? `justify-content-${$props.alignH}` : '',
            $props.alignContent ? `align-content-${$props.alignContent}` : ''
        ]])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$H.render = render$H;
script$H.__file = "src/components/container/Row.vue";

const suffixPropName = (suffix, str) => str + (suffix ? upperFirst(suffix) : '');
const upperFirst = (str) => String(str).charAt(0).toUpperCase() + String(str).slice(1);

// Creates Bootstrap specific breakpoint classes.
const createBreakpointClass = (type, breakpoint, val) => {
    if (!!val === false) {
        return false
    }

    let className = type;

    if (breakpoint) {
        className += `-${breakpoint.replace(type, '')}`; // -md ?
    }

    if (type === 'col' && (val === '' || val === true)) {
        return className.toLowerCase() // .col-md
    }

    return `${className}-${val}`.toLowerCase()
};

// Generates component properties.
function generateProp(type = [Boolean, String, Number], defaultVal = null) {
    return {
        default: defaultVal,
        type
    }
}

// Breakpoints for later use.
const BREAKPOINTS = ['sm', 'md', 'lg', 'xl'];

// Generate breakpoint maps.
const breakpointCol = createBreakpointMap([String, Number, Boolean], false);
const breakpointOffset = createBreakpointMap([String, Number], null, suffixPropName, 'offset');
const breakpointOrder = createBreakpointMap([String, Number], null, suffixPropName, 'order');

// Creates breakpoint maps
function createBreakpointMap(propGenArgs = null, defaultValue, breakpointWrapper = null, ...breakpointWrapperArgs) {
    breakpointWrapper = breakpointWrapper === null ? (v) => v : breakpointWrapper;
    return BREAKPOINTS.reduce(function (map, breakpoint) {
        map[breakpointWrapper(breakpoint, ...breakpointWrapperArgs)] = generateProp(propGenArgs, defaultValue);
        return map
    }, {})
}

// Define breakpoint props map
const breakpointPropMap = Object.assign({}, {
    col: Object.keys(breakpointCol),
    offset: Object.keys(breakpointOffset),
    order: Object.keys(breakpointOrder)
});

var script$G = {
    name: 'd-col',
    props: Object.assign({},
        breakpointCol,
        breakpointOffset,
        breakpointOrder, {
            /**
             * The col element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * Automatic column.
             */
            col: {
                type: Boolean,
                default: false
            },
            /**
             * Make the component span a certain no. of columns.
             */
            cols: generateProp([String, Number]),
            /**
             * Offset certain no. of columns.
             */
            offset: generateProp([String, Number]),
            order: generateProp([String, Number]),
            alignSelf: {
                type: String,
                default: null,
                validator: v => ['auto', 'start', 'end', 'center', 'baseline', 'stretch'].includes(v)
            }
        }),
    computed: {
        breakpointClasses() {
            const classList = [];
            for (const type in breakpointPropMap) {
                const keys = breakpointPropMap[type];
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const breakpointClass = createBreakpointClass(type, key, this[key]);

                    if (breakpointClass && classList.indexOf(breakpointClass) === -1) {
                        classList.push(breakpointClass);
                    }
                }
            }

            return classList
        }
    }
};

function render$G(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent(_ctx.tag), {
    class: normalizeClass([
            $options.breakpointClasses,
            (_ctx.col || ($options.breakpointClasses.length === 0 && !_ctx.cols)) ? 'col' : '',
            _ctx.cols ? `col-${_ctx.cols}` : '',
            _ctx.offset ? `offset-${_ctx.offset}` : '',
            _ctx.order ? `order-${_ctx.order}` : '',
            _ctx.alignSelf ? `align-self-${_ctx.alignSelf}` : ''
        ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$G.render = render$G;
script$G.__file = "src/components/container/Col.vue";

const components$m = {
    dContainer: script$I,
    dRow: script$H,
    dCol: script$G,
};

const VuePlugin$o = {
  install (Vue) {
    registerComponents(Vue, components$m);
  }
};

var css_248z$b = ".dp--btn-base{font:inherit;transition:var(--dp-common-transition);border:none;line-height:normal}.dp--bg-none{background:0 0}.dp--active{background:var(--dp-primary-color);color:var(--dp-primary-text-color)}.dp--flex{align-items:center;display:flex}.dp--pointer{cursor:pointer}.dp--icon{stroke:currentColor;fill:currentColor}.dp--button{text-align:center;width:100%;color:var(--dp-icon-color);cursor:pointer;padding:var(--dp-common-padding);box-sizing:border-box;height:var(--dp-button-height);place-content:center;align-items:center;display:flex}.dp--button.dp--overlay-action{position:absolute;bottom:0}.dp--button .dp--main{font-family:var(--dp-font-family);-webkit-user-select:none;user-select:none;box-sizing:border-box;width:100%;position:relative}.dp--button .dp--main *{direction:var(--dp-direction,ltr)}.dp--button:hover{background:var(--dp-hover-color);color:var(--dp-hover-icon-color)}.dp--button svg{height:var(--dp-button-icon-height);width:auto}.dp--button-bottom{border-bottom-left-radius:var(--dp-border-radius);border-bottom-right-radius:var(--dp-border-radius)}.dp--flex-display{display:flex}.dp--relative{position:relative}.dp--highlighted{background-color:var(--dp-highlight-color)}.dp--hidden-el{visibility:hidden}.dp--centered{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)}.dp--action-row{width:100%;padding:var(--dp-action-row-padding);box-sizing:border-box;color:var(--dp-text-color);flex-flow:row;align-items:center;display:flex}.dp--action-row svg{height:var(--dp-button-icon-height);width:auto}.dp--selection-preview{color:var(--dp-text-color);font-size:var(--dp-preview-font-size);white-space:nowrap;text-overflow:ellipsis;display:block;overflow:hidden}.dp--action-buttons{white-space:nowrap;flex:0;justify-content:flex-end;align-items:center;margin-inline-start:auto;display:flex}.dp--action-button{padding:var(--dp-action-buttons-padding);line-height:var(--dp-action-button-height);height:var(--dp-action-button-height);cursor:pointer;border-radius:var(--dp-border-radius);font-size:var(--dp-preview-font-size);font-family:var(--dp-font-family);background:0 0;border:1px solid #0000;align-items:center;margin-inline-start:3px;display:inline-flex}.dp--action-cancel{color:var(--dp-text-color);border:1px solid var(--dp-border-color)}.dp--action-cancel:hover{border-color:var(--dp-primary-color);transition:var(--dp-action-row-transition)}.dp--action-buttons .dp--action-select{background:var(--dp-primary-color);color:var(--dp-primary-text-color)}.dp--action-buttons .dp--action-select:hover{background:var(--dp-primary-color);transition:var(--dp-action-row-transition)}.dp--action-buttons .dp--action-select:disabled{background:var(--dp-primary-disabled-color);cursor:not-allowed}.dp--calendar-header{color:var(--dp-text-color);white-space:nowrap;justify-content:center;align-items:center;font-weight:700;display:flex;position:relative}.dp--calendar-header-item{text-align:center;height:var(--dp-cell-size);padding:var(--dp-cell-padding);width:var(--dp-cell-size);box-sizing:border-box;flex-grow:1}.dp--calendar-row{margin:var(--dp-row-margin);justify-content:center;align-items:center;display:flex}.dp--calendar-item{text-align:center;box-sizing:border-box;color:var(--dp-text-color);flex-grow:1}.dp--calendar{position:relative}.dp--calendar-header-cell{border-bottom:thin solid var(--dp-border-color);padding:var(--dp-calendar-header-cell-padding)}.dp--cell-inner{text-align:center;border-radius:var(--dp-cell-border-radius);height:var(--dp-cell-size);padding:var(--dp-cell-padding);width:var(--dp-cell-size);box-sizing:border-box;border:1px solid #0000;justify-content:center;align-items:center;display:flex;position:relative}.dp--cell-inner:hover{transition:all .2s}.dp--range-border-start{border-start-end-radius:0;border-end-end-radius:0}.dp--range-border-end{border-start-start-radius:0;border-end-start-radius:0}.dp--range-preview{border-top:1px dashed var(--dp-primary-color);border-bottom:1px dashed var(--dp-primary-color)}.dp--cell-offset{color:var(--dp-secondary-color)}.dp--cell-disabled{color:var(--dp-secondary-color);cursor:not-allowed}.dp--date-hoverable:hover{background:var(--dp-hover-color);color:var(--dp-hover-text-color)}.dp--date-hoverable-start:hover{border-start-end-radius:0;border-end-end-radius:0}.dp--date-hoverable-end:hover{border-start-start-radius:0;border-end-start-radius:0}.dp--range-between{background:var(--dp-range-between-dates-background-color);color:var(--dp-range-between-dates-text-color);border:1px solid var(--dp-range-between-border-color);border-radius:0}.dp--range-between-week{background:var(--dp-primary-color);color:var(--dp-primary-text-color);border-radius:0}.dp--today{border:1px solid var(--dp-primary-color)}.dp--week-num{color:var(--dp-secondary-color);text-align:center}.dp--cell-auto-range{border-radius:0}.dp--cell-auto-range-start{border-inline-start:1px dashed var(--dp-primary-color);border-start-start-radius:var(--dp-cell-border-radius);border-end-start-radius:var(--dp-cell-border-radius)}.dp--cell-auto-range-end{border-inline-end:1px dashed var(--dp-primary-color);border-start-end-radius:var(--dp-cell-border-radius);border-end-end-radius:var(--dp-cell-border-radius)}.dp--calendar-header-separator{background:var(--dp-border-color);width:100%;height:1px}.dp--calendar-next{margin-inline-start:var(--dp-multi-calendars-spacing)}.dp--marker-base{background-color:var(--dp-marker-color);height:5px;position:absolute;bottom:0}.dp--marker-dot{border-radius:50%;width:5px;left:50%;transform:translate(-50%)}.dp--marker-line{width:100%;left:0}.dp--marker-tooltip{border-radius:var(--dp-border-radius);background-color:var(--dp-tooltip-color);border:1px solid var(--dp-border-color);z-index:99999;box-sizing:border-box;cursor:default;padding:5px;position:absolute}.dp--tooltip-content{white-space:nowrap}.dp--tooltip-text{color:var(--dp-text-color);flex-flow:row;align-items:center;display:flex}.dp--tooltip-mark{background-color:var(--dp-text-color);width:5px;height:5px;color:var(--dp-text-color);border-radius:50%;margin-inline-end:5px}.dp--arrow-bottom-tp{background-color:var(--dp-tooltip-color);border-inline-end:1px solid var(--dp-border-color);border-bottom:1px solid var(--dp-border-color);width:8px;height:8px;position:absolute;bottom:0;transform:translate(-50%,50%)rotate(45deg)}.dp--instance-calendar{width:100%;position:relative}.dp--flex-display[data-dp-mobile]{flex-direction:column}.dp--flex-display-collapsed{flex-direction:column}.dp--cell-highlight{background-color:var(--dp-highlight-color)}.dp--input-wrap{width:100%;box-sizing:unset;position:relative}.dp--input-wrap:focus{border-color:var(--dp-border-color-hover);outline:none}.dp--input-valid{box-shadow:0 0 var(--dp-border-radius) var(--dp-success-color);border-color:var(--dp-success-color)}.dp--input-valid:hover{border-color:var(--dp-success-color)}.dp--input-invalid{box-shadow:0 0 var(--dp-border-radius) var(--dp-danger-color);border-color:var(--dp-danger-color)}.dp--input-invalid:hover{border-color:var(--dp-danger-color)}.dp--input{background-color:var(--dp-background-color);border-radius:var(--dp-border-radius);font-family:var(--dp-font-family);border:1px solid var(--dp-border-color);width:100%;font-size:var(--dp-font-size);line-height:calc(var(--dp-font-size) * 1.5);padding:var(--dp-input-padding);color:var(--dp-text-color);box-sizing:border-box;outline:none;transition:border-color .2s cubic-bezier(.645,.045,.355,1)}.dp--input::placeholder{opacity:.7}.dp--input:hover:not(.dp--input-focus){border-color:var(--dp-border-color-hover)}.dp--input-not-clearable{padding-inline-end:var(--dp-input-not-clearable-padding)!important}.dp--input-reg{caret-color:#0000}.dp--input-focus{border-color:var(--dp-border-color-focus)}.dp--disabled{background:var(--dp-disabled-color)}.dp--disabled::placeholder{color:var(--dp-disabled-color-text)}.dp--input-icons{width:var(--dp-font-size);height:var(--dp-font-size);stroke-width:0;font-size:var(--dp-font-size);line-height:calc(var(--dp-font-size) * 1.5);color:var(--dp-icon-color);box-sizing:content-box;padding:6px 12px;display:inline-block}.dp--input-icon{cursor:pointer;top:50%;color:var(--dp-icon-color);position:absolute;inset-inline-start:0;transform:translateY(-50%)}.dp--clear-btn{top:50%;cursor:pointer;color:var(--dp-icon-color);background:0 0;border:none;align-items:center;margin:0;padding:0;display:inline-flex;position:absolute;inset-inline-end:0;transform:translateY(-50%)}.dp--input-icon-pad{padding-inline-start:var(--dp-input-icon-padding)}.dp--menu{background:var(--dp-background-color);border-radius:var(--dp-border-radius);min-width:var(--dp-menu-min-width);font-family:var(--dp-font-family);font-size:var(--dp-font-size);-webkit-user-select:none;user-select:none;border:1px solid var(--dp-menu-border-color);box-sizing:border-box}.dp--menu:after,.dp--menu:before{box-sizing:border-box}.dp--menu:focus{border:1px solid var(--dp-menu-border-color);outline:none}.dp--menu-wrapper{z-index:99999;position:absolute}.dp--menu-inner{padding:var(--dp-menu-padding)}.dp--menu--inner-stretched{padding:6px 0}.dp--menu-index{z-index:99999}.dp--menu-unclickable{z-index:999999;position:absolute;inset:0}.dp--menu-disabled{cursor:not-allowed;background:#ffffff80}.dp--menu-readonly{cursor:default;background:0 0}.dp-menu-loading{cursor:default;background:#ffffff80}.dp--menu-load-container{justify-content:center;align-items:center;width:100%;height:100%;display:flex}.dp--menu-loader{border:var(--dp-loader);box-sizing:border-box;border-bottom-color:#0000;border-radius:50%;width:48px;height:48px;animation:1s linear infinite dp-load-rotation;display:inline-block;position:absolute}@keyframes dp-load-rotation{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.dp--arrow-top{background-color:var(--dp-background-color);border-inline-end:1px solid var(--dp-menu-border-color);border-top:1px solid var(--dp-menu-border-color);width:12px;height:12px;position:absolute;transform:translateY(-50%)rotate(-45deg)}.dp--arrow-bottom{left:var(--dp-arrow-left);background-color:var(--dp-background-color);border-inline-end:1px solid var(--dp-menu-border-color);border-bottom:1px solid var(--dp-menu-border-color);width:12px;height:12px;position:absolute;bottom:0;transform:translate(-50%,50%)rotate(45deg)}.dp--action-extra{text-align:center;padding:2px 0}.dp--preset-dates{border-inline-end:1px solid var(--dp-border-color);padding:5px}.dp--preset-dates[data-dp-mobile]{max-width:calc(var(--dp-menu-width) - var(--dp-action-row-padding) * 2);border:none;align-self:center;display:flex;overflow-x:auto}.dp--preset-dates-collapsed{max-width:calc(var(--dp-menu-width) - var(--dp-action-row-padding) * 2);border:none;align-self:center;display:flex;overflow-x:auto}.dp--sidebar-left{border-inline-end:1px solid var(--dp-border-color);padding:5px}.dp--sidebar-right{margin-inline-end:1px solid var(--dp-border-color);padding:5px}.dp--preset-range{text-align:left;white-space:nowrap;width:100%;color:var(--dp-text-color);border-radius:var(--dp-border-radius);transition:var(--dp-common-transition);padding:5px;display:block}.dp--preset-range:hover{background-color:var(--dp-hover-color);color:var(--dp-hover-text-color);cursor:pointer}.dp--preset-range[data-dp-mobile]{border:1px solid var(--dp-border-color);margin:0 3px}.dp--preset-range[data-dp-mobile]:first-child{margin-left:0}.dp--preset-range[data-dp-mobile]:last-child{margin-right:0}.dp--preset-range-collapsed{border:1px solid var(--dp-border-color);margin:0 3px}.dp--preset-range-collapsed:first-child{margin-left:0}.dp--preset-range-collapsed:last-child{margin-right:0}.dp--menu-content-wrapper{display:flex}.dp--menu-content-wrapper[data-dp-mobile]{flex-direction:column-reverse}.dp--menu-content-wrapper-collapsed{flex-direction:column-reverse}.dp--month-year-row{height:var(--dp-month-year-row-height);color:var(--dp-text-color);box-sizing:border-box;align-items:center;display:flex}.dp--inner-nav{cursor:pointer;height:var(--dp-month-year-row-button-size);width:var(--dp-month-year-row-button-size);color:var(--dp-icon-color);text-align:center;border-radius:50%;justify-content:center;align-items:center;display:flex}.dp--inner-nav svg{height:var(--dp-button-icon-height);width:var(--dp-button-icon-height)}.dp--inner-nav:hover{background:var(--dp-hover-color);color:var(--dp-hover-icon-color)}[dir=rtl] .dp--inner-nav{transform:rotate(180deg)}.dp--inner-nav-disabled{background:var(--dp-disabled-color);color:var(--dp-disabled-color-text);cursor:not-allowed}.dp--inner-nav-disabled:hover{background:var(--dp-disabled-color);color:var(--dp-disabled-color-text);cursor:not-allowed}.dp--month-year-select-base{text-align:center;cursor:pointer;height:var(--dp-month-year-row-height);border-radius:var(--dp-border-radius);box-sizing:border-box;color:var(--dp-text-color);justify-content:center;align-items:center;display:flex}.dp--month-year-select-base:hover{background:var(--dp-hover-color);color:var(--dp-hover-text-color);transition:var(--dp-common-transition)}.dp--month-year-select{width:50%}.dp--year-select{width:100%}.dp--month-year-wrap{flex-direction:row;align-items:center;width:100%;display:flex}.dp--year-disable-select{justify-content:space-around}.dp--header-wrap{flex-direction:column;width:100%;display:flex}.dp--year-mode-picker{width:100%;height:var(--dp-cell-size);justify-content:space-between;align-items:center;display:flex}.dp--arrow-btn-nav{transition:var(--dp-common-transition);height:100%}.dp-quarter-picker-wrap{height:100%;min-width:var(--dp-menu-min-width);flex-direction:column;display:flex}.dp--qr-btn-disabled{cursor:not-allowed;background:var(--dp-disabled-color)}.dp--qr-btn-disabled:hover{background:var(--dp-disabled-color)}.dp--qr-btn{width:100%;padding:var(--dp-common-padding)}.dp--qr-btn:not(.dp--highlighted,.dp--active,.dp--qr-btn-disabled,.dp--qr-btn-between){background:0 0}.dp--qr-btn:hover:not(.dp--active,.dp--qr-btn-disabled){background:var(--dp-hover-color);color:var(--dp-hover-text-color);transition:var(--dp-common-transition)}.dp--quarter-items{flex-direction:column;flex:1;justify-content:space-evenly;width:100%;height:100%;display:flex}.dp--qr-btn-between{background:var(--dp-hover-color);color:var(--dp-hover-text-color)}.dp--overlay{background:var(--dp-background-color);z-index:99999;width:100%;font-family:var(--dp-font-family);color:var(--dp-text-color);box-sizing:border-box;transition:opacity 1s ease-out}.dp--overlay-absolute{height:100%;position:absolute;top:0;left:0}.dp--overlay-relative{position:relative}.dp--overlay-container::-webkit-scrollbar-track{box-shadow:var(--dp-scroll-bar-background);background-color:var(--dp-scroll-bar-background)}.dp--overlay-container::-webkit-scrollbar{background-color:var(--dp-scroll-bar-background);width:5px}.dp--overlay-container::-webkit-scrollbar-thumb{background-color:var(--dp-scroll-bar-color);border-radius:10px}.dp--overlay:focus{border:none;outline:none}.dp--container-flex{display:flex}.dp--container-block{display:block}.dp--overlay-container{height:var(--dp-overlay-height);flex-direction:column;overflow-y:auto}.dp--time-picker-overlay-container{height:100%}.dp--overlay-row{box-sizing:border-box;flex-wrap:wrap;align-items:center;width:100%;max-width:100%;margin-inline:auto;padding:0;display:flex}.dp--flex-row{flex:1}.dp--overlay-col{box-sizing:border-box;width:33%;padding:var(--dp-overlay-col-padding);white-space:nowrap}.dp--overlay-cell-pad{padding:var(--dp-common-padding) 0}.dp--overlay-cell-active{cursor:pointer;border-radius:var(--dp-border-radius);text-align:center}.dp--overlay-cell{cursor:pointer;border-radius:var(--dp-border-radius);text-align:center}.dp--overlay-cell:hover{background:var(--dp-hover-color);color:var(--dp-hover-text-color);transition:var(--dp-common-transition)}.dp--cell-in-between{background:var(--dp-hover-color);color:var(--dp-hover-text-color)}.dp--over-action-scroll{box-sizing:border-box;right:5px}.dp--overlay-cell-disabled{cursor:not-allowed;background:var(--dp-disabled-color)}.dp--overlay-cell-disabled:hover{background:var(--dp-disabled-color)}.dp--overlay-cell-active-disabled{cursor:not-allowed;background:var(--dp-primary-disabled-color)}.dp--overlay-cell-active-disabled:hover{background:var(--dp-primary-disabled-color)}.dp--tp-wrap{width:100%}.dp--tp-wrap[data-dp-mobile]{max-width:100%}.dp--time-input{-webkit-user-select:none;user-select:none;width:100%;font-family:var(--dp-font-family);color:var(--dp-text-color);justify-content:center;align-items:center;display:flex}.dp--time-col-reg-block{padding:0 20px}.dp--time-col-reg-inline{padding:0 10px}.dp--time-col-reg-with-button{padding:0 15px}.dp--time-col-reg-with-button[data-compact~=true]{padding:0 5px}.dp--time-col-sec{padding:0 10px}.dp--time-col-sec-with-button{padding:0 5px}.dp--time-col-sec-with-button[data-collapsed~=true]{padding:0}.dp--time-col{text-align:center;flex-direction:column;justify-content:center;align-items:center;display:flex}.dp--time-col-block{font-size:var(--dp-time-font-size)}.dp--inc-dec-button-disabled{background:var(--dp-disabled-color);color:var(--dp-disabled-color-text);cursor:not-allowed}.dp--inc-dec-button-disabled:hover{background:var(--dp-disabled-color);color:var(--dp-disabled-color-text);cursor:not-allowed}.dp--time-display-block{padding:0 3px}.dp--time-display-inline{padding:5px}.dp--time-picker-inline-container{justify-content:center;width:100%;display:flex}.dp--inc-dec-button{height:var(--dp-time-inc-dec-button-size);width:var(--dp-time-inc-dec-button-size);cursor:pointer;color:var(--dp-icon-color);box-sizing:border-box;border-radius:50%;justify-content:center;align-items:center;margin:0;padding:5px;display:flex}.dp--inc-dec-button svg{height:var(--dp-time-inc-dec-button-size);width:var(--dp-time-inc-dec-button-size)}.dp--inc-dec-button:hover{background:var(--dp-hover-color);color:var(--dp-hover-icon-color)}.dp--time-display{cursor:pointer;color:var(--dp-text-color);border-radius:var(--dp-border-radius);justify-content:center;align-items:center;display:flex}.dp--time-display:hover:enabled{background:var(--dp-hover-color);color:var(--dp-hover-text-color)}.dp--inc-dec-button-inline{cursor:pointer;align-items:center;width:100%;height:8px;padding:0;display:flex}.dp--pm-am-button{background:var(--dp-primary-color);color:var(--dp-primary-text-color);padding:var(--dp-common-padding);border-radius:var(--dp-border-radius);cursor:pointer;border:none}.dp--pm-am-button[data-compact~=true]{padding:7px}.dp--tp-inline-btn-bar{background-color:var(--dp-secondary-color);width:100%;height:4px;transition:var(--dp-common-transition);border-collapse:collapse}.dp--tp-inline-btn-top:hover .dp--tp-btn-in-r{background-color:var(--dp-primary-color);transform:rotate(12deg)scale(1.15)translateY(-2px)}.dp--tp-inline-btn-top:hover .dp--tp-btn-in-l{background-color:var(--dp-primary-color);transform:rotate(-12deg)scale(1.15)translateY(-2px)}.dp--tp-inline-btn-bottom:hover .dp--tp-btn-in-r{background-color:var(--dp-primary-color);transform:rotate(-12deg)scale(1.15)translateY(-2px)}.dp--tp-inline-btn-bottom:hover .dp--tp-btn-in-l{background-color:var(--dp-primary-color);transform:rotate(12deg)scale(1.15)translateY(-2px)}.dp--time-overlay-btn{background:0 0}.dp--time-invalid{background-color:var(--dp-disabled-color)}:root{--dp-common-transition:all .1s ease-in;--dp-menu-padding:6px 8px;--dp-animation-duration:.1s;--dp-menu-appear-transition-timing:cubic-bezier(.4, 0, 1, 1);--dp-transition-timing:ease-out;--dp-action-row-transition:all .2s ease-in;--dp-font-family:-apple-system, blinkmacsystemfont, \"Segoe UI\", roboto, oxygen, ubuntu, cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif;--dp-border-radius:4px;--dp-cell-border-radius:4px;--dp-transition-length:22px;--dp-transition-timing-general:.1s;--dp-button-height:35px;--dp-month-year-row-height:35px;--dp-month-year-row-button-size:25px;--dp-button-icon-height:20px;--dp-calendar-wrap-padding:0 5px;--dp-cell-size:35px;--dp-cell-padding:5px;--dp-common-padding:10px;--dp-input-icon-padding:35px;--dp-input-padding:6px 30px 6px 12px;--dp-input-not-clearable-padding:12px;--dp-menu-min-width:260px;--dp-action-buttons-padding:1px 6px;--dp-row-margin:5px 0;--dp-calendar-header-cell-padding:8px;--dp-multi-calendars-spacing:10px;--dp-overlay-col-padding:3px;--dp-time-inc-dec-button-size:32px;--dp-font-size:1rem;--dp-preview-font-size:.8rem;--dp-time-font-size:2rem;--dp-action-button-height:22px;--dp-action-row-padding:8px;--dp-direction:ltr}.dp--theme-dark{--dp-background-color:#212121;--dp-text-color:#fff;--dp-hover-color:#484848;--dp-hover-text-color:#fff;--dp-hover-icon-color:#959595;--dp-primary-color:#005cb2;--dp-primary-disabled-color:#61a8ea;--dp-primary-text-color:#fff;--dp-secondary-color:#a9a9a9;--dp-border-color:#2d2d2d;--dp-menu-border-color:#2d2d2d;--dp-border-color-hover:#aaaeb7;--dp-border-color-focus:#aaaeb7;--dp-disabled-color:#737373;--dp-disabled-color-text:#d0d0d0;--dp-scroll-bar-background:#212121;--dp-scroll-bar-color:#484848;--dp-success-color:#00701a;--dp-success-color-disabled:#428f59;--dp-icon-color:#959595;--dp-danger-color:#e53935;--dp-marker-color:#e53935;--dp-tooltip-color:#3e3e3e;--dp-highlight-color:#005cb233;--dp-range-between-dates-background-color:var(--dp-hover-color,#484848);--dp-range-between-dates-text-color:var(--dp-hover-text-color,#fff);--dp-range-between-border-color:var(--dp-hover-color,#fff);--dp-loader:5px solid #005cb2}.dp--theme-light{--dp-background-color:#fff;--dp-text-color:#212121;--dp-hover-color:#f3f3f3;--dp-hover-text-color:#212121;--dp-hover-icon-color:#959595;--dp-primary-color:#1976d2;--dp-primary-disabled-color:#6bacea;--dp-primary-text-color:#fff;--dp-secondary-color:#c0c4cc;--dp-border-color:#ddd;--dp-menu-border-color:#ddd;--dp-border-color-hover:#aaaeb7;--dp-border-color-focus:#aaaeb7;--dp-disabled-color:#f6f6f6;--dp-scroll-bar-background:#f3f3f3;--dp-scroll-bar-color:#959595;--dp-success-color:#76d275;--dp-success-color-disabled:#a3d9b1;--dp-icon-color:#959595;--dp-danger-color:#ff6f60;--dp-marker-color:#ff6f60;--dp-tooltip-color:#fafafa;--dp-disabled-color-text:#8e8e8e;--dp-highlight-color:#1976d21a;--dp-range-between-dates-background-color:var(--dp-hover-color,#f3f3f3);--dp-range-between-dates-text-color:var(--dp-hover-text-color,#212121);--dp-range-between-border-color:var(--dp-hover-color,#f3f3f3);--dp-loader:5px solid #1976d2}.calendar-next-enter-active,.calendar-next-leave-active,.calendar-prev-enter-active,.calendar-prev-leave-active{transition:all var(--dp-transition-timing-general) ease-out}.calendar-next-enter-from{opacity:0;transform:translateX(var(--dp-transition-length))}.calendar-next-leave-to,.calendar-prev-enter-from{opacity:0;transform:translateX(calc(var(--dp-transition-length) * -1))}.calendar-prev-leave-to{opacity:0;transform:translateX(var(--dp-transition-length))}.dp-menu-appear-bottom-enter-active,.dp-menu-appear-bottom-leave-active,.dp-menu-appear-top-enter-active,.dp-menu-appear-top-leave-active,.dp-slide-up-enter-active,.dp-slide-up-leave-active,.dp-slide-down-enter-active,.dp-slide-down-leave-active{transition:all var(--dp-animation-duration) var(--dp-transition-timing)}.dp-menu-appear-top-enter-from,.dp-menu-appear-top-leave-to,.dp-slide-down-leave-to,.dp-slide-up-enter-from{opacity:0;transform:translateY(var(--dp-transition-length))}.dp-menu-appear-bottom-enter-from,.dp-menu-appear-bottom-leave-to,.dp-slide-down-enter-from,.dp-slide-up-leave-to{opacity:0;transform:translateY(calc(var(--dp-transition-length) * -1))}.dp--flex-display-with-input{flex-direction:column;align-items:flex-start}\n/*$vite$:1*/\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGNBQWMsWUFBWSxDQUFDLHNDQUFzQyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLGNBQWMsQ0FBQyxZQUFZLGtDQUFrQyxDQUFDLGtDQUFrQyxDQUFDLFVBQVUsa0JBQWtCLENBQUMsWUFBWSxDQUFDLGFBQWEsY0FBYyxDQUFDLFVBQVUsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsWUFBWSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsMEJBQTBCLENBQUMsY0FBYyxDQUFDLGdDQUFnQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQywrQkFBK0IsaUJBQWlCLENBQUMsUUFBUSxDQUFDLHNCQUFzQixpQ0FBaUMsQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsd0JBQXdCLGlDQUFpQyxDQUFDLGtCQUFrQixnQ0FBZ0MsQ0FBQyxnQ0FBZ0MsQ0FBQyxnQkFBZ0IsbUNBQW1DLENBQUMsVUFBVSxDQUFDLG1CQUFtQixpREFBaUQsQ0FBQyxrREFBa0QsQ0FBQyxrQkFBa0IsWUFBWSxDQUFDLGNBQWMsaUJBQWlCLENBQUMsaUJBQWlCLDBDQUEwQyxDQUFDLGVBQWUsaUJBQWlCLENBQUMsY0FBYyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyw4QkFBOEIsQ0FBQyxnQkFBZ0IsVUFBVSxDQUFDLG9DQUFvQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLG1DQUFtQyxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsMEJBQTBCLENBQUMscUNBQXFDLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0Isa0JBQWtCLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLGtCQUFrQixDQUFDLHdCQUF3QixDQUFDLFlBQVksQ0FBQyxtQkFBbUIsd0NBQXdDLENBQUMsMENBQTBDLENBQUMscUNBQXFDLENBQUMsY0FBYyxDQUFDLHFDQUFxQyxDQUFDLHFDQUFxQyxDQUFDLGlDQUFpQyxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsMEJBQTBCLENBQUMsdUNBQXVDLENBQUMseUJBQXlCLG9DQUFvQyxDQUFDLDBDQUEwQyxDQUFDLHVDQUF1QyxrQ0FBa0MsQ0FBQyxrQ0FBa0MsQ0FBQyw2Q0FBNkMsa0NBQWtDLENBQUMsMENBQTBDLENBQUMsZ0RBQWdELDJDQUEyQyxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQiwwQkFBMEIsQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLDBCQUEwQixpQkFBaUIsQ0FBQywwQkFBMEIsQ0FBQyw4QkFBOEIsQ0FBQyx5QkFBeUIsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLDJCQUEyQixDQUFDLHNCQUFzQixDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxtQkFBbUIsaUJBQWlCLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLENBQUMsV0FBVyxDQUFDLGNBQWMsaUJBQWlCLENBQUMsMEJBQTBCLCtDQUErQyxDQUFDLDhDQUE4QyxDQUFDLGdCQUFnQixpQkFBaUIsQ0FBQywwQ0FBMEMsQ0FBQywwQkFBMEIsQ0FBQyw4QkFBOEIsQ0FBQyx5QkFBeUIsQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsQ0FBQyxzQkFBc0IsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsc0JBQXNCLGtCQUFrQixDQUFDLHdCQUF3Qix5QkFBeUIsQ0FBQyx1QkFBdUIsQ0FBQyxzQkFBc0IsMkJBQTJCLENBQUMseUJBQXlCLENBQUMsbUJBQW1CLDZDQUE2QyxDQUFDLGdEQUFnRCxDQUFDLGlCQUFpQiwrQkFBK0IsQ0FBQyxtQkFBbUIsK0JBQStCLENBQUMsa0JBQWtCLENBQUMsMEJBQTBCLGdDQUFnQyxDQUFDLGdDQUFnQyxDQUFDLGdDQUFnQyx5QkFBeUIsQ0FBQyx1QkFBdUIsQ0FBQyw4QkFBOEIsMkJBQTJCLENBQUMseUJBQXlCLENBQUMsbUJBQW1CLHlEQUF5RCxDQUFDLDhDQUE4QyxDQUFDLHFEQUFxRCxDQUFDLGVBQWUsQ0FBQyx3QkFBd0Isa0NBQWtDLENBQUMsa0NBQWtDLENBQUMsZUFBZSxDQUFDLFdBQVcsd0NBQXdDLENBQUMsY0FBYywrQkFBK0IsQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsZUFBZSxDQUFDLDJCQUEyQixzREFBc0QsQ0FBQyxzREFBc0QsQ0FBQyxvREFBb0QsQ0FBQyx5QkFBeUIsb0RBQW9ELENBQUMsb0RBQW9ELENBQUMsa0RBQWtELENBQUMsK0JBQStCLGlDQUFpQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLHFEQUFxRCxDQUFDLGlCQUFpQix1Q0FBdUMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGdCQUFnQixpQkFBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLGlCQUFpQixVQUFVLENBQUMsTUFBTSxDQUFDLG9CQUFvQixxQ0FBcUMsQ0FBQyx3Q0FBd0MsQ0FBQyx1Q0FBdUMsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsa0JBQWtCLENBQUMsa0JBQWtCLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLHFDQUFxQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsMEJBQTBCLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLENBQUMscUJBQXFCLHdDQUF3QyxDQUFDLGtEQUFrRCxDQUFDLDhDQUE4QyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLDBDQUEwQyxDQUFDLHVCQUF1QixVQUFVLENBQUMsaUJBQWlCLENBQUMsa0NBQWtDLHFCQUFxQixDQUFDLDRCQUE0QixxQkFBcUIsQ0FBQyxvQkFBb0IsMENBQTBDLENBQUMsZ0JBQWdCLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IseUNBQXlDLENBQUMsWUFBWSxDQUFDLGlCQUFpQiw4REFBOEQsQ0FBQyxvQ0FBb0MsQ0FBQyx1QkFBdUIsb0NBQW9DLENBQUMsbUJBQW1CLDZEQUE2RCxDQUFDLG1DQUFtQyxDQUFDLHlCQUF5QixtQ0FBbUMsQ0FBQyxXQUFXLDJDQUEyQyxDQUFDLHFDQUFxQyxDQUFDLGlDQUFpQyxDQUFDLHVDQUF1QyxDQUFDLFVBQVUsQ0FBQyw2QkFBNkIsQ0FBQywyQ0FBMkMsQ0FBQywrQkFBK0IsQ0FBQywwQkFBMEIsQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsMERBQTBELENBQUMsd0JBQXdCLFVBQVUsQ0FBQyx1Q0FBdUMseUNBQXlDLENBQUMseUJBQXlCLGtFQUFrRSxDQUFDLGVBQWUsaUJBQWlCLENBQUMsaUJBQWlCLHlDQUF5QyxDQUFDLGNBQWMsbUNBQW1DLENBQUMsMkJBQTJCLG1DQUFtQyxDQUFDLGlCQUFpQix5QkFBeUIsQ0FBQywwQkFBMEIsQ0FBQyxjQUFjLENBQUMsNkJBQTZCLENBQUMsMkNBQTJDLENBQUMsMEJBQTBCLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLGNBQWMsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsMEJBQTBCLENBQUMsZUFBZSxPQUFPLENBQUMsY0FBYyxDQUFDLDBCQUEwQixDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQywwQkFBMEIsQ0FBQyxvQkFBb0IsaURBQWlELENBQUMsVUFBVSxxQ0FBcUMsQ0FBQyxxQ0FBcUMsQ0FBQyxrQ0FBa0MsQ0FBQyxpQ0FBaUMsQ0FBQyw2QkFBNkIsQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyw0Q0FBNEMsQ0FBQyxxQkFBcUIsQ0FBQyxpQ0FBaUMscUJBQXFCLENBQUMsZ0JBQWdCLDRDQUE0QyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsYUFBYSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQiw4QkFBOEIsQ0FBQywyQkFBMkIsYUFBYSxDQUFDLGdCQUFnQixhQUFhLENBQUMsc0JBQXNCLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLG1CQUFtQixjQUFjLENBQUMsY0FBYyxDQUFDLGlCQUFpQixjQUFjLENBQUMsb0JBQW9CLENBQUMseUJBQXlCLHNCQUFzQixDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLGlCQUFpQix1QkFBdUIsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLDZDQUE2QyxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQixDQUFDLDRCQUE0QixHQUFHLG1CQUFtQixDQUFDLEdBQUcsd0JBQXdCLENBQUMsQ0FBQyxlQUFlLDJDQUEyQyxDQUFDLHVEQUF1RCxDQUFDLGdEQUFnRCxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsd0NBQXdDLENBQUMsa0JBQWtCLHlCQUF5QixDQUFDLDJDQUEyQyxDQUFDLHVEQUF1RCxDQUFDLG1EQUFtRCxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLDBDQUEwQyxDQUFDLGtCQUFrQixpQkFBaUIsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLGtEQUFrRCxDQUFDLFdBQVcsQ0FBQyxrQ0FBa0MsdUVBQXVFLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsNEJBQTRCLHVFQUF1RSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLGtCQUFrQixrREFBa0QsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLGtEQUFrRCxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsZUFBZSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxxQ0FBcUMsQ0FBQyxzQ0FBc0MsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLHdCQUF3QixzQ0FBc0MsQ0FBQyxnQ0FBZ0MsQ0FBQyxjQUFjLENBQUMsa0NBQWtDLHVDQUF1QyxDQUFDLFlBQVksQ0FBQyw4Q0FBOEMsYUFBYSxDQUFDLDZDQUE2QyxjQUFjLENBQUMsNEJBQTRCLHVDQUF1QyxDQUFDLFlBQVksQ0FBQyx3Q0FBd0MsYUFBYSxDQUFDLHVDQUF1QyxjQUFjLENBQUMsMEJBQTBCLFlBQVksQ0FBQywwQ0FBMEMsNkJBQTZCLENBQUMsb0NBQW9DLDZCQUE2QixDQUFDLG9CQUFvQixzQ0FBc0MsQ0FBQywwQkFBMEIsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsZUFBZSxjQUFjLENBQUMsMkNBQTJDLENBQUMsMENBQTBDLENBQUMsMEJBQTBCLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLG1CQUFtQixtQ0FBbUMsQ0FBQyxrQ0FBa0MsQ0FBQyxxQkFBcUIsZ0NBQWdDLENBQUMsZ0NBQWdDLENBQUMseUJBQXlCLHdCQUF3QixDQUFDLHdCQUF3QixtQ0FBbUMsQ0FBQyxtQ0FBbUMsQ0FBQyxrQkFBa0IsQ0FBQyw4QkFBOEIsbUNBQW1DLENBQUMsbUNBQW1DLENBQUMsa0JBQWtCLENBQUMsNEJBQTRCLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxzQ0FBc0MsQ0FBQyxxQ0FBcUMsQ0FBQyxxQkFBcUIsQ0FBQywwQkFBMEIsQ0FBQyxzQkFBc0IsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsa0NBQWtDLGdDQUFnQyxDQUFDLGdDQUFnQyxDQUFDLHNDQUFzQyxDQUFDLHVCQUF1QixTQUFTLENBQUMsaUJBQWlCLFVBQVUsQ0FBQyxxQkFBcUIsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsNEJBQTRCLENBQUMsaUJBQWlCLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyw2QkFBNkIsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLHNDQUFzQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsV0FBVyxDQUFDLGtDQUFrQyxDQUFDLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxxQkFBcUIsa0JBQWtCLENBQUMsbUNBQW1DLENBQUMsMkJBQTJCLG1DQUFtQyxDQUFDLFlBQVksVUFBVSxDQUFDLGdDQUFnQyxDQUFDLHVGQUF1RixjQUFjLENBQUMsd0RBQXdELGdDQUFnQyxDQUFDLGdDQUFnQyxDQUFDLHNDQUFzQyxDQUFDLG1CQUFtQixxQkFBcUIsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLGdDQUFnQyxDQUFDLGdDQUFnQyxDQUFDLGFBQWEscUNBQXFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxpQ0FBaUMsQ0FBQywwQkFBMEIsQ0FBQyxxQkFBcUIsQ0FBQyw4QkFBOEIsQ0FBQyxzQkFBc0IsV0FBVyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsc0JBQXNCLGlCQUFpQixDQUFDLGdEQUFnRCwwQ0FBMEMsQ0FBQyxnREFBZ0QsQ0FBQywwQ0FBMEMsZ0RBQWdELENBQUMsU0FBUyxDQUFDLGdEQUFnRCwyQ0FBMkMsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsV0FBVyxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsWUFBWSxDQUFDLHFCQUFxQixhQUFhLENBQUMsdUJBQXVCLCtCQUErQixDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxtQ0FBbUMsV0FBVyxDQUFDLGlCQUFpQixxQkFBcUIsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLGNBQWMsTUFBTSxDQUFDLGlCQUFpQixxQkFBcUIsQ0FBQyxTQUFTLENBQUMscUNBQXFDLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLGtDQUFrQyxDQUFDLHlCQUF5QixjQUFjLENBQUMscUNBQXFDLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLGNBQWMsQ0FBQyxxQ0FBcUMsQ0FBQyxpQkFBaUIsQ0FBQyx3QkFBd0IsZ0NBQWdDLENBQUMsZ0NBQWdDLENBQUMsc0NBQXNDLENBQUMscUJBQXFCLGdDQUFnQyxDQUFDLGdDQUFnQyxDQUFDLHdCQUF3QixxQkFBcUIsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLGtCQUFrQixDQUFDLG1DQUFtQyxDQUFDLGlDQUFpQyxtQ0FBbUMsQ0FBQyxrQ0FBa0Msa0JBQWtCLENBQUMsMkNBQTJDLENBQUMsd0NBQXdDLDJDQUEyQyxDQUFDLGFBQWEsVUFBVSxDQUFDLDZCQUE2QixjQUFjLENBQUMsZ0JBQWdCLHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxpQ0FBaUMsQ0FBQywwQkFBMEIsQ0FBQyxzQkFBc0IsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsd0JBQXdCLGNBQWMsQ0FBQyx5QkFBeUIsY0FBYyxDQUFDLDhCQUE4QixjQUFjLENBQUMsa0RBQWtELGFBQWEsQ0FBQyxrQkFBa0IsY0FBYyxDQUFDLDhCQUE4QixhQUFhLENBQUMsb0RBQW9ELFNBQVMsQ0FBQyxjQUFjLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxvQkFBb0Isa0NBQWtDLENBQUMsNkJBQTZCLG1DQUFtQyxDQUFDLG1DQUFtQyxDQUFDLGtCQUFrQixDQUFDLG1DQUFtQyxtQ0FBbUMsQ0FBQyxtQ0FBbUMsQ0FBQyxrQkFBa0IsQ0FBQyx3QkFBd0IsYUFBYSxDQUFDLHlCQUF5QixXQUFXLENBQUMsa0NBQWtDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLHlDQUF5QyxDQUFDLHdDQUF3QyxDQUFDLGNBQWMsQ0FBQywwQkFBMEIsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyx3QkFBd0IseUNBQXlDLENBQUMsd0NBQXdDLENBQUMsMEJBQTBCLGdDQUFnQyxDQUFDLGdDQUFnQyxDQUFDLGtCQUFrQixjQUFjLENBQUMsMEJBQTBCLENBQUMscUNBQXFDLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLGdDQUFnQyxnQ0FBZ0MsQ0FBQyxnQ0FBZ0MsQ0FBQywyQkFBMkIsY0FBYyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxrQkFBa0Isa0NBQWtDLENBQUMsa0NBQWtDLENBQUMsZ0NBQWdDLENBQUMscUNBQXFDLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxzQ0FBc0MsV0FBVyxDQUFDLHVCQUF1QiwwQ0FBMEMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLHNDQUFzQyxDQUFDLHdCQUF3QixDQUFDLDhDQUE4Qyx3Q0FBd0MsQ0FBQyxrREFBa0QsQ0FBQyw4Q0FBOEMsd0NBQXdDLENBQUMsbURBQW1ELENBQUMsaURBQWlELHdDQUF3QyxDQUFDLG1EQUFtRCxDQUFDLGlEQUFpRCx3Q0FBd0MsQ0FBQyxrREFBa0QsQ0FBQyxzQkFBc0IsY0FBYyxDQUFDLGtCQUFrQix5Q0FBeUMsQ0FBQyxNQUFNLHNDQUFzQyxDQUFDLHlCQUF5QixDQUFDLDJCQUEyQixDQUFDLDREQUE0RCxDQUFDLCtCQUErQixDQUFDLDBDQUEwQyxDQUFDLDRJQUE0SSxDQUFDLHNCQUFzQixDQUFDLDJCQUEyQixDQUFDLDJCQUEyQixDQUFDLGtDQUFrQyxDQUFDLHVCQUF1QixDQUFDLCtCQUErQixDQUFDLG9DQUFvQyxDQUFDLDRCQUE0QixDQUFDLGdDQUFnQyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixDQUFDLDRCQUE0QixDQUFDLG9DQUFvQyxDQUFDLHFDQUFxQyxDQUFDLHlCQUF5QixDQUFDLG1DQUFtQyxDQUFDLHFCQUFxQixDQUFDLHFDQUFxQyxDQUFDLGlDQUFpQyxDQUFDLDRCQUE0QixDQUFDLGtDQUFrQyxDQUFDLG1CQUFtQixDQUFDLDRCQUE0QixDQUFDLHdCQUF3QixDQUFDLDhCQUE4QixDQUFDLDJCQUEyQixDQUFDLGtCQUFrQixDQUFDLGdCQUFnQiw2QkFBNkIsQ0FBQyxvQkFBb0IsQ0FBQyx3QkFBd0IsQ0FBQywwQkFBMEIsQ0FBQyw2QkFBNkIsQ0FBQywwQkFBMEIsQ0FBQyxtQ0FBbUMsQ0FBQyw0QkFBNEIsQ0FBQyw0QkFBNEIsQ0FBQyx5QkFBeUIsQ0FBQyw4QkFBOEIsQ0FBQywrQkFBK0IsQ0FBQywrQkFBK0IsQ0FBQywyQkFBMkIsQ0FBQyxnQ0FBZ0MsQ0FBQyxrQ0FBa0MsQ0FBQyw2QkFBNkIsQ0FBQywwQkFBMEIsQ0FBQyxtQ0FBbUMsQ0FBQyx1QkFBdUIsQ0FBQyx5QkFBeUIsQ0FBQyx5QkFBeUIsQ0FBQywwQkFBMEIsQ0FBQyw4QkFBOEIsQ0FBQyx1RUFBdUUsQ0FBQyxtRUFBbUUsQ0FBQywwREFBMEQsQ0FBQyw2QkFBNkIsQ0FBQyxpQkFBaUIsMEJBQTBCLENBQUMsdUJBQXVCLENBQUMsd0JBQXdCLENBQUMsNkJBQTZCLENBQUMsNkJBQTZCLENBQUMsMEJBQTBCLENBQUMsbUNBQW1DLENBQUMsNEJBQTRCLENBQUMsNEJBQTRCLENBQUMsc0JBQXNCLENBQUMsMkJBQTJCLENBQUMsK0JBQStCLENBQUMsK0JBQStCLENBQUMsMkJBQTJCLENBQUMsa0NBQWtDLENBQUMsNkJBQTZCLENBQUMsMEJBQTBCLENBQUMsbUNBQW1DLENBQUMsdUJBQXVCLENBQUMseUJBQXlCLENBQUMseUJBQXlCLENBQUMsMEJBQTBCLENBQUMsZ0NBQWdDLENBQUMsOEJBQThCLENBQUMsdUVBQXVFLENBQUMsc0VBQXNFLENBQUMsNkRBQTZELENBQUMsNkJBQTZCLENBQUMsZ0hBQWdILDJEQUEyRCxDQUFDLDBCQUEwQixTQUFTLENBQUMsaURBQWlELENBQUMsa0RBQWtELFNBQVMsQ0FBQyw0REFBNEQsQ0FBQyx3QkFBd0IsU0FBUyxDQUFDLGlEQUFpRCxDQUFDLHNQQUFzUCx1RUFBdUUsQ0FBQyw0R0FBNEcsU0FBUyxDQUFDLGlEQUFpRCxDQUFDLGtIQUFrSCxTQUFTLENBQUMsNERBQTRELENBQUMsNkJBQTZCLHFCQUFxQixDQUFDLHNCQUFzQjtBQUMzN3RCLFdBQVciLCJmaWxlIjoibWFpbi5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZHAtLWJ0bi1iYXNle2ZvbnQ6aW5oZXJpdDt0cmFuc2l0aW9uOnZhcigtLWRwLWNvbW1vbi10cmFuc2l0aW9uKTtib3JkZXI6bm9uZTtsaW5lLWhlaWdodDpub3JtYWx9LmRwLS1iZy1ub25le2JhY2tncm91bmQ6MCAwfS5kcC0tYWN0aXZle2JhY2tncm91bmQ6dmFyKC0tZHAtcHJpbWFyeS1jb2xvcik7Y29sb3I6dmFyKC0tZHAtcHJpbWFyeS10ZXh0LWNvbG9yKX0uZHAtLWZsZXh7YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0uZHAtLXBvaW50ZXJ7Y3Vyc29yOnBvaW50ZXJ9LmRwLS1pY29ue3N0cm9rZTpjdXJyZW50Q29sb3I7ZmlsbDpjdXJyZW50Q29sb3J9LmRwLS1idXR0b257dGV4dC1hbGlnbjpjZW50ZXI7d2lkdGg6MTAwJTtjb2xvcjp2YXIoLS1kcC1pY29uLWNvbG9yKTtjdXJzb3I6cG9pbnRlcjtwYWRkaW5nOnZhcigtLWRwLWNvbW1vbi1wYWRkaW5nKTtib3gtc2l6aW5nOmJvcmRlci1ib3g7aGVpZ2h0OnZhcigtLWRwLWJ1dHRvbi1oZWlnaHQpO3BsYWNlLWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXh9LmRwLS1idXR0b24uZHAtLW92ZXJsYXktYWN0aW9ue3Bvc2l0aW9uOmFic29sdXRlO2JvdHRvbTowfS5kcC0tYnV0dG9uIC5kcC0tbWFpbntmb250LWZhbWlseTp2YXIoLS1kcC1mb250LWZhbWlseSk7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmU7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjEwMCU7cG9zaXRpb246cmVsYXRpdmV9LmRwLS1idXR0b24gLmRwLS1tYWluICp7ZGlyZWN0aW9uOnZhcigtLWRwLWRpcmVjdGlvbixsdHIpfS5kcC0tYnV0dG9uOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tZHAtaG92ZXItY29sb3IpO2NvbG9yOnZhcigtLWRwLWhvdmVyLWljb24tY29sb3IpfS5kcC0tYnV0dG9uIHN2Z3toZWlnaHQ6dmFyKC0tZHAtYnV0dG9uLWljb24taGVpZ2h0KTt3aWR0aDphdXRvfS5kcC0tYnV0dG9uLWJvdHRvbXtib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOnZhcigtLWRwLWJvcmRlci1yYWRpdXMpO2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOnZhcigtLWRwLWJvcmRlci1yYWRpdXMpfS5kcC0tZmxleC1kaXNwbGF5e2Rpc3BsYXk6ZmxleH0uZHAtLXJlbGF0aXZle3Bvc2l0aW9uOnJlbGF0aXZlfS5kcC0taGlnaGxpZ2h0ZWR7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kcC1oaWdobGlnaHQtY29sb3IpfS5kcC0taGlkZGVuLWVse3Zpc2liaWxpdHk6aGlkZGVufS5kcC0tY2VudGVyZWR7cG9zaXRpb246Zml4ZWQ7dG9wOjUwJTtsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSl9LmRwLS1hY3Rpb24tcm93e3dpZHRoOjEwMCU7cGFkZGluZzp2YXIoLS1kcC1hY3Rpb24tcm93LXBhZGRpbmcpO2JveC1zaXppbmc6Ym9yZGVyLWJveDtjb2xvcjp2YXIoLS1kcC10ZXh0LWNvbG9yKTtmbGV4LWZsb3c6cm93O2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXh9LmRwLS1hY3Rpb24tcm93IHN2Z3toZWlnaHQ6dmFyKC0tZHAtYnV0dG9uLWljb24taGVpZ2h0KTt3aWR0aDphdXRvfS5kcC0tc2VsZWN0aW9uLXByZXZpZXd7Y29sb3I6dmFyKC0tZHAtdGV4dC1jb2xvcik7Zm9udC1zaXplOnZhcigtLWRwLXByZXZpZXctZm9udC1zaXplKTt3aGl0ZS1zcGFjZTpub3dyYXA7dGV4dC1vdmVyZmxvdzplbGxpcHNpcztkaXNwbGF5OmJsb2NrO292ZXJmbG93OmhpZGRlbn0uZHAtLWFjdGlvbi1idXR0b25ze3doaXRlLXNwYWNlOm5vd3JhcDtmbGV4OjA7anVzdGlmeS1jb250ZW50OmZsZXgtZW5kO2FsaWduLWl0ZW1zOmNlbnRlcjttYXJnaW4taW5saW5lLXN0YXJ0OmF1dG87ZGlzcGxheTpmbGV4fS5kcC0tYWN0aW9uLWJ1dHRvbntwYWRkaW5nOnZhcigtLWRwLWFjdGlvbi1idXR0b25zLXBhZGRpbmcpO2xpbmUtaGVpZ2h0OnZhcigtLWRwLWFjdGlvbi1idXR0b24taGVpZ2h0KTtoZWlnaHQ6dmFyKC0tZHAtYWN0aW9uLWJ1dHRvbi1oZWlnaHQpO2N1cnNvcjpwb2ludGVyO2JvcmRlci1yYWRpdXM6dmFyKC0tZHAtYm9yZGVyLXJhZGl1cyk7Zm9udC1zaXplOnZhcigtLWRwLXByZXZpZXctZm9udC1zaXplKTtmb250LWZhbWlseTp2YXIoLS1kcC1mb250LWZhbWlseSk7YmFja2dyb3VuZDowIDA7Ym9yZGVyOjFweCBzb2xpZCAjMDAwMDthbGlnbi1pdGVtczpjZW50ZXI7bWFyZ2luLWlubGluZS1zdGFydDozcHg7ZGlzcGxheTppbmxpbmUtZmxleH0uZHAtLWFjdGlvbi1jYW5jZWx7Y29sb3I6dmFyKC0tZHAtdGV4dC1jb2xvcik7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kcC1ib3JkZXItY29sb3IpfS5kcC0tYWN0aW9uLWNhbmNlbDpob3Zlcntib3JkZXItY29sb3I6dmFyKC0tZHAtcHJpbWFyeS1jb2xvcik7dHJhbnNpdGlvbjp2YXIoLS1kcC1hY3Rpb24tcm93LXRyYW5zaXRpb24pfS5kcC0tYWN0aW9uLWJ1dHRvbnMgLmRwLS1hY3Rpb24tc2VsZWN0e2JhY2tncm91bmQ6dmFyKC0tZHAtcHJpbWFyeS1jb2xvcik7Y29sb3I6dmFyKC0tZHAtcHJpbWFyeS10ZXh0LWNvbG9yKX0uZHAtLWFjdGlvbi1idXR0b25zIC5kcC0tYWN0aW9uLXNlbGVjdDpob3ZlcntiYWNrZ3JvdW5kOnZhcigtLWRwLXByaW1hcnktY29sb3IpO3RyYW5zaXRpb246dmFyKC0tZHAtYWN0aW9uLXJvdy10cmFuc2l0aW9uKX0uZHAtLWFjdGlvbi1idXR0b25zIC5kcC0tYWN0aW9uLXNlbGVjdDpkaXNhYmxlZHtiYWNrZ3JvdW5kOnZhcigtLWRwLXByaW1hcnktZGlzYWJsZWQtY29sb3IpO2N1cnNvcjpub3QtYWxsb3dlZH0uZHAtLWNhbGVuZGFyLWhlYWRlcntjb2xvcjp2YXIoLS1kcC10ZXh0LWNvbG9yKTt3aGl0ZS1zcGFjZTpub3dyYXA7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Zm9udC13ZWlnaHQ6NzAwO2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZX0uZHAtLWNhbGVuZGFyLWhlYWRlci1pdGVte3RleHQtYWxpZ246Y2VudGVyO2hlaWdodDp2YXIoLS1kcC1jZWxsLXNpemUpO3BhZGRpbmc6dmFyKC0tZHAtY2VsbC1wYWRkaW5nKTt3aWR0aDp2YXIoLS1kcC1jZWxsLXNpemUpO2JveC1zaXppbmc6Ym9yZGVyLWJveDtmbGV4LWdyb3c6MX0uZHAtLWNhbGVuZGFyLXJvd3ttYXJnaW46dmFyKC0tZHAtcm93LW1hcmdpbik7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7ZGlzcGxheTpmbGV4fS5kcC0tY2FsZW5kYXItaXRlbXt0ZXh0LWFsaWduOmNlbnRlcjtib3gtc2l6aW5nOmJvcmRlci1ib3g7Y29sb3I6dmFyKC0tZHAtdGV4dC1jb2xvcik7ZmxleC1ncm93OjF9LmRwLS1jYWxlbmRhcntwb3NpdGlvbjpyZWxhdGl2ZX0uZHAtLWNhbGVuZGFyLWhlYWRlci1jZWxse2JvcmRlci1ib3R0b206dGhpbiBzb2xpZCB2YXIoLS1kcC1ib3JkZXItY29sb3IpO3BhZGRpbmc6dmFyKC0tZHAtY2FsZW5kYXItaGVhZGVyLWNlbGwtcGFkZGluZyl9LmRwLS1jZWxsLWlubmVye3RleHQtYWxpZ246Y2VudGVyO2JvcmRlci1yYWRpdXM6dmFyKC0tZHAtY2VsbC1ib3JkZXItcmFkaXVzKTtoZWlnaHQ6dmFyKC0tZHAtY2VsbC1zaXplKTtwYWRkaW5nOnZhcigtLWRwLWNlbGwtcGFkZGluZyk7d2lkdGg6dmFyKC0tZHAtY2VsbC1zaXplKTtib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym9yZGVyOjFweCBzb2xpZCAjMDAwMDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmV9LmRwLS1jZWxsLWlubmVyOmhvdmVye3RyYW5zaXRpb246YWxsIC4yc30uZHAtLXJhbmdlLWJvcmRlci1zdGFydHtib3JkZXItc3RhcnQtZW5kLXJhZGl1czowO2JvcmRlci1lbmQtZW5kLXJhZGl1czowfS5kcC0tcmFuZ2UtYm9yZGVyLWVuZHtib3JkZXItc3RhcnQtc3RhcnQtcmFkaXVzOjA7Ym9yZGVyLWVuZC1zdGFydC1yYWRpdXM6MH0uZHAtLXJhbmdlLXByZXZpZXd7Ym9yZGVyLXRvcDoxcHggZGFzaGVkIHZhcigtLWRwLXByaW1hcnktY29sb3IpO2JvcmRlci1ib3R0b206MXB4IGRhc2hlZCB2YXIoLS1kcC1wcmltYXJ5LWNvbG9yKX0uZHAtLWNlbGwtb2Zmc2V0e2NvbG9yOnZhcigtLWRwLXNlY29uZGFyeS1jb2xvcil9LmRwLS1jZWxsLWRpc2FibGVke2NvbG9yOnZhcigtLWRwLXNlY29uZGFyeS1jb2xvcik7Y3Vyc29yOm5vdC1hbGxvd2VkfS5kcC0tZGF0ZS1ob3ZlcmFibGU6aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1kcC1ob3Zlci1jb2xvcik7Y29sb3I6dmFyKC0tZHAtaG92ZXItdGV4dC1jb2xvcil9LmRwLS1kYXRlLWhvdmVyYWJsZS1zdGFydDpob3Zlcntib3JkZXItc3RhcnQtZW5kLXJhZGl1czowO2JvcmRlci1lbmQtZW5kLXJhZGl1czowfS5kcC0tZGF0ZS1ob3ZlcmFibGUtZW5kOmhvdmVye2JvcmRlci1zdGFydC1zdGFydC1yYWRpdXM6MDtib3JkZXItZW5kLXN0YXJ0LXJhZGl1czowfS5kcC0tcmFuZ2UtYmV0d2VlbntiYWNrZ3JvdW5kOnZhcigtLWRwLXJhbmdlLWJldHdlZW4tZGF0ZXMtYmFja2dyb3VuZC1jb2xvcik7Y29sb3I6dmFyKC0tZHAtcmFuZ2UtYmV0d2Vlbi1kYXRlcy10ZXh0LWNvbG9yKTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWRwLXJhbmdlLWJldHdlZW4tYm9yZGVyLWNvbG9yKTtib3JkZXItcmFkaXVzOjB9LmRwLS1yYW5nZS1iZXR3ZWVuLXdlZWt7YmFja2dyb3VuZDp2YXIoLS1kcC1wcmltYXJ5LWNvbG9yKTtjb2xvcjp2YXIoLS1kcC1wcmltYXJ5LXRleHQtY29sb3IpO2JvcmRlci1yYWRpdXM6MH0uZHAtLXRvZGF5e2JvcmRlcjoxcHggc29saWQgdmFyKC0tZHAtcHJpbWFyeS1jb2xvcil9LmRwLS13ZWVrLW51bXtjb2xvcjp2YXIoLS1kcC1zZWNvbmRhcnktY29sb3IpO3RleHQtYWxpZ246Y2VudGVyfS5kcC0tY2VsbC1hdXRvLXJhbmdle2JvcmRlci1yYWRpdXM6MH0uZHAtLWNlbGwtYXV0by1yYW5nZS1zdGFydHtib3JkZXItaW5saW5lLXN0YXJ0OjFweCBkYXNoZWQgdmFyKC0tZHAtcHJpbWFyeS1jb2xvcik7Ym9yZGVyLXN0YXJ0LXN0YXJ0LXJhZGl1czp2YXIoLS1kcC1jZWxsLWJvcmRlci1yYWRpdXMpO2JvcmRlci1lbmQtc3RhcnQtcmFkaXVzOnZhcigtLWRwLWNlbGwtYm9yZGVyLXJhZGl1cyl9LmRwLS1jZWxsLWF1dG8tcmFuZ2UtZW5ke2JvcmRlci1pbmxpbmUtZW5kOjFweCBkYXNoZWQgdmFyKC0tZHAtcHJpbWFyeS1jb2xvcik7Ym9yZGVyLXN0YXJ0LWVuZC1yYWRpdXM6dmFyKC0tZHAtY2VsbC1ib3JkZXItcmFkaXVzKTtib3JkZXItZW5kLWVuZC1yYWRpdXM6dmFyKC0tZHAtY2VsbC1ib3JkZXItcmFkaXVzKX0uZHAtLWNhbGVuZGFyLWhlYWRlci1zZXBhcmF0b3J7YmFja2dyb3VuZDp2YXIoLS1kcC1ib3JkZXItY29sb3IpO3dpZHRoOjEwMCU7aGVpZ2h0OjFweH0uZHAtLWNhbGVuZGFyLW5leHR7bWFyZ2luLWlubGluZS1zdGFydDp2YXIoLS1kcC1tdWx0aS1jYWxlbmRhcnMtc3BhY2luZyl9LmRwLS1tYXJrZXItYmFzZXtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRwLW1hcmtlci1jb2xvcik7aGVpZ2h0OjVweDtwb3NpdGlvbjphYnNvbHV0ZTtib3R0b206MH0uZHAtLW1hcmtlci1kb3R7Ym9yZGVyLXJhZGl1czo1MCU7d2lkdGg6NXB4O2xlZnQ6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSl9LmRwLS1tYXJrZXItbGluZXt3aWR0aDoxMDAlO2xlZnQ6MH0uZHAtLW1hcmtlci10b29sdGlwe2JvcmRlci1yYWRpdXM6dmFyKC0tZHAtYm9yZGVyLXJhZGl1cyk7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kcC10b29sdGlwLWNvbG9yKTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWRwLWJvcmRlci1jb2xvcik7ei1pbmRleDo5OTk5OTtib3gtc2l6aW5nOmJvcmRlci1ib3g7Y3Vyc29yOmRlZmF1bHQ7cGFkZGluZzo1cHg7cG9zaXRpb246YWJzb2x1dGV9LmRwLS10b29sdGlwLWNvbnRlbnR7d2hpdGUtc3BhY2U6bm93cmFwfS5kcC0tdG9vbHRpcC10ZXh0e2NvbG9yOnZhcigtLWRwLXRleHQtY29sb3IpO2ZsZXgtZmxvdzpyb3c7YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0uZHAtLXRvb2x0aXAtbWFya3tiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRwLXRleHQtY29sb3IpO3dpZHRoOjVweDtoZWlnaHQ6NXB4O2NvbG9yOnZhcigtLWRwLXRleHQtY29sb3IpO2JvcmRlci1yYWRpdXM6NTAlO21hcmdpbi1pbmxpbmUtZW5kOjVweH0uZHAtLWFycm93LWJvdHRvbS10cHtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRwLXRvb2x0aXAtY29sb3IpO2JvcmRlci1pbmxpbmUtZW5kOjFweCBzb2xpZCB2YXIoLS1kcC1ib3JkZXItY29sb3IpO2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHZhcigtLWRwLWJvcmRlci1jb2xvcik7d2lkdGg6OHB4O2hlaWdodDo4cHg7cG9zaXRpb246YWJzb2x1dGU7Ym90dG9tOjA7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLDUwJSlyb3RhdGUoNDVkZWcpfS5kcC0taW5zdGFuY2UtY2FsZW5kYXJ7d2lkdGg6MTAwJTtwb3NpdGlvbjpyZWxhdGl2ZX0uZHAtLWZsZXgtZGlzcGxheVtkYXRhLWRwLW1vYmlsZV17ZmxleC1kaXJlY3Rpb246Y29sdW1ufS5kcC0tZmxleC1kaXNwbGF5LWNvbGxhcHNlZHtmbGV4LWRpcmVjdGlvbjpjb2x1bW59LmRwLS1jZWxsLWhpZ2hsaWdodHtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRwLWhpZ2hsaWdodC1jb2xvcil9LmRwLS1pbnB1dC13cmFwe3dpZHRoOjEwMCU7Ym94LXNpemluZzp1bnNldDtwb3NpdGlvbjpyZWxhdGl2ZX0uZHAtLWlucHV0LXdyYXA6Zm9jdXN7Ym9yZGVyLWNvbG9yOnZhcigtLWRwLWJvcmRlci1jb2xvci1ob3Zlcik7b3V0bGluZTpub25lfS5kcC0taW5wdXQtdmFsaWR7Ym94LXNoYWRvdzowIDAgdmFyKC0tZHAtYm9yZGVyLXJhZGl1cykgdmFyKC0tZHAtc3VjY2Vzcy1jb2xvcik7Ym9yZGVyLWNvbG9yOnZhcigtLWRwLXN1Y2Nlc3MtY29sb3IpfS5kcC0taW5wdXQtdmFsaWQ6aG92ZXJ7Ym9yZGVyLWNvbG9yOnZhcigtLWRwLXN1Y2Nlc3MtY29sb3IpfS5kcC0taW5wdXQtaW52YWxpZHtib3gtc2hhZG93OjAgMCB2YXIoLS1kcC1ib3JkZXItcmFkaXVzKSB2YXIoLS1kcC1kYW5nZXItY29sb3IpO2JvcmRlci1jb2xvcjp2YXIoLS1kcC1kYW5nZXItY29sb3IpfS5kcC0taW5wdXQtaW52YWxpZDpob3Zlcntib3JkZXItY29sb3I6dmFyKC0tZHAtZGFuZ2VyLWNvbG9yKX0uZHAtLWlucHV0e2JhY2tncm91bmQtY29sb3I6dmFyKC0tZHAtYmFja2dyb3VuZC1jb2xvcik7Ym9yZGVyLXJhZGl1czp2YXIoLS1kcC1ib3JkZXItcmFkaXVzKTtmb250LWZhbWlseTp2YXIoLS1kcC1mb250LWZhbWlseSk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kcC1ib3JkZXItY29sb3IpO3dpZHRoOjEwMCU7Zm9udC1zaXplOnZhcigtLWRwLWZvbnQtc2l6ZSk7bGluZS1oZWlnaHQ6Y2FsYyh2YXIoLS1kcC1mb250LXNpemUpICogMS41KTtwYWRkaW5nOnZhcigtLWRwLWlucHV0LXBhZGRpbmcpO2NvbG9yOnZhcigtLWRwLXRleHQtY29sb3IpO2JveC1zaXppbmc6Ym9yZGVyLWJveDtvdXRsaW5lOm5vbmU7dHJhbnNpdGlvbjpib3JkZXItY29sb3IgLjJzIGN1YmljLWJlemllciguNjQ1LC4wNDUsLjM1NSwxKX0uZHAtLWlucHV0OjpwbGFjZWhvbGRlcntvcGFjaXR5Oi43fS5kcC0taW5wdXQ6aG92ZXI6bm90KC5kcC0taW5wdXQtZm9jdXMpe2JvcmRlci1jb2xvcjp2YXIoLS1kcC1ib3JkZXItY29sb3ItaG92ZXIpfS5kcC0taW5wdXQtbm90LWNsZWFyYWJsZXtwYWRkaW5nLWlubGluZS1lbmQ6dmFyKC0tZHAtaW5wdXQtbm90LWNsZWFyYWJsZS1wYWRkaW5nKSFpbXBvcnRhbnR9LmRwLS1pbnB1dC1yZWd7Y2FyZXQtY29sb3I6IzAwMDB9LmRwLS1pbnB1dC1mb2N1c3tib3JkZXItY29sb3I6dmFyKC0tZHAtYm9yZGVyLWNvbG9yLWZvY3VzKX0uZHAtLWRpc2FibGVke2JhY2tncm91bmQ6dmFyKC0tZHAtZGlzYWJsZWQtY29sb3IpfS5kcC0tZGlzYWJsZWQ6OnBsYWNlaG9sZGVye2NvbG9yOnZhcigtLWRwLWRpc2FibGVkLWNvbG9yLXRleHQpfS5kcC0taW5wdXQtaWNvbnN7d2lkdGg6dmFyKC0tZHAtZm9udC1zaXplKTtoZWlnaHQ6dmFyKC0tZHAtZm9udC1zaXplKTtzdHJva2Utd2lkdGg6MDtmb250LXNpemU6dmFyKC0tZHAtZm9udC1zaXplKTtsaW5lLWhlaWdodDpjYWxjKHZhcigtLWRwLWZvbnQtc2l6ZSkgKiAxLjUpO2NvbG9yOnZhcigtLWRwLWljb24tY29sb3IpO2JveC1zaXppbmc6Y29udGVudC1ib3g7cGFkZGluZzo2cHggMTJweDtkaXNwbGF5OmlubGluZS1ibG9ja30uZHAtLWlucHV0LWljb257Y3Vyc29yOnBvaW50ZXI7dG9wOjUwJTtjb2xvcjp2YXIoLS1kcC1pY29uLWNvbG9yKTtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldC1pbmxpbmUtc3RhcnQ6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX0uZHAtLWNsZWFyLWJ0bnt0b3A6NTAlO2N1cnNvcjpwb2ludGVyO2NvbG9yOnZhcigtLWRwLWljb24tY29sb3IpO2JhY2tncm91bmQ6MCAwO2JvcmRlcjpub25lO2FsaWduLWl0ZW1zOmNlbnRlcjttYXJnaW46MDtwYWRkaW5nOjA7ZGlzcGxheTppbmxpbmUtZmxleDtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldC1pbmxpbmUtZW5kOjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9LmRwLS1pbnB1dC1pY29uLXBhZHtwYWRkaW5nLWlubGluZS1zdGFydDp2YXIoLS1kcC1pbnB1dC1pY29uLXBhZGRpbmcpfS5kcC0tbWVudXtiYWNrZ3JvdW5kOnZhcigtLWRwLWJhY2tncm91bmQtY29sb3IpO2JvcmRlci1yYWRpdXM6dmFyKC0tZHAtYm9yZGVyLXJhZGl1cyk7bWluLXdpZHRoOnZhcigtLWRwLW1lbnUtbWluLXdpZHRoKTtmb250LWZhbWlseTp2YXIoLS1kcC1mb250LWZhbWlseSk7Zm9udC1zaXplOnZhcigtLWRwLWZvbnQtc2l6ZSk7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmU7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kcC1tZW51LWJvcmRlci1jb2xvcik7Ym94LXNpemluZzpib3JkZXItYm94fS5kcC0tbWVudTphZnRlciwuZHAtLW1lbnU6YmVmb3Jle2JveC1zaXppbmc6Ym9yZGVyLWJveH0uZHAtLW1lbnU6Zm9jdXN7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kcC1tZW51LWJvcmRlci1jb2xvcik7b3V0bGluZTpub25lfS5kcC0tbWVudS13cmFwcGVye3otaW5kZXg6OTk5OTk7cG9zaXRpb246YWJzb2x1dGV9LmRwLS1tZW51LWlubmVye3BhZGRpbmc6dmFyKC0tZHAtbWVudS1wYWRkaW5nKX0uZHAtLW1lbnUtLWlubmVyLXN0cmV0Y2hlZHtwYWRkaW5nOjZweCAwfS5kcC0tbWVudS1pbmRleHt6LWluZGV4Ojk5OTk5fS5kcC0tbWVudS11bmNsaWNrYWJsZXt6LWluZGV4Ojk5OTk5OTtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowfS5kcC0tbWVudS1kaXNhYmxlZHtjdXJzb3I6bm90LWFsbG93ZWQ7YmFja2dyb3VuZDojZmZmZmZmODB9LmRwLS1tZW51LXJlYWRvbmx5e2N1cnNvcjpkZWZhdWx0O2JhY2tncm91bmQ6MCAwfS5kcC1tZW51LWxvYWRpbmd7Y3Vyc29yOmRlZmF1bHQ7YmFja2dyb3VuZDojZmZmZmZmODB9LmRwLS1tZW51LWxvYWQtY29udGFpbmVye2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7ZGlzcGxheTpmbGV4fS5kcC0tbWVudS1sb2FkZXJ7Ym9yZGVyOnZhcigtLWRwLWxvYWRlcik7Ym94LXNpemluZzpib3JkZXItYm94O2JvcmRlci1ib3R0b20tY29sb3I6IzAwMDA7Ym9yZGVyLXJhZGl1czo1MCU7d2lkdGg6NDhweDtoZWlnaHQ6NDhweDthbmltYXRpb246MXMgbGluZWFyIGluZmluaXRlIGRwLWxvYWQtcm90YXRpb247ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGV9QGtleWZyYW1lcyBkcC1sb2FkLXJvdGF0aW9uezAle3RyYW5zZm9ybTpyb3RhdGUoMCl9dG97dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpfX0uZHAtLWFycm93LXRvcHtiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRwLWJhY2tncm91bmQtY29sb3IpO2JvcmRlci1pbmxpbmUtZW5kOjFweCBzb2xpZCB2YXIoLS1kcC1tZW51LWJvcmRlci1jb2xvcik7Ym9yZGVyLXRvcDoxcHggc29saWQgdmFyKC0tZHAtbWVudS1ib3JkZXItY29sb3IpO3dpZHRoOjEycHg7aGVpZ2h0OjEycHg7cG9zaXRpb246YWJzb2x1dGU7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSlyb3RhdGUoLTQ1ZGVnKX0uZHAtLWFycm93LWJvdHRvbXtsZWZ0OnZhcigtLWRwLWFycm93LWxlZnQpO2JhY2tncm91bmQtY29sb3I6dmFyKC0tZHAtYmFja2dyb3VuZC1jb2xvcik7Ym9yZGVyLWlubGluZS1lbmQ6MXB4IHNvbGlkIHZhcigtLWRwLW1lbnUtYm9yZGVyLWNvbG9yKTtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS1kcC1tZW51LWJvcmRlci1jb2xvcik7d2lkdGg6MTJweDtoZWlnaHQ6MTJweDtwb3NpdGlvbjphYnNvbHV0ZTtib3R0b206MDt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsNTAlKXJvdGF0ZSg0NWRlZyl9LmRwLS1hY3Rpb24tZXh0cmF7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoycHggMH0uZHAtLXByZXNldC1kYXRlc3tib3JkZXItaW5saW5lLWVuZDoxcHggc29saWQgdmFyKC0tZHAtYm9yZGVyLWNvbG9yKTtwYWRkaW5nOjVweH0uZHAtLXByZXNldC1kYXRlc1tkYXRhLWRwLW1vYmlsZV17bWF4LXdpZHRoOmNhbGModmFyKC0tZHAtbWVudS13aWR0aCkgLSB2YXIoLS1kcC1hY3Rpb24tcm93LXBhZGRpbmcpICogMik7Ym9yZGVyOm5vbmU7YWxpZ24tc2VsZjpjZW50ZXI7ZGlzcGxheTpmbGV4O292ZXJmbG93LXg6YXV0b30uZHAtLXByZXNldC1kYXRlcy1jb2xsYXBzZWR7bWF4LXdpZHRoOmNhbGModmFyKC0tZHAtbWVudS13aWR0aCkgLSB2YXIoLS1kcC1hY3Rpb24tcm93LXBhZGRpbmcpICogMik7Ym9yZGVyOm5vbmU7YWxpZ24tc2VsZjpjZW50ZXI7ZGlzcGxheTpmbGV4O292ZXJmbG93LXg6YXV0b30uZHAtLXNpZGViYXItbGVmdHtib3JkZXItaW5saW5lLWVuZDoxcHggc29saWQgdmFyKC0tZHAtYm9yZGVyLWNvbG9yKTtwYWRkaW5nOjVweH0uZHAtLXNpZGViYXItcmlnaHR7bWFyZ2luLWlubGluZS1lbmQ6MXB4IHNvbGlkIHZhcigtLWRwLWJvcmRlci1jb2xvcik7cGFkZGluZzo1cHh9LmRwLS1wcmVzZXQtcmFuZ2V7dGV4dC1hbGlnbjpsZWZ0O3doaXRlLXNwYWNlOm5vd3JhcDt3aWR0aDoxMDAlO2NvbG9yOnZhcigtLWRwLXRleHQtY29sb3IpO2JvcmRlci1yYWRpdXM6dmFyKC0tZHAtYm9yZGVyLXJhZGl1cyk7dHJhbnNpdGlvbjp2YXIoLS1kcC1jb21tb24tdHJhbnNpdGlvbik7cGFkZGluZzo1cHg7ZGlzcGxheTpibG9ja30uZHAtLXByZXNldC1yYW5nZTpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRwLWhvdmVyLWNvbG9yKTtjb2xvcjp2YXIoLS1kcC1ob3Zlci10ZXh0LWNvbG9yKTtjdXJzb3I6cG9pbnRlcn0uZHAtLXByZXNldC1yYW5nZVtkYXRhLWRwLW1vYmlsZV17Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kcC1ib3JkZXItY29sb3IpO21hcmdpbjowIDNweH0uZHAtLXByZXNldC1yYW5nZVtkYXRhLWRwLW1vYmlsZV06Zmlyc3QtY2hpbGR7bWFyZ2luLWxlZnQ6MH0uZHAtLXByZXNldC1yYW5nZVtkYXRhLWRwLW1vYmlsZV06bGFzdC1jaGlsZHttYXJnaW4tcmlnaHQ6MH0uZHAtLXByZXNldC1yYW5nZS1jb2xsYXBzZWR7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kcC1ib3JkZXItY29sb3IpO21hcmdpbjowIDNweH0uZHAtLXByZXNldC1yYW5nZS1jb2xsYXBzZWQ6Zmlyc3QtY2hpbGR7bWFyZ2luLWxlZnQ6MH0uZHAtLXByZXNldC1yYW5nZS1jb2xsYXBzZWQ6bGFzdC1jaGlsZHttYXJnaW4tcmlnaHQ6MH0uZHAtLW1lbnUtY29udGVudC13cmFwcGVye2Rpc3BsYXk6ZmxleH0uZHAtLW1lbnUtY29udGVudC13cmFwcGVyW2RhdGEtZHAtbW9iaWxlXXtmbGV4LWRpcmVjdGlvbjpjb2x1bW4tcmV2ZXJzZX0uZHAtLW1lbnUtY29udGVudC13cmFwcGVyLWNvbGxhcHNlZHtmbGV4LWRpcmVjdGlvbjpjb2x1bW4tcmV2ZXJzZX0uZHAtLW1vbnRoLXllYXItcm93e2hlaWdodDp2YXIoLS1kcC1tb250aC15ZWFyLXJvdy1oZWlnaHQpO2NvbG9yOnZhcigtLWRwLXRleHQtY29sb3IpO2JveC1zaXppbmc6Ym9yZGVyLWJveDthbGlnbi1pdGVtczpjZW50ZXI7ZGlzcGxheTpmbGV4fS5kcC0taW5uZXItbmF2e2N1cnNvcjpwb2ludGVyO2hlaWdodDp2YXIoLS1kcC1tb250aC15ZWFyLXJvdy1idXR0b24tc2l6ZSk7d2lkdGg6dmFyKC0tZHAtbW9udGgteWVhci1yb3ctYnV0dG9uLXNpemUpO2NvbG9yOnZhcigtLWRwLWljb24tY29sb3IpO3RleHQtYWxpZ246Y2VudGVyO2JvcmRlci1yYWRpdXM6NTAlO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0uZHAtLWlubmVyLW5hdiBzdmd7aGVpZ2h0OnZhcigtLWRwLWJ1dHRvbi1pY29uLWhlaWdodCk7d2lkdGg6dmFyKC0tZHAtYnV0dG9uLWljb24taGVpZ2h0KX0uZHAtLWlubmVyLW5hdjpob3ZlcntiYWNrZ3JvdW5kOnZhcigtLWRwLWhvdmVyLWNvbG9yKTtjb2xvcjp2YXIoLS1kcC1ob3Zlci1pY29uLWNvbG9yKX1bZGlyPXJ0bF0gLmRwLS1pbm5lci1uYXZ7dHJhbnNmb3JtOnJvdGF0ZSgxODBkZWcpfS5kcC0taW5uZXItbmF2LWRpc2FibGVke2JhY2tncm91bmQ6dmFyKC0tZHAtZGlzYWJsZWQtY29sb3IpO2NvbG9yOnZhcigtLWRwLWRpc2FibGVkLWNvbG9yLXRleHQpO2N1cnNvcjpub3QtYWxsb3dlZH0uZHAtLWlubmVyLW5hdi1kaXNhYmxlZDpob3ZlcntiYWNrZ3JvdW5kOnZhcigtLWRwLWRpc2FibGVkLWNvbG9yKTtjb2xvcjp2YXIoLS1kcC1kaXNhYmxlZC1jb2xvci10ZXh0KTtjdXJzb3I6bm90LWFsbG93ZWR9LmRwLS1tb250aC15ZWFyLXNlbGVjdC1iYXNle3RleHQtYWxpZ246Y2VudGVyO2N1cnNvcjpwb2ludGVyO2hlaWdodDp2YXIoLS1kcC1tb250aC15ZWFyLXJvdy1oZWlnaHQpO2JvcmRlci1yYWRpdXM6dmFyKC0tZHAtYm9yZGVyLXJhZGl1cyk7Ym94LXNpemluZzpib3JkZXItYm94O2NvbG9yOnZhcigtLWRwLXRleHQtY29sb3IpO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0uZHAtLW1vbnRoLXllYXItc2VsZWN0LWJhc2U6aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1kcC1ob3Zlci1jb2xvcik7Y29sb3I6dmFyKC0tZHAtaG92ZXItdGV4dC1jb2xvcik7dHJhbnNpdGlvbjp2YXIoLS1kcC1jb21tb24tdHJhbnNpdGlvbil9LmRwLS1tb250aC15ZWFyLXNlbGVjdHt3aWR0aDo1MCV9LmRwLS15ZWFyLXNlbGVjdHt3aWR0aDoxMDAlfS5kcC0tbW9udGgteWVhci13cmFwe2ZsZXgtZGlyZWN0aW9uOnJvdzthbGlnbi1pdGVtczpjZW50ZXI7d2lkdGg6MTAwJTtkaXNwbGF5OmZsZXh9LmRwLS15ZWFyLWRpc2FibGUtc2VsZWN0e2p1c3RpZnktY29udGVudDpzcGFjZS1hcm91bmR9LmRwLS1oZWFkZXItd3JhcHtmbGV4LWRpcmVjdGlvbjpjb2x1bW47d2lkdGg6MTAwJTtkaXNwbGF5OmZsZXh9LmRwLS15ZWFyLW1vZGUtcGlja2Vye3dpZHRoOjEwMCU7aGVpZ2h0OnZhcigtLWRwLWNlbGwtc2l6ZSk7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0uZHAtLWFycm93LWJ0bi1uYXZ7dHJhbnNpdGlvbjp2YXIoLS1kcC1jb21tb24tdHJhbnNpdGlvbik7aGVpZ2h0OjEwMCV9LmRwLXF1YXJ0ZXItcGlja2VyLXdyYXB7aGVpZ2h0OjEwMCU7bWluLXdpZHRoOnZhcigtLWRwLW1lbnUtbWluLXdpZHRoKTtmbGV4LWRpcmVjdGlvbjpjb2x1bW47ZGlzcGxheTpmbGV4fS5kcC0tcXItYnRuLWRpc2FibGVke2N1cnNvcjpub3QtYWxsb3dlZDtiYWNrZ3JvdW5kOnZhcigtLWRwLWRpc2FibGVkLWNvbG9yKX0uZHAtLXFyLWJ0bi1kaXNhYmxlZDpob3ZlcntiYWNrZ3JvdW5kOnZhcigtLWRwLWRpc2FibGVkLWNvbG9yKX0uZHAtLXFyLWJ0bnt3aWR0aDoxMDAlO3BhZGRpbmc6dmFyKC0tZHAtY29tbW9uLXBhZGRpbmcpfS5kcC0tcXItYnRuOm5vdCguZHAtLWhpZ2hsaWdodGVkLC5kcC0tYWN0aXZlLC5kcC0tcXItYnRuLWRpc2FibGVkLC5kcC0tcXItYnRuLWJldHdlZW4pe2JhY2tncm91bmQ6MCAwfS5kcC0tcXItYnRuOmhvdmVyOm5vdCguZHAtLWFjdGl2ZSwuZHAtLXFyLWJ0bi1kaXNhYmxlZCl7YmFja2dyb3VuZDp2YXIoLS1kcC1ob3Zlci1jb2xvcik7Y29sb3I6dmFyKC0tZHAtaG92ZXItdGV4dC1jb2xvcik7dHJhbnNpdGlvbjp2YXIoLS1kcC1jb21tb24tdHJhbnNpdGlvbil9LmRwLS1xdWFydGVyLWl0ZW1ze2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtmbGV4OjE7anVzdGlmeS1jb250ZW50OnNwYWNlLWV2ZW5seTt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2Rpc3BsYXk6ZmxleH0uZHAtLXFyLWJ0bi1iZXR3ZWVue2JhY2tncm91bmQ6dmFyKC0tZHAtaG92ZXItY29sb3IpO2NvbG9yOnZhcigtLWRwLWhvdmVyLXRleHQtY29sb3IpfS5kcC0tb3ZlcmxheXtiYWNrZ3JvdW5kOnZhcigtLWRwLWJhY2tncm91bmQtY29sb3IpO3otaW5kZXg6OTk5OTk7d2lkdGg6MTAwJTtmb250LWZhbWlseTp2YXIoLS1kcC1mb250LWZhbWlseSk7Y29sb3I6dmFyKC0tZHAtdGV4dC1jb2xvcik7Ym94LXNpemluZzpib3JkZXItYm94O3RyYW5zaXRpb246b3BhY2l0eSAxcyBlYXNlLW91dH0uZHAtLW92ZXJsYXktYWJzb2x1dGV7aGVpZ2h0OjEwMCU7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowfS5kcC0tb3ZlcmxheS1yZWxhdGl2ZXtwb3NpdGlvbjpyZWxhdGl2ZX0uZHAtLW92ZXJsYXktY29udGFpbmVyOjotd2Via2l0LXNjcm9sbGJhci10cmFja3tib3gtc2hhZG93OnZhcigtLWRwLXNjcm9sbC1iYXItYmFja2dyb3VuZCk7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kcC1zY3JvbGwtYmFyLWJhY2tncm91bmQpfS5kcC0tb3ZlcmxheS1jb250YWluZXI6Oi13ZWJraXQtc2Nyb2xsYmFye2JhY2tncm91bmQtY29sb3I6dmFyKC0tZHAtc2Nyb2xsLWJhci1iYWNrZ3JvdW5kKTt3aWR0aDo1cHh9LmRwLS1vdmVybGF5LWNvbnRhaW5lcjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kcC1zY3JvbGwtYmFyLWNvbG9yKTtib3JkZXItcmFkaXVzOjEwcHh9LmRwLS1vdmVybGF5OmZvY3Vze2JvcmRlcjpub25lO291dGxpbmU6bm9uZX0uZHAtLWNvbnRhaW5lci1mbGV4e2Rpc3BsYXk6ZmxleH0uZHAtLWNvbnRhaW5lci1ibG9ja3tkaXNwbGF5OmJsb2NrfS5kcC0tb3ZlcmxheS1jb250YWluZXJ7aGVpZ2h0OnZhcigtLWRwLW92ZXJsYXktaGVpZ2h0KTtmbGV4LWRpcmVjdGlvbjpjb2x1bW47b3ZlcmZsb3cteTphdXRvfS5kcC0tdGltZS1waWNrZXItb3ZlcmxheS1jb250YWluZXJ7aGVpZ2h0OjEwMCV9LmRwLS1vdmVybGF5LXJvd3tib3gtc2l6aW5nOmJvcmRlci1ib3g7ZmxleC13cmFwOndyYXA7YWxpZ24taXRlbXM6Y2VudGVyO3dpZHRoOjEwMCU7bWF4LXdpZHRoOjEwMCU7bWFyZ2luLWlubGluZTphdXRvO3BhZGRpbmc6MDtkaXNwbGF5OmZsZXh9LmRwLS1mbGV4LXJvd3tmbGV4OjF9LmRwLS1vdmVybGF5LWNvbHtib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6MzMlO3BhZGRpbmc6dmFyKC0tZHAtb3ZlcmxheS1jb2wtcGFkZGluZyk7d2hpdGUtc3BhY2U6bm93cmFwfS5kcC0tb3ZlcmxheS1jZWxsLXBhZHtwYWRkaW5nOnZhcigtLWRwLWNvbW1vbi1wYWRkaW5nKSAwfS5kcC0tb3ZlcmxheS1jZWxsLWFjdGl2ZXtjdXJzb3I6cG9pbnRlcjtib3JkZXItcmFkaXVzOnZhcigtLWRwLWJvcmRlci1yYWRpdXMpO3RleHQtYWxpZ246Y2VudGVyfS5kcC0tb3ZlcmxheS1jZWxse2N1cnNvcjpwb2ludGVyO2JvcmRlci1yYWRpdXM6dmFyKC0tZHAtYm9yZGVyLXJhZGl1cyk7dGV4dC1hbGlnbjpjZW50ZXJ9LmRwLS1vdmVybGF5LWNlbGw6aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1kcC1ob3Zlci1jb2xvcik7Y29sb3I6dmFyKC0tZHAtaG92ZXItdGV4dC1jb2xvcik7dHJhbnNpdGlvbjp2YXIoLS1kcC1jb21tb24tdHJhbnNpdGlvbil9LmRwLS1jZWxsLWluLWJldHdlZW57YmFja2dyb3VuZDp2YXIoLS1kcC1ob3Zlci1jb2xvcik7Y29sb3I6dmFyKC0tZHAtaG92ZXItdGV4dC1jb2xvcil9LmRwLS1vdmVyLWFjdGlvbi1zY3JvbGx7Ym94LXNpemluZzpib3JkZXItYm94O3JpZ2h0OjVweH0uZHAtLW92ZXJsYXktY2VsbC1kaXNhYmxlZHtjdXJzb3I6bm90LWFsbG93ZWQ7YmFja2dyb3VuZDp2YXIoLS1kcC1kaXNhYmxlZC1jb2xvcil9LmRwLS1vdmVybGF5LWNlbGwtZGlzYWJsZWQ6aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1kcC1kaXNhYmxlZC1jb2xvcil9LmRwLS1vdmVybGF5LWNlbGwtYWN0aXZlLWRpc2FibGVke2N1cnNvcjpub3QtYWxsb3dlZDtiYWNrZ3JvdW5kOnZhcigtLWRwLXByaW1hcnktZGlzYWJsZWQtY29sb3IpfS5kcC0tb3ZlcmxheS1jZWxsLWFjdGl2ZS1kaXNhYmxlZDpob3ZlcntiYWNrZ3JvdW5kOnZhcigtLWRwLXByaW1hcnktZGlzYWJsZWQtY29sb3IpfS5kcC0tdHAtd3JhcHt3aWR0aDoxMDAlfS5kcC0tdHAtd3JhcFtkYXRhLWRwLW1vYmlsZV17bWF4LXdpZHRoOjEwMCV9LmRwLS10aW1lLWlucHV0ey13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lO3dpZHRoOjEwMCU7Zm9udC1mYW1pbHk6dmFyKC0tZHAtZm9udC1mYW1pbHkpO2NvbG9yOnZhcigtLWRwLXRleHQtY29sb3IpO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0uZHAtLXRpbWUtY29sLXJlZy1ibG9ja3twYWRkaW5nOjAgMjBweH0uZHAtLXRpbWUtY29sLXJlZy1pbmxpbmV7cGFkZGluZzowIDEwcHh9LmRwLS10aW1lLWNvbC1yZWctd2l0aC1idXR0b257cGFkZGluZzowIDE1cHh9LmRwLS10aW1lLWNvbC1yZWctd2l0aC1idXR0b25bZGF0YS1jb21wYWN0fj10cnVlXXtwYWRkaW5nOjAgNXB4fS5kcC0tdGltZS1jb2wtc2Vje3BhZGRpbmc6MCAxMHB4fS5kcC0tdGltZS1jb2wtc2VjLXdpdGgtYnV0dG9ue3BhZGRpbmc6MCA1cHh9LmRwLS10aW1lLWNvbC1zZWMtd2l0aC1idXR0b25bZGF0YS1jb2xsYXBzZWR+PXRydWVde3BhZGRpbmc6MH0uZHAtLXRpbWUtY29se3RleHQtYWxpZ246Y2VudGVyO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXh9LmRwLS10aW1lLWNvbC1ibG9ja3tmb250LXNpemU6dmFyKC0tZHAtdGltZS1mb250LXNpemUpfS5kcC0taW5jLWRlYy1idXR0b24tZGlzYWJsZWR7YmFja2dyb3VuZDp2YXIoLS1kcC1kaXNhYmxlZC1jb2xvcik7Y29sb3I6dmFyKC0tZHAtZGlzYWJsZWQtY29sb3ItdGV4dCk7Y3Vyc29yOm5vdC1hbGxvd2VkfS5kcC0taW5jLWRlYy1idXR0b24tZGlzYWJsZWQ6aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1kcC1kaXNhYmxlZC1jb2xvcik7Y29sb3I6dmFyKC0tZHAtZGlzYWJsZWQtY29sb3ItdGV4dCk7Y3Vyc29yOm5vdC1hbGxvd2VkfS5kcC0tdGltZS1kaXNwbGF5LWJsb2Nre3BhZGRpbmc6MCAzcHh9LmRwLS10aW1lLWRpc3BsYXktaW5saW5le3BhZGRpbmc6NXB4fS5kcC0tdGltZS1waWNrZXItaW5saW5lLWNvbnRhaW5lcntqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjEwMCU7ZGlzcGxheTpmbGV4fS5kcC0taW5jLWRlYy1idXR0b257aGVpZ2h0OnZhcigtLWRwLXRpbWUtaW5jLWRlYy1idXR0b24tc2l6ZSk7d2lkdGg6dmFyKC0tZHAtdGltZS1pbmMtZGVjLWJ1dHRvbi1zaXplKTtjdXJzb3I6cG9pbnRlcjtjb2xvcjp2YXIoLS1kcC1pY29uLWNvbG9yKTtib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym9yZGVyLXJhZGl1czo1MCU7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7bWFyZ2luOjA7cGFkZGluZzo1cHg7ZGlzcGxheTpmbGV4fS5kcC0taW5jLWRlYy1idXR0b24gc3Zne2hlaWdodDp2YXIoLS1kcC10aW1lLWluYy1kZWMtYnV0dG9uLXNpemUpO3dpZHRoOnZhcigtLWRwLXRpbWUtaW5jLWRlYy1idXR0b24tc2l6ZSl9LmRwLS1pbmMtZGVjLWJ1dHRvbjpob3ZlcntiYWNrZ3JvdW5kOnZhcigtLWRwLWhvdmVyLWNvbG9yKTtjb2xvcjp2YXIoLS1kcC1ob3Zlci1pY29uLWNvbG9yKX0uZHAtLXRpbWUtZGlzcGxheXtjdXJzb3I6cG9pbnRlcjtjb2xvcjp2YXIoLS1kcC10ZXh0LWNvbG9yKTtib3JkZXItcmFkaXVzOnZhcigtLWRwLWJvcmRlci1yYWRpdXMpO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0uZHAtLXRpbWUtZGlzcGxheTpob3ZlcjplbmFibGVke2JhY2tncm91bmQ6dmFyKC0tZHAtaG92ZXItY29sb3IpO2NvbG9yOnZhcigtLWRwLWhvdmVyLXRleHQtY29sb3IpfS5kcC0taW5jLWRlYy1idXR0b24taW5saW5le2N1cnNvcjpwb2ludGVyO2FsaWduLWl0ZW1zOmNlbnRlcjt3aWR0aDoxMDAlO2hlaWdodDo4cHg7cGFkZGluZzowO2Rpc3BsYXk6ZmxleH0uZHAtLXBtLWFtLWJ1dHRvbntiYWNrZ3JvdW5kOnZhcigtLWRwLXByaW1hcnktY29sb3IpO2NvbG9yOnZhcigtLWRwLXByaW1hcnktdGV4dC1jb2xvcik7cGFkZGluZzp2YXIoLS1kcC1jb21tb24tcGFkZGluZyk7Ym9yZGVyLXJhZGl1czp2YXIoLS1kcC1ib3JkZXItcmFkaXVzKTtjdXJzb3I6cG9pbnRlcjtib3JkZXI6bm9uZX0uZHAtLXBtLWFtLWJ1dHRvbltkYXRhLWNvbXBhY3R+PXRydWVde3BhZGRpbmc6N3B4fS5kcC0tdHAtaW5saW5lLWJ0bi1iYXJ7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kcC1zZWNvbmRhcnktY29sb3IpO3dpZHRoOjEwMCU7aGVpZ2h0OjRweDt0cmFuc2l0aW9uOnZhcigtLWRwLWNvbW1vbi10cmFuc2l0aW9uKTtib3JkZXItY29sbGFwc2U6Y29sbGFwc2V9LmRwLS10cC1pbmxpbmUtYnRuLXRvcDpob3ZlciAuZHAtLXRwLWJ0bi1pbi1ye2JhY2tncm91bmQtY29sb3I6dmFyKC0tZHAtcHJpbWFyeS1jb2xvcik7dHJhbnNmb3JtOnJvdGF0ZSgxMmRlZylzY2FsZSgxLjE1KXRyYW5zbGF0ZVkoLTJweCl9LmRwLS10cC1pbmxpbmUtYnRuLXRvcDpob3ZlciAuZHAtLXRwLWJ0bi1pbi1se2JhY2tncm91bmQtY29sb3I6dmFyKC0tZHAtcHJpbWFyeS1jb2xvcik7dHJhbnNmb3JtOnJvdGF0ZSgtMTJkZWcpc2NhbGUoMS4xNSl0cmFuc2xhdGVZKC0ycHgpfS5kcC0tdHAtaW5saW5lLWJ0bi1ib3R0b206aG92ZXIgLmRwLS10cC1idG4taW4tcntiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLWRwLXByaW1hcnktY29sb3IpO3RyYW5zZm9ybTpyb3RhdGUoLTEyZGVnKXNjYWxlKDEuMTUpdHJhbnNsYXRlWSgtMnB4KX0uZHAtLXRwLWlubGluZS1idG4tYm90dG9tOmhvdmVyIC5kcC0tdHAtYnRuLWluLWx7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kcC1wcmltYXJ5LWNvbG9yKTt0cmFuc2Zvcm06cm90YXRlKDEyZGVnKXNjYWxlKDEuMTUpdHJhbnNsYXRlWSgtMnB4KX0uZHAtLXRpbWUtb3ZlcmxheS1idG57YmFja2dyb3VuZDowIDB9LmRwLS10aW1lLWludmFsaWR7YmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kcC1kaXNhYmxlZC1jb2xvcil9OnJvb3R7LS1kcC1jb21tb24tdHJhbnNpdGlvbjphbGwgLjFzIGVhc2UtaW47LS1kcC1tZW51LXBhZGRpbmc6NnB4IDhweDstLWRwLWFuaW1hdGlvbi1kdXJhdGlvbjouMXM7LS1kcC1tZW51LWFwcGVhci10cmFuc2l0aW9uLXRpbWluZzpjdWJpYy1iZXppZXIoLjQsIDAsIDEsIDEpOy0tZHAtdHJhbnNpdGlvbi10aW1pbmc6ZWFzZS1vdXQ7LS1kcC1hY3Rpb24tcm93LXRyYW5zaXRpb246YWxsIC4ycyBlYXNlLWluOy0tZHAtZm9udC1mYW1pbHk6LWFwcGxlLXN5c3RlbSwgYmxpbmttYWNzeXN0ZW1mb250LCBcIlNlZ29lIFVJXCIsIHJvYm90bywgb3h5Z2VuLCB1YnVudHUsIGNhbnRhcmVsbCwgXCJPcGVuIFNhbnNcIiwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBzYW5zLXNlcmlmOy0tZHAtYm9yZGVyLXJhZGl1czo0cHg7LS1kcC1jZWxsLWJvcmRlci1yYWRpdXM6NHB4Oy0tZHAtdHJhbnNpdGlvbi1sZW5ndGg6MjJweDstLWRwLXRyYW5zaXRpb24tdGltaW5nLWdlbmVyYWw6LjFzOy0tZHAtYnV0dG9uLWhlaWdodDozNXB4Oy0tZHAtbW9udGgteWVhci1yb3ctaGVpZ2h0OjM1cHg7LS1kcC1tb250aC15ZWFyLXJvdy1idXR0b24tc2l6ZToyNXB4Oy0tZHAtYnV0dG9uLWljb24taGVpZ2h0OjIwcHg7LS1kcC1jYWxlbmRhci13cmFwLXBhZGRpbmc6MCA1cHg7LS1kcC1jZWxsLXNpemU6MzVweDstLWRwLWNlbGwtcGFkZGluZzo1cHg7LS1kcC1jb21tb24tcGFkZGluZzoxMHB4Oy0tZHAtaW5wdXQtaWNvbi1wYWRkaW5nOjM1cHg7LS1kcC1pbnB1dC1wYWRkaW5nOjZweCAzMHB4IDZweCAxMnB4Oy0tZHAtaW5wdXQtbm90LWNsZWFyYWJsZS1wYWRkaW5nOjEycHg7LS1kcC1tZW51LW1pbi13aWR0aDoyNjBweDstLWRwLWFjdGlvbi1idXR0b25zLXBhZGRpbmc6MXB4IDZweDstLWRwLXJvdy1tYXJnaW46NXB4IDA7LS1kcC1jYWxlbmRhci1oZWFkZXItY2VsbC1wYWRkaW5nOjhweDstLWRwLW11bHRpLWNhbGVuZGFycy1zcGFjaW5nOjEwcHg7LS1kcC1vdmVybGF5LWNvbC1wYWRkaW5nOjNweDstLWRwLXRpbWUtaW5jLWRlYy1idXR0b24tc2l6ZTozMnB4Oy0tZHAtZm9udC1zaXplOjFyZW07LS1kcC1wcmV2aWV3LWZvbnQtc2l6ZTouOHJlbTstLWRwLXRpbWUtZm9udC1zaXplOjJyZW07LS1kcC1hY3Rpb24tYnV0dG9uLWhlaWdodDoyMnB4Oy0tZHAtYWN0aW9uLXJvdy1wYWRkaW5nOjhweDstLWRwLWRpcmVjdGlvbjpsdHJ9LmRwLS10aGVtZS1kYXJrey0tZHAtYmFja2dyb3VuZC1jb2xvcjojMjEyMTIxOy0tZHAtdGV4dC1jb2xvcjojZmZmOy0tZHAtaG92ZXItY29sb3I6IzQ4NDg0ODstLWRwLWhvdmVyLXRleHQtY29sb3I6I2ZmZjstLWRwLWhvdmVyLWljb24tY29sb3I6Izk1OTU5NTstLWRwLXByaW1hcnktY29sb3I6IzAwNWNiMjstLWRwLXByaW1hcnktZGlzYWJsZWQtY29sb3I6IzYxYThlYTstLWRwLXByaW1hcnktdGV4dC1jb2xvcjojZmZmOy0tZHAtc2Vjb25kYXJ5LWNvbG9yOiNhOWE5YTk7LS1kcC1ib3JkZXItY29sb3I6IzJkMmQyZDstLWRwLW1lbnUtYm9yZGVyLWNvbG9yOiMyZDJkMmQ7LS1kcC1ib3JkZXItY29sb3ItaG92ZXI6I2FhYWViNzstLWRwLWJvcmRlci1jb2xvci1mb2N1czojYWFhZWI3Oy0tZHAtZGlzYWJsZWQtY29sb3I6IzczNzM3MzstLWRwLWRpc2FibGVkLWNvbG9yLXRleHQ6I2QwZDBkMDstLWRwLXNjcm9sbC1iYXItYmFja2dyb3VuZDojMjEyMTIxOy0tZHAtc2Nyb2xsLWJhci1jb2xvcjojNDg0ODQ4Oy0tZHAtc3VjY2Vzcy1jb2xvcjojMDA3MDFhOy0tZHAtc3VjY2Vzcy1jb2xvci1kaXNhYmxlZDojNDI4ZjU5Oy0tZHAtaWNvbi1jb2xvcjojOTU5NTk1Oy0tZHAtZGFuZ2VyLWNvbG9yOiNlNTM5MzU7LS1kcC1tYXJrZXItY29sb3I6I2U1MzkzNTstLWRwLXRvb2x0aXAtY29sb3I6IzNlM2UzZTstLWRwLWhpZ2hsaWdodC1jb2xvcjojMDA1Y2IyMzM7LS1kcC1yYW5nZS1iZXR3ZWVuLWRhdGVzLWJhY2tncm91bmQtY29sb3I6dmFyKC0tZHAtaG92ZXItY29sb3IsIzQ4NDg0OCk7LS1kcC1yYW5nZS1iZXR3ZWVuLWRhdGVzLXRleHQtY29sb3I6dmFyKC0tZHAtaG92ZXItdGV4dC1jb2xvciwjZmZmKTstLWRwLXJhbmdlLWJldHdlZW4tYm9yZGVyLWNvbG9yOnZhcigtLWRwLWhvdmVyLWNvbG9yLCNmZmYpOy0tZHAtbG9hZGVyOjVweCBzb2xpZCAjMDA1Y2IyfS5kcC0tdGhlbWUtbGlnaHR7LS1kcC1iYWNrZ3JvdW5kLWNvbG9yOiNmZmY7LS1kcC10ZXh0LWNvbG9yOiMyMTIxMjE7LS1kcC1ob3Zlci1jb2xvcjojZjNmM2YzOy0tZHAtaG92ZXItdGV4dC1jb2xvcjojMjEyMTIxOy0tZHAtaG92ZXItaWNvbi1jb2xvcjojOTU5NTk1Oy0tZHAtcHJpbWFyeS1jb2xvcjojMTk3NmQyOy0tZHAtcHJpbWFyeS1kaXNhYmxlZC1jb2xvcjojNmJhY2VhOy0tZHAtcHJpbWFyeS10ZXh0LWNvbG9yOiNmZmY7LS1kcC1zZWNvbmRhcnktY29sb3I6I2MwYzRjYzstLWRwLWJvcmRlci1jb2xvcjojZGRkOy0tZHAtbWVudS1ib3JkZXItY29sb3I6I2RkZDstLWRwLWJvcmRlci1jb2xvci1ob3ZlcjojYWFhZWI3Oy0tZHAtYm9yZGVyLWNvbG9yLWZvY3VzOiNhYWFlYjc7LS1kcC1kaXNhYmxlZC1jb2xvcjojZjZmNmY2Oy0tZHAtc2Nyb2xsLWJhci1iYWNrZ3JvdW5kOiNmM2YzZjM7LS1kcC1zY3JvbGwtYmFyLWNvbG9yOiM5NTk1OTU7LS1kcC1zdWNjZXNzLWNvbG9yOiM3NmQyNzU7LS1kcC1zdWNjZXNzLWNvbG9yLWRpc2FibGVkOiNhM2Q5YjE7LS1kcC1pY29uLWNvbG9yOiM5NTk1OTU7LS1kcC1kYW5nZXItY29sb3I6I2ZmNmY2MDstLWRwLW1hcmtlci1jb2xvcjojZmY2ZjYwOy0tZHAtdG9vbHRpcC1jb2xvcjojZmFmYWZhOy0tZHAtZGlzYWJsZWQtY29sb3ItdGV4dDojOGU4ZThlOy0tZHAtaGlnaGxpZ2h0LWNvbG9yOiMxOTc2ZDIxYTstLWRwLXJhbmdlLWJldHdlZW4tZGF0ZXMtYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1kcC1ob3Zlci1jb2xvciwjZjNmM2YzKTstLWRwLXJhbmdlLWJldHdlZW4tZGF0ZXMtdGV4dC1jb2xvcjp2YXIoLS1kcC1ob3Zlci10ZXh0LWNvbG9yLCMyMTIxMjEpOy0tZHAtcmFuZ2UtYmV0d2Vlbi1ib3JkZXItY29sb3I6dmFyKC0tZHAtaG92ZXItY29sb3IsI2YzZjNmMyk7LS1kcC1sb2FkZXI6NXB4IHNvbGlkICMxOTc2ZDJ9LmNhbGVuZGFyLW5leHQtZW50ZXItYWN0aXZlLC5jYWxlbmRhci1uZXh0LWxlYXZlLWFjdGl2ZSwuY2FsZW5kYXItcHJldi1lbnRlci1hY3RpdmUsLmNhbGVuZGFyLXByZXYtbGVhdmUtYWN0aXZle3RyYW5zaXRpb246YWxsIHZhcigtLWRwLXRyYW5zaXRpb24tdGltaW5nLWdlbmVyYWwpIGVhc2Utb3V0fS5jYWxlbmRhci1uZXh0LWVudGVyLWZyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVYKHZhcigtLWRwLXRyYW5zaXRpb24tbGVuZ3RoKSl9LmNhbGVuZGFyLW5leHQtbGVhdmUtdG8sLmNhbGVuZGFyLXByZXYtZW50ZXItZnJvbXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoY2FsYyh2YXIoLS1kcC10cmFuc2l0aW9uLWxlbmd0aCkgKiAtMSkpfS5jYWxlbmRhci1wcmV2LWxlYXZlLXRve29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWCh2YXIoLS1kcC10cmFuc2l0aW9uLWxlbmd0aCkpfS5kcC1tZW51LWFwcGVhci1ib3R0b20tZW50ZXItYWN0aXZlLC5kcC1tZW51LWFwcGVhci1ib3R0b20tbGVhdmUtYWN0aXZlLC5kcC1tZW51LWFwcGVhci10b3AtZW50ZXItYWN0aXZlLC5kcC1tZW51LWFwcGVhci10b3AtbGVhdmUtYWN0aXZlLC5kcC1zbGlkZS11cC1lbnRlci1hY3RpdmUsLmRwLXNsaWRlLXVwLWxlYXZlLWFjdGl2ZSwuZHAtc2xpZGUtZG93bi1lbnRlci1hY3RpdmUsLmRwLXNsaWRlLWRvd24tbGVhdmUtYWN0aXZle3RyYW5zaXRpb246YWxsIHZhcigtLWRwLWFuaW1hdGlvbi1kdXJhdGlvbikgdmFyKC0tZHAtdHJhbnNpdGlvbi10aW1pbmcpfS5kcC1tZW51LWFwcGVhci10b3AtZW50ZXItZnJvbSwuZHAtbWVudS1hcHBlYXItdG9wLWxlYXZlLXRvLC5kcC1zbGlkZS1kb3duLWxlYXZlLXRvLC5kcC1zbGlkZS11cC1lbnRlci1mcm9te29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSh2YXIoLS1kcC10cmFuc2l0aW9uLWxlbmd0aCkpfS5kcC1tZW51LWFwcGVhci1ib3R0b20tZW50ZXItZnJvbSwuZHAtbWVudS1hcHBlYXItYm90dG9tLWxlYXZlLXRvLC5kcC1zbGlkZS1kb3duLWVudGVyLWZyb20sLmRwLXNsaWRlLXVwLWxlYXZlLXRve29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWShjYWxjKHZhcigtLWRwLXRyYW5zaXRpb24tbGVuZ3RoKSAqIC0xKSl9LmRwLS1mbGV4LWRpc3BsYXktd2l0aC1pbnB1dHtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24taXRlbXM6ZmxleC1zdGFydH1cbi8qJHZpdGUkOjEqLyJdfQ== */";
styleInject(css_248z$b);

// Validator function that checks the date props.
const _datePropValidator = (v) => {
    return v === null
            || v instanceof Date
            || typeof v === 'string'
            || typeof v === 'number'
};

const _normalizeClass = (value) => {
    if (!value) {
        return []
    }

    if (typeof value === 'string') {
        return value.split(/\s+/).filter(Boolean)
    }

    if (Array.isArray(value)) {
        return value.flatMap(_normalizeClass)
    }

    if (typeof value === 'object') {
        return Object.keys(value).filter(key => value[key])
    }

    return []
};

const _mergeClasses = (...values) => {
    return [...new Set(values.flatMap(_normalizeClass))]
};

const _normalizeDate = (value) => {
    if (value === null || typeof value === 'undefined') {
        return null
    }

    const date = value instanceof Date ? value : new Date(value);

    return Number.isNaN(date.getTime()) ? null : date
};

const _isSameDay = (left, right) => {
    return left.getFullYear() === right.getFullYear()
            && left.getMonth() === right.getMonth()
            && left.getDate() === right.getDate()
};

const _isInRange = (value, range) => {
    const from = _normalizeDate(range && range.from);
    const to = _normalizeDate(range && range.to);

    return Boolean(from && to && value >= from && value <= to)
};

var script$F = {
    name: 'd-datepicker',
    components: { VueDatePicker },
    emits: ['update:modelValue', 'input'],
    props: {
        /**
         * The datepicker's value.
         */
        modelValue: {
            validator: v => typeof v === 'undefined' || _datePropValidator(v)
        },
        value: {
            validator: _datePropValidator
        },
        /**
         * The name.
         */
        name: {
            type: String,
            default: null
        },
        /**
         * The component's ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The date format.
         */
        format: {
            type: [String, Function],
            default: 'dd MMM yyyy'
        },
        /**
         * The language.
         */
        language: Object,
        /**
         * If set, the datepicker will open on this date.
         */
        openDate: {
            validator: _datePropValidator
        },
        /**
         * Function used to render custom content inside the day cell.
         */
        dayCellContent: Function,
        /**
         * Whether to show the full month name, or not.
         */
        fullMonthName: Boolean,
        /**
         * Configure disabled dates.
         */
        disabledDates: Object,
        /**
         * Highlight dates.
         */
        highlighted: Object,
        /**
         * The placeholder.
         */
        placeholder: String,
        /**
         * Show the datepicker always open.
         */
        inline: Boolean,
        /**
         * The CSS class applied to the calendar element.
         */
        calendarClass: {
            type: [String, Object, Array],
            default: ''
        },
        /**
         * The CSS Class applied to the input element.
         */
        inputClass: {
            type: [String, Object, Array],
            default: 'form-control'
        },
        /**
         * The CSS class applied to the wrapper element.
         */
        wrapperClass: [String, Object, Array],
        /**
         * Whether Monday is the first day, or not.
         */
        mondayFirst: Boolean,
        /**
         * Display a button for clearing the dates.
         */
        clearButton: Boolean,
        /**
         * Use an icon for the clear button.
         */
        clearButtonIcon: String,
        /**
         * Dislay a calendar button.
         */
        calendarButton: Boolean,
        /**
         * The calendar button's icon.
         */
        calendarButtonIcon: String,
        /**
         * The calendar button's icon content.
         */
        calendarButtonIconContent: String,
        /**
         * If set, the datepicker is opened on that specific view.
         */
        initialView: String,
        /**
         * The disabled state.
         */
        disabled: Boolean,
        /**
         * The required state.
         */
        required: Boolean,
        /**
         * Whether to allow users to type the date, or not.
         */
        typeable: Boolean,
        /**
         * Use UTC for time calculations.
         */
        useUtc: Boolean,
        /**
         * If set, the lower-level views will not be shown.
         */
        minimumView: {
            type: String,
            default: 'day'
        },
        /**
         * If set, the higher-level views will not be shown.
         */
        maximumView: {
            type: String,
            default: 'year'
        },
        /**
         * Whether the datepicker should be small, or not.
         */
        small: {
            type: Boolean,
            default: false
        },
        /**
         * Advanced UI class configuration passed to @vuepic/vue-datepicker.
         */
        ui: {
            type: Object,
            default: () => ({})
        },
        /**
         * Advanced input attributes passed to @vuepic/vue-datepicker.
         */
        inputAttrs: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        computedValue() {
            return this.modelValue !== undefined ? this.modelValue : this.value
        },
        computedLocale() {
            if (typeof this.language === 'string') {
                return this.language
            }

            return this.language && (this.language.language || this.language.lang || this.language.id)
        },
        computedFormats() {
            return {
                input: this.format,
                month: this.fullMonthName ? 'MMMM' : 'LLL'
            }
        },
        computedDisabledDates() {
            if (!this.disabledDates || Array.isArray(this.disabledDates) || typeof this.disabledDates === 'function') {
                return this.disabledDates
            }

            const disabledDates = this.disabledDates;
            const to = _normalizeDate(disabledDates.to);
            const from = _normalizeDate(disabledDates.from);
            const dates = Array.isArray(disabledDates.dates)
                ? disabledDates.dates.map(_normalizeDate).filter(Boolean)
                : [];
            const ranges = Array.isArray(disabledDates.ranges) ? disabledDates.ranges : [];

            return (date) => {
                const value = _normalizeDate(date);

                if (!value) {
                    return false
                }

                return Boolean(
                    (to && value <= to)
                    || (from && value >= from)
                    || (Array.isArray(disabledDates.days) && disabledDates.days.includes(value.getDay()))
                    || (Array.isArray(disabledDates.daysOfMonth) && disabledDates.daysOfMonth.includes(value.getDate()))
                    || dates.some(disabledDate => _isSameDay(value, disabledDate))
                    || ranges.some(range => _isInRange(value, range))
                    || (disabledDates.customPredictor && disabledDates.customPredictor(value))
                )
            }
        },
        computedHighlight() {
            if (!this.highlighted || typeof this.highlighted === 'function') {
                return this.highlighted
            }

            const highlighted = this.highlighted;
            const from = _normalizeDate(highlighted.from);
            const to = _normalizeDate(highlighted.to);
            const dates = Array.isArray(highlighted.dates)
                ? highlighted.dates.map(_normalizeDate).filter(Boolean)
                : [];

            const hasRange = Boolean(from && to);

            if (!hasRange && !dates.length && !highlighted.customPredictor) {
                return highlighted
            }

            return (date) => {
                const value = _normalizeDate(date);

                if (!value) {
                    return false
                }

                if (hasRange) {
                    return value >= from && value <= to
                }

                if (dates.some(highlightedDate => _isSameDay(value, highlightedDate))) {
                    return true
                }

                return highlighted.customPredictor ? highlighted.customPredictor(value) : false
            }
        },
        computedWrapperClass() {
            return [
                'vdp-datepicker',
                this.wrapperClass
            ]
        },
        computedInputAttrs() {
            return {
                ...this.inputAttrs,
                name: this.name || this.inputAttrs.name,
                id: this.id || this.inputAttrs.id,
                required: this.required || Boolean(this.inputAttrs.required),
                clearable: this.clearButton,
                hideInputIcon: !this.calendarButton
            }
        },
        computedUi() {
            return {
                ...this.ui,
                input: _mergeClasses('vdp-datepicker__input', this.inputClass, this.ui.input),
                menu: _mergeClasses(
                    'vdp-datepicker__calendar',
                    this.small ? 'vdp-datepicker__small' : '',
                    this.calendarClass,
                    this.ui.menu
                ),
                calendar: _mergeClasses('vdp-datepicker__calendar-grid', this.ui.calendar),
                calendarCell: _mergeClasses('vdp-datepicker__cell', this.ui.calendarCell),
                navBtnPrev: _mergeClasses('vdp-datepicker__nav-button', this.ui.navBtnPrev),
                navBtnNext: _mergeClasses('vdp-datepicker__nav-button', this.ui.navBtnNext)
            }
        }
    },
    methods: {
        handleUpdate(value) {
            this.$emit('update:modelValue', value);
            this.$emit('input', value);
        }
    }
};

function render$F(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VueDatePicker = resolveComponent("VueDatePicker");

  return (openBlock(), createBlock(_component_VueDatePicker, mergeProps({
    "model-value": $options.computedValue,
    formats: $options.computedFormats,
    locale: $options.computedLocale,
    "start-date": $props.openDate,
    "disabled-dates": $options.computedDisabledDates,
    highlight: $options.computedHighlight,
    placeholder: $props.placeholder,
    inline: $props.inline,
    "input-attrs": $options.computedInputAttrs,
    ui: $options.computedUi,
    class: $options.computedWrapperClass,
    "week-start": $props.mondayFirst ? 1 : undefined,
    "auto-apply": true,
    "enable-time-picker": false,
    "time-config": { enableTimePicker: false },
    disabled: $props.disabled,
    "text-input": $props.typeable
  }, _ctx.$attrs, { "onUpdate:modelValue": $options.handleUpdate }), null, 16 /* FULL_PROPS */, ["model-value", "formats", "locale", "start-date", "disabled-dates", "highlight", "placeholder", "inline", "input-attrs", "ui", "class", "week-start", "disabled", "text-input", "onUpdate:modelValue"]))
}

var css_248z$a = "div.vdp-datepicker {\n  --dp-font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;\n  --dp-font-size: 1rem;\n  --dp-border-radius: 0.375rem;\n  --dp-cell-border-radius: 0.375rem;\n  --dp-cell-size: 36px;\n  --dp-primary-color: #007bff;\n  --dp-primary-text-color: #fff;\n  --dp-background-color: #fff;\n  --dp-text-color: #5a6169;\n  --dp-hover-color: #eceeef;\n  --dp-hover-text-color: #5a6169;\n  --dp-hover-icon-color: #5a6169;\n  --dp-icon-color: #c3c7cc;\n  --dp-border-color: rgba(0, 0, 0, .15);\n  --dp-menu-border-color: rgba(0, 0, 0, .15);\n  --dp-border-color-hover: #c3c7cc;\n  --dp-border-color-focus: #007bff;\n  --dp-highlight-color: #007bff;\n  --dp-range-between-dates-background-color: #007bff;\n  --dp-range-between-dates-text-color: #fff;\n  --dp-range-between-border-color: #007bff;\n  --dp-input-padding: .4375rem .75rem;\n  --dp-input-icon-padding: 2.25rem;\n  --dp-menu-padding: 0;\n  --dp-menu-min-width: 10rem;\n  display: inline-block;\n  width: 100%;\n}\ndiv.vdp-datepicker .dp--input-wrap {\n  width: 100%;\n}\ndiv.vdp-datepicker .vdp-datepicker__input.dp--input {\n  background-color: #fff;\n}\ndiv.vdp-datepicker__calendar {\n  color: #5a6169;\n  padding: 20px 22px;\n  min-width: 10rem;\n  font-size: 1rem;\n  font-weight: 300;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  background-color: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.05);\n  border-radius: 0.375rem;\n  box-shadow: 0 0.5rem 4rem rgba(0, 0, 0, 0.11), 0 10px 20px rgba(0, 0, 0, 0.05), 0 2px 3px rgba(0, 0, 0, 0.06);\n  border: 1px solid rgba(0, 0, 0, 0.15) !important;\n}\ndiv.vdp-datepicker__calendar .dp--menu-inner {\n  padding: 0;\n}\ndiv.vdp-datepicker__calendar .dp--month-year-row {\n  padding-bottom: 10px;\n}\ndiv.vdp-datepicker__calendar .dp--calendar-header {\n  font-weight: 500;\n}\ndiv.vdp-datepicker__calendar .dp--calendar-header-separator {\n  display: none;\n}\ndiv.vdp-datepicker__calendar .dp--month-year-select-base,\ndiv.vdp-datepicker__calendar .dp--inner-nav,\ndiv.vdp-datepicker__calendar .dp--cell-inner {\n  transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);\n  border-radius: 0.375rem;\n}\ndiv.vdp-datepicker__calendar .dp--inner-nav {\n  color: #c3c7cc;\n}\ndiv.vdp-datepicker__calendar .dp--month-year-select-base {\n  font-weight: 500;\n}\ndiv.vdp-datepicker__calendar .dp--calendar-header-item,\ndiv.vdp-datepicker__calendar .dp--cell-inner {\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  font-size: 1rem;\n}\ndiv.vdp-datepicker__calendar .dp--cell-inner {\n  line-height: 2;\n  border-color: transparent;\n}\ndiv.vdp-datepicker__calendar .dp--calendar-row {\n  margin: 0;\n}\ndiv.vdp-datepicker__calendar .dp--date-hoverable:hover,\ndiv.vdp-datepicker__calendar .dp--month-year-select-base:hover,\ndiv.vdp-datepicker__calendar .dp--inner-nav:hover {\n  background-color: #eceeef;\n  border-color: transparent !important;\n}\ndiv.vdp-datepicker__calendar .dp--active,\ndiv.vdp-datepicker__calendar .dp--range-border-start,\ndiv.vdp-datepicker__calendar .dp--range-border-end,\ndiv.vdp-datepicker__calendar .dp--cell-highlight,\ndiv.vdp-datepicker__calendar .dp--cell-highlight-active {\n  background: #007bff !important;\n  color: #fff;\n}\ndiv.vdp-datepicker__calendar .dp--active:hover,\ndiv.vdp-datepicker__calendar .dp--cell-highlight:hover,\ndiv.vdp-datepicker__calendar .dp--cell-highlight-active:hover {\n  background: rgb(0, 110.7, 229.5) !important;\n  border-color: transparent !important;\n}\ndiv.vdp-datepicker__calendar .dp--range-between {\n  background: #007bff;\n  border-color: #007bff;\n  color: #fff;\n  border-radius: 0;\n}\ndiv.vdp-datepicker__calendar header {\n  display: flex;\n  padding-bottom: 10px;\n}\ndiv.vdp-datepicker__calendar header span {\n  transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);\n  border-radius: 0.375rem;\n  font-weight: 500;\n}\ndiv.vdp-datepicker__calendar header span.next:after {\n  border-left-color: #c3c7cc;\n}\ndiv.vdp-datepicker__calendar header span.prev:after {\n  border-right-color: #c3c7cc;\n}\ndiv.vdp-datepicker__calendar header span:hover,\ndiv.vdp-datepicker__calendar .cell.day:not(.disabled):not(.blank):hover, div.vdp-datepicker__calendar .cell.month:hover, div.vdp-datepicker__calendar .cell.year:hover {\n  background-color: #eceeef;\n  border-color: transparent !important;\n}\ndiv.vdp-datepicker__calendar .cell {\n  line-height: 2;\n  font-size: 1rem;\n  border-radius: 0.375rem;\n  transition: all 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);\n  border-color: transparent;\n  height: auto;\n}\ndiv.vdp-datepicker__calendar .cell.day-header {\n  font-weight: 500;\n}\ndiv.vdp-datepicker__calendar .cell.day {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n}\ndiv.vdp-datepicker__calendar .cell.month, div.vdp-datepicker__calendar .cell.year {\n  height: 36px;\n  font-size: 12px;\n  line-height: 33px;\n}\ndiv.vdp-datepicker__calendar .cell.selected, div.vdp-datepicker__calendar .cell.highlighted.selected {\n  background: #007bff !important;\n  color: #fff;\n}\ndiv.vdp-datepicker__calendar .cell.selected:hover, div.vdp-datepicker__calendar .cell.highlighted.selected:hover {\n  background: rgb(0, 110.7, 229.5) !important;\n  border-color: transparent !important;\n}\ndiv.vdp-datepicker__calendar .cell.highlighted {\n  background: #007bff;\n  color: #fff;\n}\ndiv.vdp-datepicker__calendar .cell.highlighted:hover {\n  background: rgb(0, 110.7, 229.5) !important;\n  border-color: transparent !important;\n}\ndiv.vdp-datepicker__calendar .cell.highlighted:not(.highlight-start):not(.highlight-end) {\n  border-radius: 0;\n}\ndiv.vdp-datepicker__calendar .cell.highlighted.highlight-start {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\ndiv.vdp-datepicker__calendar .cell.highlighted.highlight-end {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\ndiv.vdp-datepicker__small {\n  --dp-font-size: 0.75rem;\n  --dp-cell-size: 1.875rem;\n  padding: 0.625rem 0.625rem;\n  font-size: 0.75rem;\n  max-width: 235px;\n}\ndiv.vdp-datepicker__small .dp--calendar-header-item,\ndiv.vdp-datepicker__small .dp--cell-inner {\n  width: 1.875rem;\n  height: 1.875rem;\n  line-height: 2.25;\n  font-size: 12px;\n  font-weight: 500;\n}\ndiv.vdp-datepicker__small .dp--calendar-header-item {\n  font-size: 100%;\n}\ndiv.vdp-datepicker__small .cell.day {\n  width: 1.875rem;\n  height: 1.875rem;\n  line-height: 2.25;\n}\ndiv.vdp-datepicker__small .cell.day, div.vdp-datepicker__small .cell.month, div.vdp-datepicker__small .cell.year {\n  font-size: 12px;\n  font-weight: 500;\n}\ndiv.vdp-datepicker__small .cell.day-header {\n  font-size: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGVwaWNrZXIudnVlJTNGdnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD1lMjIxYzZhMiZsYW5nLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLDRKQUE0SjtFQUM1SixvQkFBb0I7RUFDcEIsNEJBQTRCO0VBQzVCLGlDQUFpQztFQUNqQyxvQkFBb0I7RUFDcEIsMkJBQTJCO0VBQzNCLDZCQUE2QjtFQUM3QiwyQkFBMkI7RUFDM0Isd0JBQXdCO0VBQ3hCLHlCQUF5QjtFQUN6Qiw4QkFBOEI7RUFDOUIsOEJBQThCO0VBQzlCLHdCQUF3QjtFQUN4QixxQ0FBcUM7RUFDckMsMENBQTBDO0VBQzFDLGdDQUFnQztFQUNoQyxnQ0FBZ0M7RUFDaEMsNkJBQTZCO0VBQzdCLGtEQUFrRDtFQUNsRCx5Q0FBeUM7RUFDekMsd0NBQXdDO0VBQ3hDLG1DQUFtQztFQUNuQyxnQ0FBZ0M7RUFDaEMsb0JBQW9CO0VBQ3BCLDBCQUEwQjtFQUMxQixxQkFBcUI7RUFDckIsV0FBVztBQUNiO0FBQ0E7RUFDRSxXQUFXO0FBQ2I7QUFDQTtFQUNFLHNCQUFzQjtBQUN4QjtBQUNBO0VBQ0UsY0FBYztFQUNkLGtCQUFrQjtFQUNsQixnQkFBZ0I7RUFDaEIsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixpS0FBaUs7RUFDakssc0JBQXNCO0VBQ3RCLHFDQUFxQztFQUNyQyx1QkFBdUI7RUFDdkIsNkdBQTZHO0VBQzdHLGdEQUFnRDtBQUNsRDtBQUNBO0VBQ0UsVUFBVTtBQUNaO0FBQ0E7RUFDRSxvQkFBb0I7QUFDdEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUNBO0VBQ0UsYUFBYTtBQUNmO0FBQ0E7OztFQUdFLDBEQUEwRDtFQUMxRCx1QkFBdUI7QUFDekI7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjtBQUNBOztFQUVFLFdBQVc7RUFDWCxZQUFZO0VBQ1osVUFBVTtFQUNWLGVBQWU7QUFDakI7QUFDQTtFQUNFLGNBQWM7RUFDZCx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLFNBQVM7QUFDWDtBQUNBOzs7RUFHRSx5QkFBeUI7RUFDekIsb0NBQW9DO0FBQ3RDO0FBQ0E7Ozs7O0VBS0UsOEJBQThCO0VBQzlCLFdBQVc7QUFDYjtBQUNBOzs7RUFHRSwyQ0FBMkM7RUFDM0Msb0NBQW9DO0FBQ3RDO0FBQ0E7RUFDRSxtQkFBbUI7RUFDbkIscUJBQXFCO0VBQ3JCLFdBQVc7RUFDWCxnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLGFBQWE7RUFDYixvQkFBb0I7QUFDdEI7QUFDQTtFQUNFLDBEQUEwRDtFQUMxRCx1QkFBdUI7RUFDdkIsZ0JBQWdCO0FBQ2xCO0FBQ0E7RUFDRSwwQkFBMEI7QUFDNUI7QUFDQTtFQUNFLDJCQUEyQjtBQUM3QjtBQUNBOztFQUVFLHlCQUF5QjtFQUN6QixvQ0FBb0M7QUFDdEM7QUFDQTtFQUNFLGNBQWM7RUFDZCxlQUFlO0VBQ2YsdUJBQXVCO0VBQ3ZCLDBEQUEwRDtFQUMxRCx5QkFBeUI7RUFDekIsWUFBWTtBQUNkO0FBQ0E7RUFDRSxnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLFdBQVc7RUFDWCxZQUFZO0VBQ1osa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxZQUFZO0VBQ1osZUFBZTtFQUNmLGlCQUFpQjtBQUNuQjtBQUNBO0VBQ0UsOEJBQThCO0VBQzlCLFdBQVc7QUFDYjtBQUNBO0VBQ0UsMkNBQTJDO0VBQzNDLG9DQUFvQztBQUN0QztBQUNBO0VBQ0UsbUJBQW1CO0VBQ25CLFdBQVc7QUFDYjtBQUNBO0VBQ0UsMkNBQTJDO0VBQzNDLG9DQUFvQztBQUN0QztBQUNBO0VBQ0UsZ0JBQWdCO0FBQ2xCO0FBQ0E7RUFDRSwwQkFBMEI7RUFDMUIsNkJBQTZCO0FBQy9CO0FBQ0E7RUFDRSx5QkFBeUI7RUFDekIsNEJBQTRCO0FBQzlCO0FBQ0E7RUFDRSx1QkFBdUI7RUFDdkIsd0JBQXdCO0VBQ3hCLDBCQUEwQjtFQUMxQixrQkFBa0I7RUFDbEIsZ0JBQWdCO0FBQ2xCO0FBQ0E7O0VBRUUsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixpQkFBaUI7RUFDakIsZUFBZTtFQUNmLGdCQUFnQjtBQUNsQjtBQUNBO0VBQ0UsZUFBZTtBQUNqQjtBQUNBO0VBQ0UsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixpQkFBaUI7QUFDbkI7QUFDQTtFQUNFLGVBQWU7RUFDZixnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLGVBQWU7QUFDakIiLCJmaWxlIjoiRGF0ZXBpY2tlci52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD1lMjIxYzZhMiZsYW5nLmNzcyIsInNvdXJjZXNDb250ZW50IjpbImRpdi52ZHAtZGF0ZXBpY2tlciB7XG4gIC0tZHAtZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgU2Vnb2UgVUksIFJvYm90bywgSGVsdmV0aWNhIE5ldWUsIEFyaWFsLCBzYW5zLXNlcmlmLCBBcHBsZSBDb2xvciBFbW9qaSwgU2Vnb2UgVUkgRW1vamksIFNlZ29lIFVJIFN5bWJvbDtcbiAgLS1kcC1mb250LXNpemU6IDFyZW07XG4gIC0tZHAtYm9yZGVyLXJhZGl1czogMC4zNzVyZW07XG4gIC0tZHAtY2VsbC1ib3JkZXItcmFkaXVzOiAwLjM3NXJlbTtcbiAgLS1kcC1jZWxsLXNpemU6IDM2cHg7XG4gIC0tZHAtcHJpbWFyeS1jb2xvcjogIzAwN2JmZjtcbiAgLS1kcC1wcmltYXJ5LXRleHQtY29sb3I6ICNmZmY7XG4gIC0tZHAtYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgLS1kcC10ZXh0LWNvbG9yOiAjNWE2MTY5O1xuICAtLWRwLWhvdmVyLWNvbG9yOiAjZWNlZWVmO1xuICAtLWRwLWhvdmVyLXRleHQtY29sb3I6ICM1YTYxNjk7XG4gIC0tZHAtaG92ZXItaWNvbi1jb2xvcjogIzVhNjE2OTtcbiAgLS1kcC1pY29uLWNvbG9yOiAjYzNjN2NjO1xuICAtLWRwLWJvcmRlci1jb2xvcjogcmdiYSgwLCAwLCAwLCAuMTUpO1xuICAtLWRwLW1lbnUtYm9yZGVyLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC4xNSk7XG4gIC0tZHAtYm9yZGVyLWNvbG9yLWhvdmVyOiAjYzNjN2NjO1xuICAtLWRwLWJvcmRlci1jb2xvci1mb2N1czogIzAwN2JmZjtcbiAgLS1kcC1oaWdobGlnaHQtY29sb3I6ICMwMDdiZmY7XG4gIC0tZHAtcmFuZ2UtYmV0d2Vlbi1kYXRlcy1iYWNrZ3JvdW5kLWNvbG9yOiAjMDA3YmZmO1xuICAtLWRwLXJhbmdlLWJldHdlZW4tZGF0ZXMtdGV4dC1jb2xvcjogI2ZmZjtcbiAgLS1kcC1yYW5nZS1iZXR3ZWVuLWJvcmRlci1jb2xvcjogIzAwN2JmZjtcbiAgLS1kcC1pbnB1dC1wYWRkaW5nOiAuNDM3NXJlbSAuNzVyZW07XG4gIC0tZHAtaW5wdXQtaWNvbi1wYWRkaW5nOiAyLjI1cmVtO1xuICAtLWRwLW1lbnUtcGFkZGluZzogMDtcbiAgLS1kcC1tZW51LW1pbi13aWR0aDogMTByZW07XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgd2lkdGg6IDEwMCU7XG59XG5kaXYudmRwLWRhdGVwaWNrZXIgLmRwLS1pbnB1dC13cmFwIHtcbiAgd2lkdGg6IDEwMCU7XG59XG5kaXYudmRwLWRhdGVwaWNrZXIgLnZkcC1kYXRlcGlja2VyX19pbnB1dC5kcC0taW5wdXQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciB7XG4gIGNvbG9yOiAjNWE2MTY5O1xuICBwYWRkaW5nOiAyMHB4IDIycHg7XG4gIG1pbi13aWR0aDogMTByZW07XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgZm9udC13ZWlnaHQ6IDMwMDtcbiAgZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFwiSGVsdmV0aWNhIE5ldWVcIiwgQXJpYWwsIHNhbnMtc2VyaWYsIFwiQXBwbGUgQ29sb3IgRW1vamlcIiwgXCJTZWdvZSBVSSBFbW9qaVwiLCBcIlNlZ29lIFVJIFN5bWJvbFwiO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMDUpO1xuICBib3JkZXItcmFkaXVzOiAwLjM3NXJlbTtcbiAgYm94LXNoYWRvdzogMCAwLjVyZW0gNHJlbSByZ2JhKDAsIDAsIDAsIDAuMTEpLCAwIDEwcHggMjBweCByZ2JhKDAsIDAsIDAsIDAuMDUpLCAwIDJweCAzcHggcmdiYSgwLCAwLCAwLCAwLjA2KTtcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjE1KSAhaW1wb3J0YW50O1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuZHAtLW1lbnUtaW5uZXIge1xuICBwYWRkaW5nOiAwO1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuZHAtLW1vbnRoLXllYXItcm93IHtcbiAgcGFkZGluZy1ib3R0b206IDEwcHg7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5kcC0tY2FsZW5kYXItaGVhZGVyIHtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmRwLS1jYWxlbmRhci1oZWFkZXItc2VwYXJhdG9yIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmRwLS1tb250aC15ZWFyLXNlbGVjdC1iYXNlLFxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuZHAtLWlubmVyLW5hdixcbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmRwLS1jZWxsLWlubmVyIHtcbiAgdHJhbnNpdGlvbjogYWxsIDI1MG1zIGN1YmljLWJlemllcigwLjI3LCAwLjAxLCAwLjM4LCAxLjA2KTtcbiAgYm9yZGVyLXJhZGl1czogMC4zNzVyZW07XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5kcC0taW5uZXItbmF2IHtcbiAgY29sb3I6ICNjM2M3Y2M7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5kcC0tbW9udGgteWVhci1zZWxlY3QtYmFzZSB7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5kcC0tY2FsZW5kYXItaGVhZGVyLWl0ZW0sXG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5kcC0tY2VsbC1pbm5lciB7XG4gIHdpZHRoOiAzNnB4O1xuICBoZWlnaHQ6IDM2cHg7XG4gIHBhZGRpbmc6IDA7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbn1cbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmRwLS1jZWxsLWlubmVyIHtcbiAgbGluZS1oZWlnaHQ6IDI7XG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5kcC0tY2FsZW5kYXItcm93IHtcbiAgbWFyZ2luOiAwO1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuZHAtLWRhdGUtaG92ZXJhYmxlOmhvdmVyLFxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuZHAtLW1vbnRoLXllYXItc2VsZWN0LWJhc2U6aG92ZXIsXG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5kcC0taW5uZXItbmF2OmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VjZWVlZjtcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuZHAtLWFjdGl2ZSxcbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmRwLS1yYW5nZS1ib3JkZXItc3RhcnQsXG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5kcC0tcmFuZ2UtYm9yZGVyLWVuZCxcbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmRwLS1jZWxsLWhpZ2hsaWdodCxcbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmRwLS1jZWxsLWhpZ2hsaWdodC1hY3RpdmUge1xuICBiYWNrZ3JvdW5kOiAjMDA3YmZmICFpbXBvcnRhbnQ7XG4gIGNvbG9yOiAjZmZmO1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuZHAtLWFjdGl2ZTpob3ZlcixcbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmRwLS1jZWxsLWhpZ2hsaWdodDpob3ZlcixcbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmRwLS1jZWxsLWhpZ2hsaWdodC1hY3RpdmU6aG92ZXIge1xuICBiYWNrZ3JvdW5kOiByZ2IoMCwgMTEwLjcsIDIyOS41KSAhaW1wb3J0YW50O1xuICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5kcC0tcmFuZ2UtYmV0d2VlbiB7XG4gIGJhY2tncm91bmQ6ICMwMDdiZmY7XG4gIGJvcmRlci1jb2xvcjogIzAwN2JmZjtcbiAgY29sb3I6ICNmZmY7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIGhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmctYm90dG9tOiAxMHB4O1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciBoZWFkZXIgc3BhbiB7XG4gIHRyYW5zaXRpb246IGFsbCAyNTBtcyBjdWJpYy1iZXppZXIoMC4yNywgMC4wMSwgMC4zOCwgMS4wNik7XG4gIGJvcmRlci1yYWRpdXM6IDAuMzc1cmVtO1xuICBmb250LXdlaWdodDogNTAwO1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciBoZWFkZXIgc3Bhbi5uZXh0OmFmdGVyIHtcbiAgYm9yZGVyLWxlZnQtY29sb3I6ICNjM2M3Y2M7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIGhlYWRlciBzcGFuLnByZXY6YWZ0ZXIge1xuICBib3JkZXItcmlnaHQtY29sb3I6ICNjM2M3Y2M7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIGhlYWRlciBzcGFuOmhvdmVyLFxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuY2VsbC5kYXk6bm90KC5kaXNhYmxlZCk6bm90KC5ibGFuayk6aG92ZXIsIGRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmNlbGwubW9udGg6aG92ZXIsIGRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmNlbGwueWVhcjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlY2VlZWY7XG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbn1cbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmNlbGwge1xuICBsaW5lLWhlaWdodDogMjtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBib3JkZXItcmFkaXVzOiAwLjM3NXJlbTtcbiAgdHJhbnNpdGlvbjogYWxsIDI1MG1zIGN1YmljLWJlemllcigwLjI3LCAwLjAxLCAwLjM4LCAxLjA2KTtcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgaGVpZ2h0OiBhdXRvO1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuY2VsbC5kYXktaGVhZGVyIHtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmNlbGwuZGF5IHtcbiAgd2lkdGg6IDM2cHg7XG4gIGhlaWdodDogMzZweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuY2VsbC5tb250aCwgZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuY2VsbC55ZWFyIHtcbiAgaGVpZ2h0OiAzNnB4O1xuICBmb250LXNpemU6IDEycHg7XG4gIGxpbmUtaGVpZ2h0OiAzM3B4O1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuY2VsbC5zZWxlY3RlZCwgZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuY2VsbC5oaWdobGlnaHRlZC5zZWxlY3RlZCB7XG4gIGJhY2tncm91bmQ6ICMwMDdiZmYgIWltcG9ydGFudDtcbiAgY29sb3I6ICNmZmY7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5jZWxsLnNlbGVjdGVkOmhvdmVyLCBkaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5jZWxsLmhpZ2hsaWdodGVkLnNlbGVjdGVkOmhvdmVyIHtcbiAgYmFja2dyb3VuZDogcmdiKDAsIDExMC43LCAyMjkuNSkgIWltcG9ydGFudDtcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuY2VsbC5oaWdobGlnaHRlZCB7XG4gIGJhY2tncm91bmQ6ICMwMDdiZmY7XG4gIGNvbG9yOiAjZmZmO1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuY2VsbC5oaWdobGlnaHRlZDpob3ZlciB7XG4gIGJhY2tncm91bmQ6IHJnYigwLCAxMTAuNywgMjI5LjUpICFpbXBvcnRhbnQ7XG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbn1cbmRpdi52ZHAtZGF0ZXBpY2tlcl9fY2FsZW5kYXIgLmNlbGwuaGlnaGxpZ2h0ZWQ6bm90KC5oaWdobGlnaHQtc3RhcnQpOm5vdCguaGlnaGxpZ2h0LWVuZCkge1xuICBib3JkZXItcmFkaXVzOiAwO1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19jYWxlbmRhciAuY2VsbC5oaWdobGlnaHRlZC5oaWdobGlnaHQtc3RhcnQge1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX2NhbGVuZGFyIC5jZWxsLmhpZ2hsaWdodGVkLmhpZ2hsaWdodC1lbmQge1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xufVxuZGl2LnZkcC1kYXRlcGlja2VyX19zbWFsbCB7XG4gIC0tZHAtZm9udC1zaXplOiAwLjc1cmVtO1xuICAtLWRwLWNlbGwtc2l6ZTogMS44NzVyZW07XG4gIHBhZGRpbmc6IDAuNjI1cmVtIDAuNjI1cmVtO1xuICBmb250LXNpemU6IDAuNzVyZW07XG4gIG1heC13aWR0aDogMjM1cHg7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX3NtYWxsIC5kcC0tY2FsZW5kYXItaGVhZGVyLWl0ZW0sXG5kaXYudmRwLWRhdGVwaWNrZXJfX3NtYWxsIC5kcC0tY2VsbC1pbm5lciB7XG4gIHdpZHRoOiAxLjg3NXJlbTtcbiAgaGVpZ2h0OiAxLjg3NXJlbTtcbiAgbGluZS1oZWlnaHQ6IDIuMjU7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbn1cbmRpdi52ZHAtZGF0ZXBpY2tlcl9fc21hbGwgLmRwLS1jYWxlbmRhci1oZWFkZXItaXRlbSB7XG4gIGZvbnQtc2l6ZTogMTAwJTtcbn1cbmRpdi52ZHAtZGF0ZXBpY2tlcl9fc21hbGwgLmNlbGwuZGF5IHtcbiAgd2lkdGg6IDEuODc1cmVtO1xuICBoZWlnaHQ6IDEuODc1cmVtO1xuICBsaW5lLWhlaWdodDogMi4yNTtcbn1cbmRpdi52ZHAtZGF0ZXBpY2tlcl9fc21hbGwgLmNlbGwuZGF5LCBkaXYudmRwLWRhdGVwaWNrZXJfX3NtYWxsIC5jZWxsLm1vbnRoLCBkaXYudmRwLWRhdGVwaWNrZXJfX3NtYWxsIC5jZWxsLnllYXIge1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG59XG5kaXYudmRwLWRhdGVwaWNrZXJfX3NtYWxsIC5jZWxsLmRheS1oZWFkZXIge1xuICBmb250LXNpemU6IDEwMCU7XG59Il19 */";
styleInject(css_248z$a);

script$F.render = render$F;
script$F.__file = "src/components/datepicker/Datepicker.vue";

const components$l = {
    dDatepicker: script$F
};

const VuePlugin$n = {
  install (Vue) {
    registerComponents(Vue, components$l);
  }
};

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.16.1
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

var timeoutDuration = function () {
  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      return 1;
    }
  }
  return 0;
}();

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

/**
 * Returns the reference node of the reference object, or the reference object itself.
 * @method
 * @memberof Popper.Utils
 * @param {Element|Object} reference - the reference element (the popper will be relative to this)
 * @returns {Element} parent
 */
function getReferenceNode(reference) {
  return reference && reference.referenceNode ? reference.referenceNode : reference;
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.width;
  var height = sizes.height || element.clientHeight || result.height;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop);
    var marginLeft = parseFloat(styles.marginLeft);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicitly asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

    // flips variation if reference element overflows boundaries
    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    // flips variation if popper content overflows boundaries
    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

    var flippedVariation = flippedVariationByRef || flippedVariationByContent;

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport',
    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,
    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults$3 = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {Element|referenceObject} reference - The reference element used to position the popper
   * @param {Element} popper - The HTML / XML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults$3;

const KEY$1 = '__DR_CLICK_AWAY__';

function onClickAway(el, binding, event) {
    if (!el || el === event.target || el.contains(event.target)) {
        return
    }

    if (typeof binding.value === 'function') {
        binding.value(event);
    }
}

var clickAway = {
    beforeMount(el, binding) {
        if (typeof document === 'undefined') {
            return
        }

        const handler = event => onClickAway(el, binding, event);

        el[KEY$1] = handler;
        document.addEventListener('click', handler);
        document.addEventListener('touchstart', handler);
    },

    unmounted(el) {
        if (typeof document === 'undefined') {
            return
        }

        if (!el[KEY$1]) {
            return
        }

        document.removeEventListener('click', el[KEY$1]);
        document.removeEventListener('touchstart', el[KEY$1]);
        delete el[KEY$1];
    }
};

var script$E = {
    name: 'd-dropdown',
    directives: { clickAway },
    mixins: [rootListenerMixin],
    emits: ['show', 'shown', 'hide', 'hidden', 'toggle', 'click'],
    data() {
        return {
            visible: false,
            inNavbar: null,
            visibleChangePrevented: false
        }
    },
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The dropdown menu ID.
         */
        menuId: {
            type: String,
            default: null
        },
        /**
         * The toggle ID.
         */
        toggleId: {
            type: String,
            default: null
        },
        /**
         * The dropdown menu class(es).
         */
        menuClass: {
            type: [String, Array],
            default: null
        },
        /**
         * The dropdown toggle class(es).
         */
        toggleClass: {
            type: [String, Array],
            default: null
        },
        /**
         * Align the menu to the right.
         */
        right: {
            type: Boolean,
            default: false
        },
        /**
         * Whether to display the caret, or not.
         */
        noCaret: {
            type: Boolean,
            default: false
        },
        /**
         * Whether to split the dropdown, or not.
         */
        split: {
            type: Boolean,
            default: false
        },
        /**
         * The color theme.
         */
        theme: {
            type: String,
            default: 'primary',
            validator: v => THEMECOLORS.includes(v)
        },
        /**
         * The dropdown toggle's size.
         */
        size: {
            type: String,
            default: null
        },
        /**
         * The dropdown's disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * The dropdown toggle's text.
         */
        toggleText: {
            type: String,
            default: 'Toggle Dropdown'
        },
        /**
         * The button label's text.
         */
        text: {
            type: String,
            default: ''
        },
        /**
         * The dropdown's boundary.
         */
        boundary: {
            type: String,
            default: 'scrollParent',
            validator: v => ['scrollParent', 'window', 'viewport'].includes(v)
        },
        /**
         * The offset value.
         */
        offset: {
            type: [Number, String],
            default: null
        },
        /**
         * Display on top.
         */
        dropup: {
            type: Boolean,
            default: false
        },
        /**
         * The Popper options.
         */
        popperOptions: {
            type: Object,
            default() {
                return {}
            }
        },
        /**
         * Disable autoflipping.
         */
        noFlip: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the dropdown is displayed inside a nav, or not.
         */
        isNav: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        visible(newVal, oldVal) {
            if (this.visibleChangePrevented) {
                this.visibleChangePrevented = false;
                return
            }

            if (newVal === oldVal) {
                return
            }

            const eventName = newVal ? 'show' : 'hide';
            let _visibleChangeEvent = new CancelableEvent(eventName, {
                cancelable: true,
                vueTarget: this,
                target: this.$refs.menu,
                relatedTarget: null
            });

            this.$emit(_visibleChangeEvent.type, _visibleChangeEvent);
            this.emitOnRoot(DROPDOWN_EVENTS[_visibleChangeEvent.type.toUpperCase()]);

            if (_visibleChangeEvent.defaultPrevented) {
                this.visibleChangePrevented = true;
                this.visible = oldVal;
                return
            }

            if (eventName === 'show') {
                this.showMenu();
                return
            }

            this.hideMenu();
        },
        disabled(newVal, oldVal) {
            if (newVal !== oldVal && newVal && this.visible) {
                this.visible = false;
            }
        }
    },
    computed: {
        computedTag() {
            return this.isNav ? 'li' : 'div'
        },
        computedToggleTag() {
            return this.isNav ? 'a' : 'd-button'
        },
        computedID() {
            return this.id || `d-dropdown-${guid()}`
        },
        computedMenuID() {
            return this.menuId || `d-dropdown-menu-${guid()}`
        },
        computedToggleID() {
            return this.toggleId || `d-dropdown-toggle-${guid()}`
        },
        computedSplitID() {
            return this.splitId || `d-dropdown-split-${guid()}`
        },
        toggler() {
            return this.$refs.toggle.$el || this.$refs.toggle
        }
    },
    methods: {
        onMouseOver(event) {
            const item = event.target;
            if (
                item.classList.contains('dropdown-item')
                && !item.disabled
                && !item.classList.contains('disabled')
                && item.focus
            ) {
                item.focus();
            }
        },
        toggle(event) {
            event = event || {};

            // Enter, Space or Down
            const KEY_ESD = event.keyCode === KEYCODES.ENTER
                            || event.keyCode === KEYCODES.SPACE
                            || event.keyCode === KEYCODES.DOWN;

            if (event.type !== 'click' && !(event.type === 'keydown' && KEY_ESD)) {
                return
            }

            if (this.disabled) {
                this.visible = false;
                return
            }

            this.$emit('toggle', event);

            if (event.defaultPrevented) {
                return
            }

            event.preventDefault();
            event.stopPropagation();

            this.visible = !this.visible;
        },
        click(event) {
            if (this.disabled) {
                this.visible = false;
                return
            }
            this.$emit('click', event);
        },
        createPopper(element) {
            this.removePopper();

            // Define placement
            let placement = 'bottom-start';

            if (this.dropup && this.right) {
                placement = 'top-end';
            } else if (this.dropup) {
                placement = 'top-start';
            } else if (this.right) {
                placement = 'bottom-end';
            }

            // Build Popper config
            const popperConfig = {
                placement,
                modifiers: {
                    offset: {
                        offset: this.offset || 0
                    },
                    flip: {
                        enabled: !this.noFlip
                    },
                    computeStyle: {
                        enabled: true
                    }
                }
            };

            // Define Popper boundaries
            if (this.boundary) {
                popperConfig.modifiers.preventOverflow = {
                    boundariesElement: this.boundary
                };
            }

            // Create Popper instance
            this._popperInstance = new Popper(
                element,
                this.$refs.menu,
                {
                    ...popperConfig,
                    ...this.popperOptions
                }
            );
        },
        removePopper() {
            if (this._popperInstance) {
                this._popperInstance.destroy();
            }
            this._popperInstance = null;
        },
        showMenu() {
            if (this.disabled) {
                return
            }

            this.emitOnRoot(DROPDOWN_EVENTS.SHOWN, this);

            if (this.inNavbar === null && this.isNav) {
                this.inNavbar = Boolean(closest('.navbar', this.$el));
            }

            if (!this.inNavbar) {
                let _element = ((this.dropup && this.right) || this.split) ? this.$el : this.$refs.toggle;
                _element = _element.$el || _element;
                this.createPopper(_element);
            }

            this.$emit('shown');
            this.$nextTick(this.focusFirstItem);
        },
        hideMenu() {
            this.emitOnRoot(DROPDOWN_EVENTS.HIDDEN, this);
            this.$emit('hidden');
            this.removePopper();
        },
        away() {
            this.visible = false;
        }
    },
    created() {
        this._popperInstance = null;
    },
    mounted() {
        this.listenOnRoot(DROPDOWN_EVENTS.SHOWN, function(vm) {
            if (vm !== this) {
                this.visible = false;
            }
        });

        this.listenOnRoot(LINK_EVENTS.CLICKED, this.away);
    },
    deactivated() {
        this.visible = false;
        this.removePopper();
    },
    beforeUnmount() {
        this.visible = false;
        this.removePopper();
    }
};

const _hoisted_1$g = {
  key: 0,
  class: "sr-only"
};
const _hoisted_2$7 = ["id", "aria-labeledby"];

function render$E(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_d_button = resolveComponent("d-button");
  const _directive_click_away = resolveDirective("click-away");

  return withDirectives((openBlock(), createBlock(resolveDynamicComponent($options.computedTag), {
    id: $options.computedID,
    class: normalizeClass([
            'dropdown',
            'd-dropdown',
            !$props.isNav ? 'btn-group' : '',
            $props.isNav ? 'nav-item' : '',
            $props.dropup ? 'dropup' : '',
            $data.visible ? 'show' : '',
            ($props.boundary !== 'scrollParent' || !$props.boundary) ? 'position-static' : ''
        ])
  }, {
    default: withCtx(() => [
      createCommentVNode(" Dropdown Split "),
      ($props.split && !$props.isNav)
        ? (openBlock(), createBlock(_component_d_button, {
            key: 0,
            ref: "button",
            disabled: $props.disabled,
            theme: $props.theme,
            size: $props.size,
            id: $options.computedSplitID,
            onClick: $options.click
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "button-content", {}, () => [
                createTextVNode(toDisplayString($props.text), 1 /* TEXT */)
              ])
            ]),
            _: 3 /* FORWARDED */
          }, 8 /* PROPS */, ["disabled", "theme", "size", "id", "onClick"]))
        : createCommentVNode("v-if", true),
      createCommentVNode(" Dropdown Toggle "),
      (openBlock(), createBlock(resolveDynamicComponent($options.computedToggleTag), {
        ref: "toggle",
        id: $options.computedToggleID,
        class: normalizeClass([
                $props.isNav ? 'nav-link' : '',
                !$props.noCaret || $props.split ? 'dropdown-toggle' : '',
                $props.split && !$props.isNav ? 'dropdown-toggle-split' : '',
                $props.toggleClass
            ]),
        theme: $props.theme,
        size: $props.size,
        disabled: $props.disabled,
        "aria-expanded": $data.visible ? 'true' : 'false',
        "aria-haspopup": "true",
        onClick: $options.toggle,
        onKeydown: $options.toggle
      }, {
        default: withCtx(() => [
          ($props.split)
            ? (openBlock(), createElementBlock("span", _hoisted_1$g, toDisplayString($props.toggleText), 1 /* TEXT */))
            : renderSlot(_ctx.$slots, "button-content", { key: 1 }, () => [
                createTextVNode(toDisplayString($props.text), 1 /* TEXT */)
              ])
        ]),
        _: 3 /* FORWARDED */
      }, 40 /* PROPS, NEED_HYDRATION */, ["id", "class", "theme", "size", "disabled", "aria-expanded", "onClick", "onKeydown"])),
      createCommentVNode(" Dropdown Menu "),
      createElementVNode("div", {
        ref: "menu",
        role: "menu",
        class: normalizeClass([
                'dropdown-menu',
                $props.right ? 'dropdown-menu-right' : '',
                $data.visible ? 'show' : '',
                $props.menuClass
            ]),
        id: $options.computedMenuID,
        "aria-labeledby": $options.computedMenuID,
        onMouseover: _cache[0] || (_cache[0] = (...args) => ($options.onMouseOver && $options.onMouseOver(...args)))
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_2$7)
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["id", "class"])), [
    [_directive_click_away, $options.away]
  ])
}

var css_248z$9 = "\n.nav-link[data-v-a72c8de2]:hover {\n    cursor: pointer;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyb3Bkb3duLnZ1ZSUzRnZ1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9YTcyYzhkZTImc2NvcGVkPXRydWUmbGFuZy5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBO0lBQ0ksZUFBZTtBQUNuQiIsImZpbGUiOiJEcm9wZG93bi52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD1hNzJjOGRlMiZzY29wZWQ9dHJ1ZSZsYW5nLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLm5hdi1saW5rW2RhdGEtdi1hNzJjOGRlMl06aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbn1cbiJdfQ== */";
styleInject(css_248z$9);

script$E.render = render$E;
script$E.__scopeId = "data-v-a72c8de2";
script$E.__file = "src/components/dropdown/Dropdown.vue";

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
var script$D = {
    name: 'd-dropdown-item',
    props: {
        ...createLinkProps()
    }
};

function render$D(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_d_link = resolveComponent("d-link");

  return (openBlock(), createBlock(_component_d_link, mergeProps({
    class: "dropdown-item",
    role: "menuitem"
  }, _ctx.$props), {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 16 /* FULL_PROPS */))
}

var css_248z$8 = "\n.dropdown-item[data-v-2034797c]:focus {\n    outline: 0;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyb3Bkb3duSXRlbS52dWUlM0Z2dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPTIwMzQ3OTdjJnNjb3BlZD10cnVlJmxhbmcuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTtJQUNJLFVBQVU7QUFDZCIsImZpbGUiOiJEcm9wZG93bkl0ZW0udnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9MjAzNDc5N2Mmc2NvcGVkPXRydWUmbGFuZy5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJcbi5kcm9wZG93bi1pdGVtW2RhdGEtdi0yMDM0Nzk3Y106Zm9jdXMge1xuICAgIG91dGxpbmU6IDA7XG59XG4iXX0= */";
styleInject(css_248z$8);

script$D.render = render$D;
script$D.__scopeId = "data-v-2034797c";
script$D.__file = "src/components/dropdown/DropdownItem.vue";

var script$C = {
    name: 'd-dropdown-header',
    props: {
        /**
         * The component tag.
         */
        tag: {
            type: String,
            default: 'h6'
        },
        /**
         * The component ID.
         */
        id: {
            type: String,
            default: null
        }
    }
};

function render$C(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: "dropdown-header",
    id: $props.id
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["id"]))
}

script$C.render = render$C;
script$C.__file = "src/components/dropdown/DropdownHeader.vue";

var script$B = {
    name: 'd-dropdown-divider',
    props: {
        /**
         * The component tag.
         */
        tag: {
            type: String,
            default: 'div'
        }
    }
};

function render$B(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    role: "separator",
    class: "dropdown-divier"
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }))
}

script$B.render = render$B;
script$B.__file = "src/components/dropdown/DropdownDivider.vue";

const components$k = {
    dDropdown: script$E,
    dDropdownItem: script$D,
    dDropdownHeader: script$C,
    dDropdownDivider: script$B
};

const VuePlugin$m = {
  install (Vue) {
    registerComponents(Vue, components$k);
  }
};

var script$A = {
    name: 'd-embed',
    props: {
        /**
         * The embed type.
         */
        type: {
            type: String,
            default: 'iframe',
            validator: v => EMBED_TYPES.includes(v)
        },
        /**
         * The embed tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * The embed aspect ratio.
         */
        aspect: {
            type: String,
            default: '16by9',
            validator: v => EMBED_ASPECTS.includes(v)
        }
    }
};

function render$A(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
            'embed-responsive',
            `embed-responsive-${$props.aspect}`
        ])
  }, {
    default: withCtx(() => [
      (openBlock(), createBlock(resolveDynamicComponent($props.type), mergeProps({ class: "embed-responsive-item" }, _ctx.$attrs), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3 /* FORWARDED */
      }, 16 /* FULL_PROPS */))
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$A.render = render$A;
script$A.__file = "src/components/embed/Embed.vue";

const components$j = {
    dEmbed: script$A,
};

const VuePlugin$l = {
  install (Vue) {
    registerComponents(Vue, components$j);
  }
};

var script$z = {
    name: 'd-form',
    props: {
        /**
         * Whether it should be displayed inline, or not.
         */
        inline: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it is validated, or not.
         */
        validated: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be validated, or not.
         */
        novalidate: {
            type: Boolean,
            default: false
        }
    }
};

const _hoisted_1$f = ["novalidate"];

function render$z(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("form", mergeProps({
    novalidate: $props.novalidate ? true : false
  }, _ctx.$attrs, toHandlers(_ctx.$listeners, true), {
    class: [
            $props.inline ? 'form-inline' : '',
            $props.validated ? 'was-validated' : ''
        ]
  }), [
    renderSlot(_ctx.$slots, "default")
  ], 16 /* FULL_PROPS */, _hoisted_1$f))
}

script$z.render = render$z;
script$z.__file = "src/components/form/Form.vue";

var script$y = {
    name: 'd-form-row',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        }
    }
};

function render$y(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), { class: "form-row" }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }))
}

script$y.render = render$y;
script$y.__file = "src/components/form/FormRow.vue";

var script$x = {
    name: 'd-form-text',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'small'
        },
        /**
         * The theme color.
         */
        theme: {
            type: String,
            default: 'secondary',
            validator: (v) => THEMECOLORS.includes(v)
        },
        /**
         * Whether it should be displayed inline, or not.
         */
        inline: {
            type: Boolean,
            default: false
        }
    }
};

function render$x(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
            !$props.inline ? 'form-text' : '',
            Boolean($props.theme) ? `text-${$props.theme}` : ''
        ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$x.render = render$x;
script$x.__file = "src/components/form/FormText.vue";

var script$w = {
    name: 'd-form-feedback',
    props: {
        /**
         * The feedback tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * The feedback type.
         */
        type: {
            type: String,
            default: 'valid',
            validator: v => ['valid', 'invalid'].includes(v)
        },
        /**
         * Whether it should be forcefully shown, or not.
         */
        forceShow: {
            type: Boolean,
            default: false
        }
    }
};

function render$w(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
            `${$props.type}-feedback`,
            $props.forceShow ? 'd-block' : ''
        ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$w.render = render$w;
script$w.__file = "src/components/form/FormFeedback.vue";

var script$v = {
    name: 'd-form-valid-feedback',
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether it should be forcefully shown, or not.
         */
        forceShow: {
            type: Boolean,
            default: false
        }
    }
};

function render$v(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    id: $props.id,
    class: normalizeClass([
            'valid-feedback',
            $props.forceShow ? 'd-block' : ''
        ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["id", "class"]))
}

script$v.render = render$v;
script$v.__file = "src/components/form/FormValidFeedback.vue";

var script$u = {
    name: 'd-form-invalid-feedback',
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether it should be forcefully shown, or not.
         */
        forceShow: {
            type: Boolean,
            default: false
        }
    }
};

function render$u(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    id: $props.id,
    class: normalizeClass([
            'invalid-feedback',
            $props.forceShow ? 'd-block' : ''
        ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["id", "class"]))
}

script$u.render = render$u;
script$u.__file = "src/components/form/FormInvalidFeedback.vue";

const components$i = {
    dForm: script$z,
    dFormRow: script$y,
    dFormText: script$x,
    dFormFeedback: script$w,
    dFormValidFeedback: script$v,
    dValidFeedback: script$v,
    dFormInvalidFeedback: script$u,
    dInvalidFeedback: script$u
};

const VuePlugin$k = {
  install (Vue) {
    registerComponents(Vue, components$i);
  }
};

var script$t = {
    name: 'd-form-checkbox',
    emits: ['update:modelValue', 'update:checked', 'update:indeterminate', 'input', 'change'],
    data() {
        return {
            localState: this.modelValue !== undefined ? this.modelValue : this.checked
        }
    },
    props: {
        /**
         * The checkbox input name.
         */
        name: {
            type: String
        },
        /**
         * The checkbox input ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The checkbox input value.
         */
        value: {
            default: true
        },
        /**
         * The checkbox input unchecked state value.
         */
        uncheckedValue: {
            default: false
        },
        /**
         * The disabled state.
         */
        disabled: {
            type: Boolean
        },
        /**
         * The required state.
         */
        required: {
            type: Boolean,
            default: false
        },
        /**
         * The checked state.
         */
        modelValue: {
            type: [Boolean, String, Array],
            default: undefined
        },
        checked: {
            type: [Boolean, String, Array]
        },
        /**
         * The indeterminate state.
         */
        indeterminate: {
            type: Boolean,
            default: false
        },
        /**
         * The validation state.
         */
        state: {
            type: [Boolean, String],
            default: null
        },
        /**
         * Display as toggle.
         */
        toggle: {
            type: Boolean,
            default: false
        },
        /**
         * Display as small toggle.
         */
        toggleSmall: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the checkbox should be displayed inline, or not.
         */
        inline: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        computedChecked(newVal, oldVal) {
            if (newVal == oldVal) {
                return
            }

            this.computedLocalState = newVal;
        },

        computedLocalState(newVal, oldVal) {
            if (newVal == oldVal) {
                return
            }

            this.$emit('update:modelValue', newVal);
            this.$emit('update:checked', newVal);
            this.$emit('input', newVal);
            if (this.$refs.check) {
                this.$emit('update:indeterminate', this.$refs.check.indeterminate);
            }
        },

        indeterminate(newVal) {
            this.setIndeterminate(newVal);
        }
    },

    methods: {
        handleChange(e) {
            this.$emit('change', e.target.checked ? this.value : this.uncheckedValue);
            this.$emit('update:indeterminate', this.$refs.check.indeterminate);
        },

        setIndeterminate(state) {
            if (!this.$refs.check) {
                return
            }

            this.$refs.check.indeterminate = state;
            this.$emit('update:indeterminate', this.$refs.check.indeterminate);
        }
    },

    computed: {
        computedLocalState: {
            get() {
                return this.localState
            },

            set(val) {
                this.localState = val;
            }
        },
        computedChecked() {
            return this.modelValue !== undefined ? this.modelValue : this.checked
        },
        computedID() {
            return this.id || `dr-checkbox-${guid()}`
        },
        computedState() {
            if (this.state === true || this.state === 'valid') {
                return true
            }

            if (this.state === false || this.state === 'invalid') {
                return false
            }

            return null
        },
        computedStateClass() {
            if (this.computedState === true) {
                return 'is-valid'
            }

            if (this.computedState === false) {
                return 'is-invalid'
            }

            return null
        }
    },

    mounted() {
        this.setIndeterminate(this.indeterminate);
    }
};

const _hoisted_1$e = ["aria-required", "id", "name", "value", "true-value", "false-value", "disabled", "required"];
const _hoisted_2$6 = ["for"];
const _hoisted_3$3 = {
  class: /*@__PURE__*/normalizeClass(['custom-control-description'])
};

function render$t(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("label", {
    class: normalizeClass([
            'custom-control',
            !$props.toggle ? 'custom-checkbox' : 'custom-toggle',
            $props.toggle && $props.toggleSmall ? 'custom-toggle-sm' : '',
            $props.inline ? 'custom-control-inline' : '',
            $options.computedStateClass
        ])
  }, [
    withDirectives(createElementVNode("input", {
      type: "checkbox",
      ref: "check",
      autocomplete: "off",
      "aria-required": $props.required ? 'true' : null,
      id: $options.computedID,
      class: normalizeClass([ 'custom-control-input', $options.computedStateClass ]),
      name: $props.name,
      value: $props.value,
      "true-value": $props.value,
      "false-value": $props.uncheckedValue,
      disabled: $props.disabled,
      required: $props.required,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($options.computedLocalState) = $event)),
      onChange: _cache[1] || (_cache[1] = (...args) => ($options.handleChange && $options.handleChange(...args)))
    }, null, 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_1$e), [
      [vModelCheckbox, $options.computedLocalState]
    ]),
    createElementVNode("label", {
      for: $options.computedID,
      class: "custom-control-label",
      "aria-hidden": "true"
    }, null, 8 /* PROPS */, _hoisted_2$6),
    createElementVNode("span", _hoisted_3$3, [
      renderSlot(_ctx.$slots, "default")
    ])
  ], 2 /* CLASS */))
}

script$t.render = render$t;
script$t.__file = "src/components/form-checkbox/FormCheckbox.vue";

const components$h = {
    dFormCheckbox: script$t,
    dCheckbox: script$t
};

const VuePlugin$j = {
  install (Vue) {
    registerComponents(Vue, components$h);
  }
};

var script$s = {
    name: 'd-form-input',
    emits: ['update:modelValue', 'input', 'change'],
    props: {
        /**
         * Input type.
         */
        type: {
            type: String,
            default: 'text',
            validator: (v) => INPUT_TYPES.includes(v)
        },
        /**
         * Input value.
         */
        modelValue: {
            type: [String, Number],
            default: undefined
        },
        value: {
            type: [String, Number],
            default: ''
        },
        /**
         * Input size.
         */
        size: {
            type: String,
            default: null
        },
        /**
         * Input state. eg: 'valid', 'invalid'
         */
        state: {
            type: [Boolean, String],
            default: null,
            validator: (v) => [null, 'valid', 'invalid', true, false].includes(v)
        },
        /**
         * Input name.
         */
        name: {
            type: String
        },
        /**
         * Input disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Input required state.
         */
        required: {
            type: Boolean,
            default: false
        },
        /**
         * Input placeholder text.
         */
        placeholder: {
            type: String,
            default: null
        },
        /**
         * Enable or disable field autocomplete.
         */
        autocomplete: {
            type: String,
            default: null
        },
        /**
         * Display as plain text and remove styling.
         */
        plaintext: {
            type: Boolean,
            default: false
        },
        /**
         * Display as read-only.
         */
        readonly: {
            type: Boolean,
            default: false
        },
        /**
         * The input `aria-invalid` attribute.
         */
        ariaInvalid: {
            type: [Boolean, String],
            default: false
        }
    },
    watch: {
        inputValue (newVal) {
            this.setValue(newVal);
        }
    },
    mounted() {
        if (this.inputValue) {
            this.setValue(this.inputValue);
        }
    },
    computed: {
        inputValue() {
            return this.modelValue !== undefined ? this.modelValue : this.value
        },
        computedID() {
            return `dr-input-${guid()}`
        },
        computedAriaInvalid() {
            if (!this.ariaInvalid || this.ariaInvalid === 'false') {
                return this.state === 'invalid' ? 'true' : null
            }

            if (this.ariaInvalid === true) {
                return 'true'
            }

            return this.ariaInvalid
        },
        computedState() {
            if (this.state === true || this.state === 'valid') {
                return true
            } else if (this.state === false || this.state === 'invalid') {
                return false
            }

            return null
        },
        computedStateClass() {
            if (this.computedState === true || this.computedState === 'valid') {
                return 'is-valid'
            } else if (this.computedState === false) {
                return 'is-invalid'
            }

            return null
        }
    },
    methods: {
        setValue(value) {
            this.$refs.input.value = value;
            this.$emit('update:modelValue', value);
            this.$emit('input', value);
        },
        onInput(e) {
            this.setValue(e.target.value);
        },
        onChange(e) {
            this.setValue(e.target.value);
            this.$emit('change', e.target.value);
        }
    }
};

const _hoisted_1$d = ["id", "type", "name", "disabled", "required", "readonly", "placeholder", "autocomplete", "aria-required", "aria-invalid", "value"];

function render$s(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("input", mergeProps({
    ref: "input",
    id: $options.computedID,
    type: $props.type,
    name: $props.name,
    disabled: $props.disabled,
    required: $props.required,
    readonly: $props.readonly || $props.plaintext,
    placeholder: $props.placeholder,
    autocomplete: $props.autocomplete,
    "aria-required": $props.required ? true : null,
    "aria-invalid": $options.computedAriaInvalid,
    value: $options.inputValue,
    class: [
            $props.plaintext ? 'form-control-plaintext' : 'form-control',
            $props.plaintext ? 'w-100' : '',
            $props.size ? `form-control-${$props.size}` : null,
            $options.computedStateClass
        ]
  }, _ctx.$attrs, {
    onInput: _cache[0] || (_cache[0] = (...args) => ($options.onInput && $options.onInput(...args))),
    onChange: _cache[1] || (_cache[1] = (...args) => ($options.onChange && $options.onChange(...args)))
  }), null, 16 /* FULL_PROPS */, _hoisted_1$d))
}

script$s.render = render$s;
script$s.__file = "src/components/form-input/FormInput.vue";

const components$g = {
    dFormInput: script$s,
    dInput: script$s
};

const VuePlugin$i = {
  install (Vue) {
    registerComponents(Vue, components$g);
  }
};

var script$r = {
    name: 'd-form-radio',
    emits: ['update:modelValue', 'update:checked', 'input', 'change'],
    data() {
        return {
            localChecked: this.modelValue !== undefined ? this.modelValue : this.checked
        }
    },
    props: {
        /**
         * The radio input name.
         */
        name: {
            type: String
        },
        /**
         * The radio input ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The radio input value.
         */
        value: {
            default: true
        },
        /**
         * The disabled state.
         */
        disabled: {
            type: Boolean
        },
        /**
         * The required state.
         */
        required: {
            type: Boolean,
            default: false
        },
        /**
         * The checked state.
         */
        modelValue: {
            type: [Boolean, String, Array],
            default: undefined
        },
        checked: {
            type: [Boolean, String, Array]
        },
        /**
         * The validation state.
         */
        state: {
            type: [Boolean, String],
            default: null
        },
        /**
         * Whether the radio should be displayed inline, or not.
         */
        inline: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedLocalChecked: {
            get() {
                return this.localChecked
            },

            set(val) {
                this.localChecked = val;
            }
        },
        computedChecked() {
            return this.modelValue !== undefined ? this.modelValue : this.checked
        },
        computedID() {
            return this.id || `dr-radio-${guid()}`
        },
        computedState() {
            if (this.state === true || this.state === 'valid') {
                return true
            }

            if (this.state === false || this.state === 'invalid') {
                return false
            }

            return null
        },
        computedStateClass() {
            if (this.computedState === true) {
                return 'is-valid'
            }

            if (this.computedState === false) {
                return 'is-invalid'
            }

            return null
        }
    },
    watch: {
        computedChecked(newVal, oldVal) {
            if (newVal == oldVal) {
                return
            }

            this.computedLocalChecked = newVal;
        },

        computedLocalChecked(newVal, oldVal) {
            if (newVal == oldVal) {
                return
            }

            this.$emit('update:modelValue', newVal);
            this.$emit('update:checked', newVal);
            this.$emit('input', newVal);
        },
    },

    methods: {
        handleChange(e) {
            this.$emit('change', e.target.checked ? this.value : null);
        }
    }
};

const _hoisted_1$c = ["aria-required", "id", "name", "value", "disabled", "required"];
const _hoisted_2$5 = ["for"];
const _hoisted_3$2 = {
  class: /*@__PURE__*/normalizeClass(['custom-control-description'])
};

function render$r(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("label", {
    class: normalizeClass([
        'custom-control',
        'custom-radio',
        $props.inline ? 'custom-control-inline' : '',
        $options.computedStateClass
    ])
  }, [
    withDirectives(createElementVNode("input", {
      type: "radio",
      ref: "check",
      autocomplete: "off",
      "aria-required": $props.required ? 'true' : null,
      id: $options.computedID,
      class: normalizeClass([ 'custom-control-input', $options.computedStateClass ]),
      name: $props.name,
      value: $props.value,
      disabled: $props.disabled,
      required: $props.name && $props.required,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($options.computedLocalChecked) = $event)),
      onChange: _cache[1] || (_cache[1] = (...args) => ($options.handleChange && $options.handleChange(...args)))
    }, null, 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_1$c), [
      [vModelRadio, $options.computedLocalChecked]
    ]),
    createElementVNode("label", {
      for: $options.computedID,
      class: "custom-control-label",
      "aria-hidden": "true"
    }, null, 8 /* PROPS */, _hoisted_2$5),
    createElementVNode("span", _hoisted_3$2, [
      renderSlot(_ctx.$slots, "default")
    ])
  ], 2 /* CLASS */))
}

script$r.render = render$r;
script$r.__file = "src/components/form-radio/FormRadio.vue";

const components$f = {
    dFormRadio: script$r,
    dRadio: script$r
};

const VuePlugin$h = {
  install (Vue) {
    registerComponents(Vue, components$f);
  }
};

var script$q = {
    name: 'd-form-select',
    emits: ['update:modelValue', 'input', 'change'],
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The element name.
         */
        name: {
            type: String
        },
        /**
         * The select options.
         */
        options: {
            type: [Array, Object],
            default() {
                return []
            }
        },
        /**
         * The select value.
         */
        modelValue: {
            default: undefined
        },
        value: {},
        /**
         * Whether it should allow multiple selections, or not.
         */
        multiple: {
            type: Boolean,
            default: false
        },
        /**
         * How many options should be visible.
         */
        selectSize: {
            type: Number,
            default: 0
        },
        /**
         * Controls the `aria-invalid` attribute.
         */
        ariaInvalid: {
            type: [Boolean, String],
            default: false
        },
        /**
         * The value field.
         */
        valueField: {
            type: String,
            default: 'value'
        },
        /**
         * The disabled field.
         */
        disabledField: {
            type: String,
            default: 'disabled'
        },
        /**
         * The text field.
         */
        textField: {
            type: String,
            default: 'text'
        },
        /**
         * The disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * The required state.
         */
        required: {
            type: Boolean,
            default: false
        },
        /**
         * The validity state (invalid, valid, true, false).
         */
        state: {
            type: [Boolean, String],
            default: null,
            validator: v => ['valid', 'invalid', true, false, null].includes(v)
        },
        /**
         * The form control size (sm, lg).
         */
        size: {
            type: String,
            default: null,
            validator: v => ['sm', 'lg', null].includes(v)
        }
    },
    data() {
        return {
            localValue: this.computedValue
        }
    },
    watch: {
        computedValue(newVal) {
            this.localValue = newVal;
        },

        localValue() {
            this.$emit('update:modelValue', this.localValue);
            this.$emit('input', this.localValue);
        }
    },
    computed: {
        computedValue() {
            return this.modelValue !== undefined ? this.modelValue : this.value
        },

        computedID() {
            return this.id || `dr-select-${guid()}`
        },

        computedState() {
            if (this.state === true || this.state === 'valid') {
                return true
            }

            if (this.state === false || this.state === 'invalid') {
                return false
            }

            return null
        },

        stateClass() {
            if (this.computedState === true) {
                return 'is-valid'
            } else if (this.computedState === false) {
                return 'is-invalid'
            }

            return null
        },

        computedAriaInvalid() {
            if (this.ariaInvalid === true || this.ariaInvalid === 'true') {
                return 'true';
            }

            return this.stateClass == 'is-invalid' ? 'true' : null;
        },

        formOptions() {
            let options = this.options || {};
            const valueField = this.valueField || 'value';
            const textField = this.textField || 'text';
            const disabledField = this.disabledField || 'disabled';

            // Parse array options
            if (Array.isArray(options)) {
                return options.map(option => {
                    if (typeof option === 'object') {
                        return {
                            value: option[valueField],
                            text: String(option[textField]),
                            disabled: option[disabledField] || false
                        }
                    }

                    return { text: String(option), value: option, disabled: false }
                })

            // Parse object options
            } else if (typeof options === 'object') {
                return Object.keys(options).map(key => {
                    let option = options[key] || {};

                    if (typeof option === 'object') {
                        const value = option[valueField];
                        const text = option[textField];

                        return {
                            text: typeof text === 'undefined' ? key : String(text),
                            value: typeof value === 'undefined' ? key : value,
                            disabled: option[disabledField] || false
                        }
                    }

                    return { text: String(option), value: key, disabled: false }
                })
            }

            return []
        }
    },
    methods: {
        handleChange(evt) {
            const target = evt.target;
            const selectedVal = Array.from(target.options)
                                    .filter(opt => opt.selected)
                                    .map(opt => '_value' in opt ? opt._value : opt.value);

            this.localValue = target.multiple ? selectedVal : selectedVal[0];
            this.$emit('change', this.localValue);
        }
    }
};

const _hoisted_1$b = ["id", "name", "multiple", "size", "disabled", "required", "aria-required", "aria-invalid"];
const _hoisted_2$4 = ["value", "disabled"];

function render$q(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("select", {
    ref: "input",
    class: normalizeClass([
            'form-control',
            $options.stateClass,
            $props.size ? `form-control-${$props.size}` : null,
            !$props.multiple && $props.selectSize > 1 ? null : 'custom-select'
        ]),
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($data.localValue) = $event)),
    id: $options.computedID,
    name: $props.name,
    multiple: $props.multiple || null,
    size: ($props.multiple || $props.selectSize > 1) ? $props.selectSize : null,
    disabled: $props.disabled,
    required: $props.required,
    "aria-required": $props.required ? true : null,
    "aria-invalid": $options.computedAriaInvalid,
    onChange: _cache[1] || (_cache[1] = (...args) => ($options.handleChange && $options.handleChange(...args)))
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.formOptions, (option, idx) => {
      return (openBlock(), createElementBlock("option", {
        key: `dr-opt-${idx}`,
        value: option.value,
        disabled: Boolean(option.disabled)
      }, toDisplayString(option.text), 9 /* TEXT, PROPS */, _hoisted_2$4))
    }), 128 /* KEYED_FRAGMENT */)),
    renderSlot(_ctx.$slots, "default")
  ], 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_1$b)), [
    [vModelSelect, $data.localValue]
  ])
}

var css_248z$7 = "\n.custom-select[data-v-26b9263a] {\n        -webkit-appearance: none;\n        -moz-appearance: none;\n        appearance: none;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1TZWxlY3QudnVlJTNGdnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD0yNmI5MjYzYSZzY29wZWQ9dHJ1ZSZsYW5nLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7UUFDUSx3QkFBd0I7UUFDeEIscUJBQXFCO1FBQ3JCLGdCQUFnQjtBQUN4QiIsImZpbGUiOiJGb3JtU2VsZWN0LnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPTI2YjkyNjNhJnNjb3BlZD10cnVlJmxhbmcuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXG4uY3VzdG9tLXNlbGVjdFtkYXRhLXYtMjZiOTI2M2FdIHtcbiAgICAgICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAgICAgICAtbW96LWFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XG59XG4iXX0= */";
styleInject(css_248z$7);

script$q.render = render$q;
script$q.__scopeId = "data-v-26b9263a";
script$q.__file = "src/components/form-select/FormSelect.vue";

const components$e = {
    dFormSelect: script$q,
    dSelect: script$q
};

const VuePlugin$g = {
  install (Vue) {
    registerComponents(Vue, components$e);
  }
};

var script$p = {
  name: "d-form-textarea",
  emits: ["update:modelValue", "input"],
  data() {
    return {
      localValue: this.modelValue !== undefined ? this.modelValue : this.value
    };
  },
  props: {
    /**
     * The textarea value.
     */
    modelValue: {
      type: [String, Number],
      default: undefined
    },
    /**
     * The textarea value.
     */
    value: {
      type: [String, Number],
      default: ""
    },
    /**
     * The element name.
     */
    name: {
      type: String,
      default: null
    },
    /**
     * The element ID.
     */
    id: {
      type: String,
      default: null
    },
    /**
     * The disabled state.
     */
    disabled: {
      type: Boolean,
      required: false
    },
    /**
     * The required state.
     */
    required: {
      type: Boolean,
      required: false
    },
    /**
     * The validity state.
     */
    state: {
      type: [Boolean, String],
      default: null,
      validator: v => ["valid", "invalid", true, false, null].includes(v)
    },
    /**
     * The element's size.
     */
    size: {
      type: String,
      default: null,
      validator: v => ["sm", "lg", null].includes(v)
    },
    /**
     * The placeholder value.
     */
    placeholder: {
      type: String,
      default: null
    },
    /**
     * The autocomplete status.
     */
    autocomplete: {
      type: String,
      default: null
    },
    /**
     * Whether the textarea should be read-only, or not.
     */
    readonly: {
      type: Boolean,
      default: false
    },
    /**
     * Whether the textarea should be plain-text, or not.
     */
    plaintext: {
      type: Boolean,
      default: false
    },
    /**
     * The textarea `aria-invalid` attribute.
     */
    ariaInvalid: {
      type: [Boolean, String],
      default: false
    },
    /**
     * The number of text rows.
     */
    rows: {
      type: [Number, String],
      default: null
    },
    /**
     * The textarea wrap style.
     */
    wrap: {
      type: String,
      default: "soft",
      validator: v => ["soft", "hard", "off"].includes(v)
    },
    /**
     * Whether resizing should be disabled, or not.
     */
    noResize: {
      type: Boolean,
      default: false
    },
    /**
     * The maximum number of rows allowed.
     */
    maxRows: {
      type: [Number, String],
      default: null
    }
  },
  mounted() {
    this.el = this.$el;
  },
  watch: {
    computedValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.localValue = newVal;
      }
    },
    localValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit("update:modelValue", newVal);
        this.$emit("input", newVal);
      }
    }
  },
  computed: {
    computedValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    },
    computedID() {
      return this.id || `dr-textarea-${guid()}`;
    },
    computedStyle() {
      return {
        width: this.plaintext ? "100%" : null,
        height: this.computedHeight,
        resize: this.noResize ? "none" : null
      };
    },
    computedMinRows() {
      return Math.max(parseInt(this.rows, 10) || 2, 2);
    },
    computedMaxRows() {
      const maxRows = parseInt(this.maxRows, 10);
      return maxRows ? Math.max(this.computedMinRows, maxRows) : null;
    },
    computedHeight() {
      if (this.localValue === null || !isVisible(this.el)) {
        return null;
      }

      const _height = this.el.style.height;

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.el.style.height = "inherit";

      const computed = getComputedStyles(this.el);
      const lineHeight = parseFloat(computed.lineHeight);
      const minHeight =
        parseInt(computed.height, 10) || lineHeight * this.computedMinRows;

      const offset =
        parseInt(computed.borderTopWidth, 10) +
        parseInt(computed.paddingTop, 10) +
        parseInt(computed.paddingBottom, 10) +
        parseInt(computed.borderBottomWidth, 10);

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.el.style.height = _height;

      const calculatedRows = Math.max(
        (this.el.scrollHeight - offset) / lineHeight,
        this.computedMinRows
      );
      const rows = this.computedMaxRows
        ? Math.min(calculatedRows, this.computedMaxRows)
        : calculatedRows;

      if (!String(this.localValue || "").trim()) {
        return `${minHeight}px`;
      }

      return `${Math.max(Math.ceil(rows * lineHeight + offset), minHeight)}px`;
    },
    computedAriaInvalid() {
      // eslint-disable-next-line
      if (!Boolean(this.ariaInvalid) || this.ariaInvalid === "false") {
        return this.computedState === false ? "true" : null;
      }

      if (this.ariaInvalid === true) {
        return "true";
      }

      return this.ariaInvalid;
    },
    computedState() {
      if (this.state === true || this.state === "valid") {
        return true;
      }

      if (this.state === false || this.state === "invalid") {
        return false;
      }

      return null;
    },
    stateClass() {
      if (this.computedState === true) {
        return "is-valid";
      }

      if (this.computedState === false) {
        return "is-invalid";
      }

      return null;
    }
  },
  methods: {
    handleInput(e) {
      this.localValue = e.target.value;
    }
  }
};

const _hoisted_1$a = ["name", "id", "disabled", "required", "placeholder", "autocomplete", "readonly", "rows", "wrap", "aria-required", "aria-invalid", "value"];

function render$p(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("textarea", {
    ref: "input",
    class: normalizeClass([
            $props.plaintext ? 'form-control-plaintext' : 'form-control',
            $props.plaintext ? 'w-100' : '',
            $props.size ? `form-control-${this.size}` : null,
            $options.stateClass
        ]),
    style: normalizeStyle($options.computedStyle),
    name: $props.name,
    id: $options.computedID,
    disabled: $props.disabled,
    required: $props.required,
    placeholder: $props.placeholder,
    autocomplete: $props.autocomplete,
    readonly: $props.readonly || $props.plaintext,
    rows: $props.rows,
    wrap: $props.wrap,
    "aria-required": $props.required ? 'true' : null,
    "aria-invalid": $options.computedAriaInvalid,
    value: $data.localValue,
    onInput: _cache[0] || (_cache[0] = (...args) => ($options.handleInput && $options.handleInput(...args)))
  }, null, 46 /* CLASS, STYLE, PROPS, NEED_HYDRATION */, _hoisted_1$a))
}

script$p.render = render$p;
script$p.__file = "src/components/form-textarea/FormTextarea.vue";

const components$d = {
    dFormTextarea: script$p,
    dTextarea: script$p
};

const VuePlugin$f = {
  install (Vue) {
    registerComponents(Vue, components$d);
  }
};

var script$o = {
    name: 'd-image',
    props: {
        /**
         * The image source.
         */
        src: {
            type: String,
            default: null
        },
        /**
         * The image alternative text.
         */
        alt: {
            type: String,
            default: null
        },
        /**
         * The image width.
         */
        width: {
            type: [Number, String],
            default: null
        },
        /**
         * The image height.
         */
        height: {
            type: [Number, String],
            default: null
        },
        /**
         * Whether the image should be fluid, or not.
         */
        fluid: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should take up the entire space (in width).
         */
        fluidGrow: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should be rounded.
         */
        rounded: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should be displayed as a thumbnail.
         */
        thumbnail: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should be floated to the left.
         */
        left: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should be floated to the right.
         */
        right: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the image should be centered.
         */
        center: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedWidth() {
            return parseInt(this.width, 10) || null
        },
        computedHeight() {
            return parseInt(this.height, 10) || null
        },
        computedAlign() {
            if (this.center) {
                return 'mx-auto'
            }

            if (this.left) {
                return 'float-left'
            }

            if (this.right) {
                return 'float-right'
            }

            return null
        }
    }
};

const _hoisted_1$9 = ["src", "alt", "width", "height"];

function render$o(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("img", {
    src: $props.src,
    alt: $props.alt,
    width: $options.computedWidth,
    height: $options.computedHeight,
    class: normalizeClass([
            $props.thumbnail ? 'img-thumbnail' : '',
            $props.fluid || $props.fluidGrow ? 'img-fluid' : '',
            $props.fluidGrow ? 'w-100' : '',
            $props.rounded ? 'rounded' : '',
            $props.center ? 'd-block' : '',
            Boolean($options.computedAlign) ? $options.computedAlign : '',
        ])
  }, null, 10 /* CLASS, PROPS */, _hoisted_1$9))
}

script$o.render = render$o;
script$o.__file = "src/components/image/Image.vue";

const components$c = {
    dImg: script$o,
    dImage: script$o
};

const VuePlugin$e = {
  install (Vue) {
    registerComponents(Vue, components$c);
  }
};

var script$n = {
    name: 'd-input-group-text',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        }
    }
};

function render$n(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), { class: "input-group-text" }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }))
}

script$n.render = render$n;
script$n.__file = "src/components/input-group/InputGroupText.vue";

var script$m = {
    name: 'd-input-group-addon',
    components: {
        InputGroupText: script$n
    },
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * The append value.
         */
        append: {
            type: Boolean,
            default: false
        },
        /**
         * The prepend value.
         */
        prepend: {
            type: Boolean,
            default: false
        },
        /**
         * Whether is plain-text, or not.
         */
        isText: {
            type: Boolean,
            default: false
        }
    }
};

function render$m(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_InputGroupText = resolveComponent("InputGroupText");

  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    id: $props.id,
    class: normalizeClass([ `input-group-${$props.append ? 'append' : 'prepend'}` ])
  }, {
    default: withCtx(() => [
      ($props.isText)
        ? (openBlock(), createBlock(_component_InputGroupText, { key: 0 }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3 /* FORWARDED */
          }))
        : createCommentVNode("v-if", true),
      (!$props.isText)
        ? renderSlot(_ctx.$slots, "default", { key: 1 })
        : createCommentVNode("v-if", true)
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["id", "class"]))
}

script$m.render = render$m;
script$m.__file = "src/components/input-group/InputGroupAddon.vue";

var script$l = {
    name: 'd-input-group',
    components: {
        InputGroupAddon: script$m,
        InputGroupText: script$n
    },
    props: {
        /**
         * The element id.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The input group size.
         */
        size: {
            type: String,
            default: null,
            validator: v => ['sm', 'lg', null].includes(v)
        },
        /**
         * The prepend value.
         */
        prepend: {
            type: String,
            default: null
        },
        /**
         * The append value.
         */
        append: {
            type: String,
            default: null
        },
        /**
         * Whether it should be seamless, or not.
         */
        seamless: {
            type: Boolean,
            default: false
        },
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        }
    },
    computed: {
        appendIsUsed() {
            return !!this.$slots['append'] || this.append
        },
        prependIsUsed() {
            return !!this.$slots['prepend'] || this.prepend
        }
    }
};

function render$l(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_InputGroupText = resolveComponent("InputGroupText");
  const _component_InputGroupAddon = resolveComponent("InputGroupAddon");

  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    role: "group",
    id: $props.id,
    class: normalizeClass([
            'input-group',
            this.size ? `input-group-${this.size}` : '',
            this.seamless ? 'input-group-seamless' : ''
        ])
  }, {
    default: withCtx(() => [
      ($options.prependIsUsed)
        ? (openBlock(), createBlock(_component_InputGroupAddon, {
            key: 0,
            prepend: Boolean($props.prepend || $options.prependIsUsed)
          }, {
            default: withCtx(() => [
              (Boolean($props.prepend))
                ? (openBlock(), createBlock(_component_InputGroupText, {
                    key: 0,
                    innerHTML: $props.prepend
                  }, null, 8 /* PROPS */, ["innerHTML"]))
                : createCommentVNode("v-if", true),
              renderSlot(_ctx.$slots, "prepend")
            ]),
            _: 3 /* FORWARDED */
          }, 8 /* PROPS */, ["prepend"]))
        : createCommentVNode("v-if", true),
      renderSlot(_ctx.$slots, "default"),
      ($options.appendIsUsed)
        ? (openBlock(), createBlock(_component_InputGroupAddon, {
            key: 1,
            append: Boolean($props.append || $options.appendIsUsed)
          }, {
            default: withCtx(() => [
              (Boolean($props.append))
                ? (openBlock(), createBlock(_component_InputGroupText, {
                    key: 0,
                    innerHTML: $props.append
                  }, null, 8 /* PROPS */, ["innerHTML"]))
                : createCommentVNode("v-if", true),
              renderSlot(_ctx.$slots, "append")
            ]),
            _: 3 /* FORWARDED */
          }, 8 /* PROPS */, ["append"]))
        : createCommentVNode("v-if", true)
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["id", "class"]))
}

var css_248z$6 = "\n.input-group input:focus {\n    position: relative;\n    z-index: 3;\n}\n\n/* Adjust dropdowns inside input groups. */\n.input-group > .input-group-prepend > .d-dropdown > .btn {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.input-group > .input-group-append > .d-dropdown > .btn {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n\n/* Datepickers */\n.vdp-datepicker:not(:last-child) input {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.vdp-datepicker:not(:first-child) input {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n.vdp-datepicker + .vdp-datepicker {\n    margin-left: -1px;\n}\n.input-group-sm .vdp-datepicker input {\n    height: 1.9375rem;\n    font-size: 0.875rem;\n    line-height: 1.5;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIklucHV0R3JvdXAudnVlJTNGdnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD01ZTkwODAzOCZsYW5nLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7SUFDSSxrQkFBa0I7SUFDbEIsVUFBVTtBQUNkOztBQUVBLDBDQUEwQztBQUMxQztJQUNJLDBCQUEwQjtJQUMxQiw2QkFBNkI7QUFDakM7QUFDQTtJQUNJLHlCQUF5QjtJQUN6Qiw0QkFBNEI7QUFDaEM7O0FBRUEsZ0JBQWdCO0FBQ2hCO0lBQ0ksMEJBQTBCO0lBQzFCLDZCQUE2QjtBQUNqQztBQUNBO0lBQ0kseUJBQXlCO0lBQ3pCLDRCQUE0QjtBQUNoQztBQUNBO0lBQ0ksaUJBQWlCO0FBQ3JCO0FBQ0E7SUFDSSxpQkFBaUI7SUFDakIsbUJBQW1CO0lBQ25CLGdCQUFnQjtBQUNwQiIsImZpbGUiOiJJbnB1dEdyb3VwLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPTVlOTA4MDM4JmxhbmcuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXG4uaW5wdXQtZ3JvdXAgaW5wdXQ6Zm9jdXMge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB6LWluZGV4OiAzO1xufVxuXG4vKiBBZGp1c3QgZHJvcGRvd25zIGluc2lkZSBpbnB1dCBncm91cHMuICovXG4uaW5wdXQtZ3JvdXAgPiAuaW5wdXQtZ3JvdXAtcHJlcGVuZCA+IC5kLWRyb3Bkb3duID4gLmJ0biB7XG4gICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG59XG4uaW5wdXQtZ3JvdXAgPiAuaW5wdXQtZ3JvdXAtYXBwZW5kID4gLmQtZHJvcGRvd24gPiAuYnRuIHtcbiAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG59XG5cbi8qIERhdGVwaWNrZXJzICovXG4udmRwLWRhdGVwaWNrZXI6bm90KDpsYXN0LWNoaWxkKSBpbnB1dCB7XG4gICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG59XG4udmRwLWRhdGVwaWNrZXI6bm90KDpmaXJzdC1jaGlsZCkgaW5wdXQge1xuICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcbn1cbi52ZHAtZGF0ZXBpY2tlciArIC52ZHAtZGF0ZXBpY2tlciB7XG4gICAgbWFyZ2luLWxlZnQ6IC0xcHg7XG59XG4uaW5wdXQtZ3JvdXAtc20gLnZkcC1kYXRlcGlja2VyIGlucHV0IHtcbiAgICBoZWlnaHQ6IDEuOTM3NXJlbTtcbiAgICBmb250LXNpemU6IDAuODc1cmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG59XG4iXX0= */";
styleInject(css_248z$6);

script$l.render = render$l;
script$l.__file = "src/components/input-group/InputGroup.vue";

const components$b = {
    dInputGroup: script$l,
    dInputGroupText: script$n,
    dInputGroupAddon: script$m
};

const VuePlugin$d = {
  install (Vue) {
    registerComponents(Vue, components$b);
  }
};

const components$a = {
    dLink: script$X
};

const VuePlugin$c = {
  install (Vue) {
    registerComponents(Vue, components$a);
  }
};

var script$k = {
    name: 'd-list-group',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether the list group should be flushed, or not.
         */
        flush: {
            type: Boolean,
            default: false
        }
    }
};

function render$k(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
        'list-group',
        $props.flush ? 'list-group-flush' : ''
    ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$k.render = render$k;
script$k.__file = "src/components/list-group/ListGroup.vue";

let _linkProps = createLinkProps();

if (_linkProps && typeof _linkProps.href !== 'undefined') {
    delete _linkProps.href.default;
}

if (_linkProps && typeof _linkProps.to !== 'undefined') {
    delete _linkProps.to.default;
}

const _actionTags = ['a', 'router-link', 'button', 'd-link'];

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
var script$j = {
    name: 'd-list-group-item',
    components: {
        dLink: script$X
    },
    props: {
        ..._linkProps, ...{
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            },
            /**
             * The element action.
             */
            action: {
                type: Boolean,
                default: null
            },
            /**
             * Whether the element tag should be a button, or not.
             */
            button: {
                type: Boolean,
                default: null
            },
            /**
             * The theme color.
             */
            theme: {
                type: String,
                default: null,
                validator: v => THEMECOLORS.includes(v)
            }
        }
    },
    computed: {
        computedTag() {
            const _tagOrLink = ((!this.href && !this.to) ? this.tag : 'd-link');
            return this.button ? 'button' : _tagOrLink
        },
        isAction() {
            return Boolean(
                this.href
                || this.to
                || this.action
                || this.button
                || _actionTags.includes(this.tag)
            )
        }
    }
};

function render$j(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($options.computedTag), {
    class: normalizeClass([
            'list-group-item',
            _ctx.theme ? `list-group-item-${_ctx.theme}` : '',
            $options.isAction ? 'list-group-item-action': '',
            _ctx.active ? 'active' : '',
            _ctx.disabled ? 'disabled' : ''
        ]),
    disabled: _ctx.button && _ctx.disabled
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class", "disabled"]))
}

script$j.render = render$j;
script$j.__file = "src/components/list-group/ListGroupItem.vue";

const components$9 = {
    dListGroup: script$k,
    dListGroupItem: script$j
};

const VuePlugin$b = {
  install (Vue) {
    registerComponents(Vue, components$9);
  }
};

var script$i = {
    name: 'd-modal',
    directives: { clickAway },
    emits: ['close'],
    props: {
        /**
         * The component tag.
         */
        tag: {
            type: String,
            default: "div"
        },
        /**
         * The size (sm, lg).
         */
        size: {
            type: String,
            default: null,
            validator: v => ['sm', 'lg'].includes(v)
        },
        /**
         * Hides the backdrop overlay.
         */
        noBackdrop: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it is centered, or not.
         */
        centered: {
            type: Boolean,
            default: false
        }
    },
  methods: {
    away() {
        if (this.noBackdrop) {
            return;
        }

        /**
         * @event close
         *
         * Triggered when the modal is closed.
         */
        this.$emit('close');

        /**
         * @event hidden
         *
         * Triggered when the modal is hidden.
         */
        getEventBus(this).$emit(MODAL_EVENTS.HIDDEN);
    }
  },
};

const _hoisted_1$8 = { class: "modal-content" };

function render$i(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_click_away = resolveDirective("click-away");

  return (openBlock(), createBlock(Transition, { name: "fade" }, {
    default: withCtx(() => [
      (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
        class: normalizeClass([
            'modal',
            this.noBackdrop ? 'modal--no-backdrop' : ''
        ])
      }, {
        default: withCtx(() => [
          withDirectives((openBlock(), createElementBlock("div", {
            class: normalizeClass([
            'modal-dialog',
            $props.size ? `modal-${$props.size}` : '',
            $props.centered ? `modal-dialog-centered` : '',
        ]),
            role: "document"
          }, [
            createElementVNode("div", _hoisted_1$8, [
              renderSlot(_ctx.$slots, "default")
            ])
          ], 2 /* CLASS */)), [
            [_directive_click_away, $options.away]
          ])
        ]),
        _: 3 /* FORWARDED */
      }, 8 /* PROPS */, ["class"]))
    ]),
    _: 3 /* FORWARDED */
  }))
}

var css_248z$5 = "\n.modal[data-v-177f8d4b] {\n    display: block;\n    background-color: rgba(0,0,0,0.5);\n    transition: .3s;\n    overflow-y: auto;\n}\n.modal-dialog[data-v-177f8d4b] {\n    transition: .3s;\n}\n.modal--no-backdrop[data-v-177f8d4b] {\n    background: none;\n    pointer-events: none;\n}\n.fade-enter[data-v-177f8d4b] {\n    transform: translate(0,0);\n    opacity: 1;\n}\n.fade-leave-active[data-v-177f8d4b] {\n    transform: translate(0,0);\n    opacity: 1;\n}\n.fade-enter[data-v-177f8d4b], .fade-leave-active[data-v-177f8d4b] {\n    opacity: 0;\n}\n.fade-enter .modal-dialog[data-v-177f8d4b],\n.fade-leave-active .modal-dialog[data-v-177f8d4b] {\n    -webkit-transform: translate(0,-25%);\n    transform: translate(0,-25%);\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vZGFsLnZ1ZSUzRnZ1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9MTc3ZjhkNGImc2NvcGVkPXRydWUmbGFuZy5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBO0lBQ0ksY0FBYztJQUNkLGlDQUFpQztJQUNqQyxlQUFlO0lBQ2YsZ0JBQWdCO0FBQ3BCO0FBQ0E7SUFDSSxlQUFlO0FBQ25CO0FBQ0E7SUFDSSxnQkFBZ0I7SUFDaEIsb0JBQW9CO0FBQ3hCO0FBQ0E7SUFDSSx5QkFBeUI7SUFDekIsVUFBVTtBQUNkO0FBQ0E7SUFDSSx5QkFBeUI7SUFDekIsVUFBVTtBQUNkO0FBQ0E7SUFDSSxVQUFVO0FBQ2Q7QUFDQTs7SUFFSSxvQ0FBb0M7SUFDcEMsNEJBQTRCO0FBQ2hDIiwiZmlsZSI6Ik1vZGFsLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPTE3N2Y4ZDRiJnNjb3BlZD10cnVlJmxhbmcuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXG4ubW9kYWxbZGF0YS12LTE3N2Y4ZDRiXSB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwwLjUpO1xuICAgIHRyYW5zaXRpb246IC4zcztcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xufVxuLm1vZGFsLWRpYWxvZ1tkYXRhLXYtMTc3ZjhkNGJdIHtcbiAgICB0cmFuc2l0aW9uOiAuM3M7XG59XG4ubW9kYWwtLW5vLWJhY2tkcm9wW2RhdGEtdi0xNzdmOGQ0Yl0ge1xuICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG4uZmFkZS1lbnRlcltkYXRhLXYtMTc3ZjhkNGJdIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLDApO1xuICAgIG9wYWNpdHk6IDE7XG59XG4uZmFkZS1sZWF2ZS1hY3RpdmVbZGF0YS12LTE3N2Y4ZDRiXSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwwKTtcbiAgICBvcGFjaXR5OiAxO1xufVxuLmZhZGUtZW50ZXJbZGF0YS12LTE3N2Y4ZDRiXSwgLmZhZGUtbGVhdmUtYWN0aXZlW2RhdGEtdi0xNzdmOGQ0Yl0ge1xuICAgIG9wYWNpdHk6IDA7XG59XG4uZmFkZS1lbnRlciAubW9kYWwtZGlhbG9nW2RhdGEtdi0xNzdmOGQ0Yl0sXG4uZmFkZS1sZWF2ZS1hY3RpdmUgLm1vZGFsLWRpYWxvZ1tkYXRhLXYtMTc3ZjhkNGJdIHtcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKDAsLTI1JSk7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwtMjUlKTtcbn1cbiJdfQ== */";
styleInject(css_248z$5);

script$i.render = render$i;
script$i.__scopeId = "data-v-177f8d4b";
script$i.__file = "src/components/modal/Modal.vue";

var script$h = {
    name: 'd-modal-header',
    components: {
        dBtnClose: script$Z
    },
    props: {
        /**
         * The component's tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether to display the close button, or not.
         */
        close: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        away() {
            this.$parent.$emit('close');
        }
    }
};

function render$h(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_d_btn_close = resolveComponent("d-btn-close");

  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), { class: "modal-header" }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default"),
      ($props.close)
        ? (openBlock(), createBlock(_component_d_btn_close, {
            key: 0,
            onClick: withModifiers($options.away, ["prevent"])
          }, null, 8 /* PROPS */, ["onClick"]))
        : createCommentVNode("v-if", true)
    ]),
    _: 3 /* FORWARDED */
  }))
}

script$h.render = render$h;
script$h.__file = "src/components/modal/ModalHeader.vue";

var script$g = {
    name: 'd-modal-title',
    props: {
        /**
         * The component's tag.
         */
        tag: {
            type: String,
            default: 'h5'
        }
    }
};

function render$g(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), { class: "modal-title" }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }))
}

script$g.render = render$g;
script$g.__file = "src/components/modal/ModalTitle.vue";

var script$f = {
    name: 'd-modal-body',
    props: {
        /**
         * The component's tag.
         */
        tag: {
            type: String,
            default: 'div'
        }
    }
};

function render$f(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), { class: "modal-body" }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }))
}

script$f.render = render$f;
script$f.__file = "src/components/modal/ModalBody.vue";

var script$e = {
    name: 'd-modal-footer',
    props: {
        /**
         * The component's tag.
         */
        tag: {
            type: String,
            default: 'div'
        }
    }
};

function render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), { class: "modal-footer" }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }))
}

script$e.render = render$e;
script$e.__file = "src/components/modal/ModalFooter.vue";

const components$8 = {
    dModal: script$i,
    dModalHeader: script$h,
    dModalTitle: script$g,
    dModalBody: script$f,
    dModalFooter: script$e
};

const VuePlugin$a = {
  install (Vue) {
    registerComponents(Vue, components$8);
  }
};

var script$d = {
    name: 'd-nav',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'ul'
        },
        /**
         * Fill all available space.
         */
        fill: {
            type: Boolean,
            default: false
        },
        /**
         * Define equal width elements.
         */
        justified: {
            type: Boolean,
            default: false
        },
        /**
         * Display as tabs.
         */
        tabs: {
            type: Boolean,
            default: false
        },
        /**
         * Display as pills.
         */
        pills: {
            type: Boolean,
            default: false
        },
        /**
         * Display vertical.
         */
        vertical: {
            type: Boolean,
            default: false
        }
    }
};

function render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
        'nav',
        $props.tabs ? 'nav-tabs' : '',
        $props.pills ? 'nav-pills' : '',
        $props.vertical ? 'flex-column' : '',
        $props.fill ? 'nav-fill' : '',
        $props.justified ? 'nav-justified' : ''
    ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$d.render = render$d;
script$d.__file = "src/components/nav/Nav.vue";

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
var script$c = {
    name: 'd-nav-item',
    components: {
        dLink: script$X
    },
    props: createLinkProps()
};

const _hoisted_1$7 = { class: "nav-item" };

function render$c(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_d_link = resolveComponent("d-link");

  return (openBlock(), createElementBlock("li", _hoisted_1$7, [
    createVNode(_component_d_link, mergeProps(_ctx.$props, { class: "nav-link" }), {
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "default")
      ]),
      _: 3 /* FORWARDED */
    }, 16 /* FULL_PROPS */)
  ]))
}

script$c.render = render$c;
script$c.__file = "src/components/nav/NavItem.vue";

const components$7 = {
    dNav: script$d,
    dNavItem: script$c
};

const VuePlugin$9 = {
  install (Vue) {
    registerComponents(Vue, components$7);
  }
};

var script$b = {
    name: 'd-navbar',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'nav'
        },
        /**
         * The navbar type.
         */
        type: {
            type: String,
            default: 'light'
        },
        /**
         * The theme color.
         */
        theme: {
            type: String,
            validator: v => THEMECOLORS.includes(v)
        },
        /**
         * Whether the navbar is toggleable, or not. Also accepts String for breakpoint definition.
         */
        toggleable: {
            type: [String, Boolean],
            default: false
        },
        /**
         * Fix the navbar to either `top` or `bottom`.
         */
        fixed: {
            type: String
        },
        /**
         * Whether the navbar should be sticky.
         */
        sticky: {
            type: Boolean,
            default: false
        }
    }
};

function render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
        'navbar',
        $props.type ? `navbar-${$props.type}` : '',
        $props.theme ? `bg-${$props.theme}` : '',
        $props.fixed ? `fixed-${$props.fixed}` : '',
        $props.sticky ? 'sticky-top' : '',
        $props.toggleable ? `navbar-expand-${($props.toggleable ? 'sm' : $props.toggleable) || 'sm'}` : ''
    ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$b.render = render$b;
script$b.__file = "src/components/navbar/Navbar.vue";

/**
 * This subcomponent is inheriting <a href="/docs/components/link">Link</a> component's props.
 */
var script$a = {
    name: 'd-navbar-brand',
    components: {
        dLink: script$X
    },
    props: {
        ...createLinkProps(), ...{
            /**
             * The element tag.
             */
            tag: {
                type: String,
                default: 'div'
            }
        }
    },
    computed: {
        computedTag() {
            // eslint-disable-next-line
            return Boolean(this.to || this.href) ? 'd-link' : this.tag
        },
        computedProps() {
            // eslint-disable-next-line
            return Boolean(this.to || this.href) ? this.$props : {}
        }
    }
};

function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($options.computedTag), normalizeProps(guardReactiveProps($options.computedProps)), {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 16 /* FULL_PROPS */))
}

script$a.render = render$a;
script$a.__file = "src/components/navbar/NavbarBrand.vue";

var script$9 = {
    name: 'd-navbar-nav',
    props: {
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'ul'
        },
        /**
         * Whether it should fill the entire space, or not.
         */
        fill: {
            type: Boolean,
            default: false
        },
        /**
         * Whether to proportionally fill all abailable space, or not.
         */
        justified: {
            type: Boolean,
            default: false
        }
    }
};

function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    class: normalizeClass([
        'navbar-nav',
        $props.fill ? 'nav-fill' : '',
        $props.justified ? 'nav-justified' : ''
    ])
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["class"]))
}

script$9.render = render$9;
script$9.__file = "src/components/navbar/NavbarNav.vue";

var script$8 = {
    name: 'd-navbar-toggle',
    mixins: [ rootListenerMixin ],
    data() {
        return {
            toggleState: false
        }
    },
    props: {
        /**
         * The label value.
         */
        label: {
            type: String,
            default: 'Toggle navigation'
        },
        /**
         * The toggle target.
         */
        target: {
            type: String,
            required: true
        }
    },
    methods: {
        onClick() {
            this.emitOnRoot(COLLAPSE_EVENTS.TOGGLE, this.target);
        },
        handleStateEvent(id, state) {
            if (id === this.target) {
                this.toggleState = state;
            }
        }
    },
    created() {
        this.listenOnRoot(COLLAPSE_EVENTS.STATE, this.handleStateEvent);
    }
};

const _hoisted_1$6 = ["aria-label", "aria-controls", "aria-expanded"];

function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("button", {
    class: "navbar-toggler",
    "aria-label": $props.label,
    "aria-controls": $props.target,
    "aria-expanded": $data.toggleState ? 'true' : 'false',
    onClick: _cache[0] || (_cache[0] = (...args) => ($options.onClick && $options.onClick(...args)))
  }, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      _cache[1] || (_cache[1] = createElementVNode("span", { class: "navbar-toggler-icon" }, null, -1 /* CACHED */))
    ])
  ], 8 /* PROPS */, _hoisted_1$6))
}

script$8.render = render$8;
script$8.__file = "src/components/navbar/NavbarToggle.vue";

const components$6 = {
    dNavbar: script$b,
    dNavbarBrand: script$a,
    dNavbarNav: script$9,
    dNavbarToggle: script$8
};

const VuePlugin$8 = {
  install (Vue) {
    registerComponents(Vue, components$6);
  }
};

const Defaults$2 = {
    animation: true,
    template: '',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    placement: 'top',
    offset: 0,
    arrowPadding: 6,
    container: false,
    fallbackPlacement: 'flip',
    callbacks: {},
    boundary: 'scrollParent'
};

const TransitionEndEvents = {
  WebkitTransition: ['webkitTransitionEnd'],
  MozTransition: ['transitionend'],
  OTransition: ['otransitionend', 'oTransitionEnd'],
  transition: ['transitionend']
};

const MODAL_CLASS = '.modal-content';

class TPManager {
    constructor(targetElement, config, $root) {
        this._config = null;
        this._isEnabled = true;
        this._fadeTimeout = null;
        this._hoverTimeout = null;
        this._visibleInterval = null;
        this._hoverState = '';
        this._activeTrigger = {};
        this._popperInstance = null;
        this._targetElement = targetElement;
        this._TPElement = null;
        this._id = guid();
        this._$root = $root || null;
        this._routeWatcher = null;

        this.updateConfig(config);
    }

    static get Defaults() {
        return Defaults$2
    }

    static getPlacement(placement) {
        return N_TP_PLACEMENTS[placement.toUpperCase()]
    }

    /*--------------------------------------------------------------------------
    /* PUBLIC
    /*--------------------------------------------------------------------------*/

    updateConfig(config) {
        let updatedConfig = { ...this.constructor.Defaults, ...config };

        if (config.delay && typeof config.delay === 'number') {
            updatedConfig.delay = {
                show: config.delay,
                hide: config.delay
            };
        }

        ['title', 'content'].forEach(part => {
            if (config[part] && typeof config[part] === 'number') {
                updatedConfig[part] = config[part].toString();
            }
        });

        this._config = updatedConfig;

        this._updateTitleAttributes();
        this._removeEventListeners();
        this._addEventListeners();
    }

    show() {
        if (!document.body.contains(this._targetElement) || !isVisible(this._targetElement)) {
            return
        }

        const TPElement = this._getElement();
        this._updateTitleAttributes();
        this.setContent(TPElement);

        // Don't show if there's no content
        if (!this.hasContent(TPElement)) {
            this._TPElement = null;
            return
        }

        // Set the ID on the TP element
        setAttr(TPElement, 'id', this._id);

        // Set the aria-describedby attribute on the target element
        let desc = getAttr(this._targetElement, 'aria-describedby') || '';
        desc = desc.split(/\s+/).concat(this._id).join(' ').trim();
        setAttr(this._targetElement, 'aria-describedby', desc);

        // Set animations
        if (this._config.animation) {
            addClass(TPElement, TP_STATE_CLASSES.FADE);
        } else {
            removeClass(TPElement, TP_STATE_CLASSES.FADE);
        }

        // Process placement
        let placement = this._config.placement;

        if (typeof placement === 'function') {
            placement = placement.call(this, this._TPElement, this._targetElement);
        }

        const attachment = this.constructor.getPlacement(placement);
        this._addPlacementClass(attachment);

        // Emit and process a custom event
        const _showEvent = new CancelableEvent('show', {
            cancelable: true,
            target: this._targetElement,
            relatedTarget: TPElement
        });

        this._emitCustomEvent(_showEvent);

        if (_showEvent.defaultPrevented) {
            this._TPElement = null;
            return
        }

        // Append the TP element to the container
        const container = this._getContainer();
        if (!document.body.contains(TPElement)) {
            container.appendChild(TPElement);
        }

        // Reinitialize Popper
        this._removePopper();
        this._popperInstance = new Popper(this._targetElement, TPElement, this._getPopperConfig(placement, TPElement));

        // Prep the transition complete handler
        const _transitionCompleteHandler = () => {
            if (this._config.animation) {
                const initConfigAnimation = this._config.animation || false;

                if (getAttr(TPElement, 'x-placement') !== null) {
                    return
                }

                removeClass(TPElement, TP_STATE_CLASSES.FADE);
                this._config.animation = false;
                this.hide();
                this.show();
                this._config.animation = initConfigAnimation;
            }

            const prevHoverState = this._hoverState;
            this._hoverState = null;

            if (prevHoverState === TOOLTIP_HOVER_STATE_CLASSES.OUT) {
                this._handleLeave(null);
            }

            const shownEvt = new CancelableEvent('shown', {
                cancelable: false,
                target: this._targetElement,
                relatedTarget: TPElement
            });

            this._emitCustomEvent(shownEvt);
        };

        // Enable edge case listeners
        this._handleEdgeCases(true);
        addClass(TPElement, TP_STATE_CLASSES.SHOW);
        this._transitionOnce(TPElement, _transitionCompleteHandler);
    }

    hide(callbackFn, force) {
        const TPElement = this._TPElement;

        if (!TPElement) {
            return
        }

        const hideEvent = new CancelableEvent('hide', {
            cancelable: !force,
            target: this._targetElement,
            relatedTarget: TPElement
        });

        this._emitCustomEvent(hideEvent);

        // Don't hide if the custom event is cancelled
        if (hideEvent.defaultPrevented) {
            return
        }

        // Disable edge case listeners
        this._handleEdgeCases(false);

        if (force) {
            removeClass(TPElement, TP_STATE_CLASSES.FADE);
        }

        removeClass(TPElement, TP_STATE_CLASSES.SHOW);

        // Update active trigger flags
        this._activeTrigger.click = false;
        this._activeTrigger.focus = false;
        this._activeTrigger.hover = false;

        const _transitionCompleteHandler = () => {
            if (this._hoverState !== TOOLTIP_HOVER_STATE_CLASSES.SHOW && TPElement.parentNode) {
                TPElement.parentNode.removeChild(TPElement);

                // Remove the `aria-describedby` attribute
                let desc = getAttr(this._targetElement, 'aria-describedby') || '';
                desc = desc.split(/\s+/).filter(d => d !== this._id).join(' ').trim();
                desc ? setAttr(this._targetElement, 'aria-describedby', desc) : removeAttr(this._targetElement, 'aria-describedby');

                // Remove Popper and unset TPElement
                this._removePopper();
                this._TPElement = null;
            }

            // Run the callback function if any.
            if (callbackFn) {
                callbackFn();
            }

            // Prep and emit custom event
            const _hiddenEvent = new CancelableEvent('hidden', {
                cancelable: false,
                target: this._targetElement,
                relatedTarget: null
            });

            this._emitCustomEvent(_hiddenEvent);
        };

        this._transitionOnce(TPElement, _transitionCompleteHandler);
        this._hoverState = '';
    }

    destroy() {
        this._removeEventListeners();
        this._handleEdgeCases(false);

        clearTimeout(this._hoverTimeout);
        clearTimeout(this._fadeTimeout);

        if (this._popperInstance) {
            this._popperInstance.destroy();
        }

        if (this._TPElement && this._TPElement.parentElement) {
            this._TPElement.parentElement.removeChild(this._TPElement);
        }

        this._hoverTimeout = null;
        this._fadeTimeout = null;
        this._popperInstance = null;
        this._TPElement = null;
        this._id = null;
        this._$root = null;
        this._isEnabled = true;
        this._hoverState = null;
        this._activeTrigger = null;
        this._targetElement = null;
    }

    setElementContent(container, content) {
        if (!container) {
            return
        }

        if (typeof content !== 'object' && !content.nodeType) {
            container[this._config.html ? 'innerHTML' : 'innerText'] = content;
            return
        }

        if (this._config.html && content.parentElement !== container) {
            container.innerHTML = '';
            container.appendChild(content);
            return
        }

        container.innerText = content.innerText;
    }

    getTitle() {
        let title = this._config.title || '';

        // Fallback to attributes or empty string
        if (!title) {
            title = getAttr(this._targetElement, 'title')
                        || getAttr(this._targetElement, 'data-original-title')
                        || '';
        }

        switch (typeof title) {
            case 'function':
                title = title(this._targetElement);
                break
            case 'object':
                if (title.nodeType && !title.innerHTML.trim()) {
                    title = '';
                }
                break
            case 'string':
                title = title.trim();
                break
        }

        return title
    }

    handleEvent(e) {
        if (isDisabled(this._targetElement) || !this._isEnabled) {
            return
        }

        switch (e.type) {
            case 'click':
                this._handleToggle(e);
                break
            case 'focusout':
                this._handleFocusOut(e);
                break
            case 'mouseleave':
                this._handleLeave(e);
                break
            case 'focusin':
            case 'mouseenter':
                this._handleEnter(e);
                break
        }
    }

    /*--------------------------------------------------------------------------
    /* PRIVATE
    /*--------------------------------------------------------------------------*/

    _addEventListeners() {
        const triggers = this._config.trigger.trim().split(/\s+/);
        const el = this._targetElement;


        triggers.forEach(trigger => {
            switch (trigger) {
                case 'click':
                    el.addEventListener('click', this);
                    break
                case 'focus':
                    el.addEventListener('focusin', this);
                    el.addEventListener('focusout', this);
                    break
                case 'blur':
                    el.addEventListener('focusout', this);
                    break
                case 'hover':
                    el.addEventListener('mouseenter', this);
                    el.addEventListener('mouseleave', this);
            }
        }, this);
    }

    _removeEventListeners() {
        ['click', 'focusin', 'focusout', 'mouseenter', 'mouseleave']
            .forEach(e => this._targetElement.removeEventListener(e, this), this);
    }

    _handleFocusOut(e) {
        // Don't trigger if the focus moves from trigger to TP element
        if (
            this._TPElement
            && this._targetElement
            && this._targetElement.contains(e.target)
            && this._TPElement.contains(e.relatedTarget)
        ) {
            return
        }

        // Don't trigger if the focus moves from TP element to trigger
        if (
            this._TPElement
            && this._targetElement
            && this._TPElement.contains(e.target)
            && this._targetElement.contains(e.relatedTarget)
        ) {
            return
        }

        // Don't trigger if the focus moves within the element
        if (
            this._TPElement
            && this._TPElement.contains(e.target)
            && this._TPElement.contains(e.relatedTarget)
        ) {
            return
        }

        this._handleLeave(e);
    }

    _getElement() {
        let tpl = this._config.template;
        tpl = (!tpl || typeof tpl !== 'string') ? this.constructor.Defaults.template : this._config.template;

        if (!this._TPElement) {
            let div = document.createElement('div');
            div.innerHTML = tpl.trim();
            this._TPElement = div.firstElementChild ? div.removeChild(div.firstElementChild) : null;
            div = null;
        }

        this._TPElement.tabIndex = -1;

        return this._TPElement
    }

    _forceHide() {
        if (!this._TPElement || !hasClass(this._TPElement, TP_STATE_CLASSES.SHOW)) {
            return
        }

        this._handleEdgeCases(false);
        clearTimeout(this._hoverTimeout);
        this._hoverTimeout = null;
        this._hoverState = '';
        this.hide(null, true);
    }

    _handleToggle(event) {
        if (!this._isEnabled) {
            return
        }

        if (event) {
            this._activeTrigger.click = !this._activeTrigger.click;
            this._hasActiveTrigger() ? this._handleEnter(null) : this._handleLeave(null);
            return
        }

        hasClass(this._getElement(), TP_STATE_CLASSES.SHOW) ? this._handleLeave(null) : this._handleEnter(null);
    }

    _handleLeave(e) {
        if (e) {
            const trigger = e.type === 'focusout' ? 'focus' : 'hover';
            this._activeTrigger[trigger] = false;

            if (e.type === 'focusout' && /blur/.test(this._config.trigger)) {
                this._activeTrigger.click = false;
                this._activeTrigger.hover = false;
            }
        }

        if (this._hasActiveTrigger()) {
            return
        }

        clearTimeout(this._hoverTimeout);

        this._hoverState = TOOLTIP_HOVER_STATE_CLASSES.OUT;

        if (!this._config.delay || !this._config.delay.hide) {
            this.hide();
            return
        }

        this._hoverTimeout = setTimeout(() => {
            if (this._hoverState === TOOLTIP_HOVER_STATE_CLASSES.OUT) {
                this.hide();
            }
        }, this._config.delay.hide);
    }


    _hasActiveTrigger() {
        for (const trigger in this._activeTrigger) {
            if (this._activeTrigger[trigger]) {
                return true
            }
        }

        return false
    }

    _updateTitleAttributes() {
        const el = this._targetElement;
        const titleType = typeof getAttr(el, 'data-original-title');
        if (getAttr(el, 'title') || titleType !== 'string') {
            setAttr(el, 'data-original-title', getAttr(el, 'title') || '');
            setAttr(el, 'title', '');
        }
    }

    _handleEnter(e) {
        if (e) {
            const trigger = e.type === 'focusin' ? focus : 'hover';
            this._activeTrigger[trigger] = true;
        }

        if (hasClass(this._getElement(), TP_STATE_CLASSES.SHOW) || this._hoverState === TP_STATE_CLASSES.SHOW) {
            this._hoverState = TP_STATE_CLASSES.SHOW;
            return
        }

        clearTimeout(this._hoverTimeout);
        this._hoverState = TP_STATE_CLASSES.SHOW;

        if (!this._config.delay || !this._config.delay.show) {
            this.show();
            return
        }

        this._hoverTimeout = setTimeout(() => {
            if (this._hoverState === TP_STATE_CLASSES.SHOW) {
                this.show();
            }
        }, this._config.delay.show);
    }

    _handleEdgeCases(on) {
        if (this._TPElement === null) {
            return
        }

        this._setModalListener(on);
        this._visibleCheck(on);
        this._setRouteWatcher(on);
        this._setOnTouchStartListener(on);

        if (on && /(focus|blur)/.test(this._config.trigger)) {
            this._TPElement.addEventListener('focusout', this);
        } else {
            this._TPElement.removeEventListener('focusout', this);
        }
    }

    _setModalListener (on) {
        const modal = closest(MODAL_CLASS, this._targetElement);

        if (!modal) {
            return
        }

        if (this._$root) {
            this._$root[on ? '$on' : '$off'](MODAL_EVENTS.HIDDEN, this._forceHide.bind(this));
        }
    }

    _visibleCheck(on) {
        clearInterval(this._visibleInterval);
        this._visibleInterval = null;

        if (!on) {
            return
        }

        this._visibleInterval = setInterval(() => {
            const tip = this._getElement();
            if (tip && !isVisible(this._targetElement) && hasClass(tip, TP_STATE_CLASSES.SHOW)) {
                this._forceHide();
            }
        }, 100);
    }

    _setRouteWatcher(on) {
        if (on) {
            this._setRouteWatcher(false);
            if (this._$root && Boolean(this._$root.route)) {
                this._routeWatcher = this._$root.$watch('$route', (newVal, oldVal) => {
                    if (newVal === oldVal) {
                        return
                    }

                    this._forceHide();
                });
            }
        } else {
            if (this._routeWatcher) {
                this._routeWatcher();
                this._routeWatcher = null;
            }
        }
    }

    _setOnTouchStartListener(on) {
        if (!('ontouchstart' in document.documentElement)) {
            return
        }

        Array.from(document.body.children).forEach(el => {
            if (on) {
                el.addEventListener('mouseover', () => {});
            } else {
                el.removeEventListener('mouseover', () => {});
            }
        });
    }

    _getPopperConfig(placement, tip) {
        return {
            placement: this.constructor.getPlacement(placement),
            modifiers: {
                offset: { offset: this._getOffset(placement, tip) },
                flip: { behavior: this._config.fallbackPlacement },
                arrow: { element: '.arrow' },
                preventOverflow: { boundariesElement: this._config.boundary }
            },
            onCreate: data => {
                if (data.originalPlacement !== data.placement) {
                    this._handlePopperPlacementChange(data);
                }
            },
            onUpdate: data => {
                this._handlePopperPlacementChange(data);
            }
        }
    }

    _getOffset(placement, tip) {
        if (this._config.offset) {
            return this._config.offset
        }

        const arrow = selectElement(TOOLTIP_SELECTORS.ARROW, tip);
        const arrowOffset = parseFloat(getComputedStyles(arrow).width) + parseFloat(this._config.arrowPadding);
        switch (TP_OFFSET_MAP[placement.toUpperCase()]) {
            case 1:
                return `+50%p - ${arrowOffset}px`
            case -1:
                return `-50%p + ${arrowOffset}px`
            default:
                return 0
        }
    }

    _handlePopperPlacementChange(data) {
        const TPElement = this._getElement();
        const tabClass = TPElement.className.match(new RegExp(`\\b${this.constructor.ClassPrefix}\\S+`, 'g'));

        if (tabClass === null && !tabClass.length) {
            return
        }

        tabClass.forEach(className => removeClass(TPElement, className));
        this._addPlacementClass(this.constructor.getPlacement(data.placement));
    }

    _removePopper() {
        if (this._popperInstance) {
            this._popperInstance.destroy();
        }

        this._popperInstance = null;
    }

    _getContainer() {
        const container = this._config.container;
        const body = document.body;
        return container === false ? (closest(MODAL_CLASS, this._targetElement) || body) : (selectElement(container, body) || body)
    }

    _emitCustomEvent(event) {
        const eventName = event.type;

        if (this._$root && this._$root.$emit) {
            this._$root.$emit(`dr:${this.constructor.Name}:${eventName}`, event);
        }

        const callbacks = this._config.callbacks || {};

        if (typeof callbacks[eventName] === 'function') {
            callbacks[eventName]();
        }
    }

    _transitionOnce(TPElement, completeHandlerFn) {
        const transEvents = this._getTransitionEndEvents();
        let called = false;
        clearTimeout(this._fadeTimeout);
        this._fadeTimeout = null;

        const fnOnce = () => {
            if (called) {
                return
            }

            called = true;
            clearTimeout(this._fadeTimeout);
            this._fadeTimeout = null;
            transEvents.forEach(eventName => TPElement.removeEventListener(eventName, fnOnce));
            completeHandlerFn();
        };

        if (hasClass(TPElement, TP_STATE_CLASSES.FADE)) {
            transEvents.forEach(eventName => TPElement.addEventListener(eventName, fnOnce));
            this._fadeTimeout = setTimeout(fnOnce, 150);
        } else {
            fnOnce();
        }
    }

    _getTransitionEndEvents() {
        for (const name in TransitionEndEvents) {
            if (this._targetElement.style[name] !== undefined) {
                return TransitionEndEvents[name]
            }
        }

        return []
    }

    _addPlacementClass(placement) {
        const Popover = this._getElement();
        addClass(Popover, `${this.constructor.ClassPrefix}-${placement}`);
    }
}

const PopoverDefaults = {
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
};

const Defaults$1 = { ...TPManager.Defaults, ...PopoverDefaults };

class Popover extends TPManager {

    static get Name () {
        return 'popover'
    }

    static get Defaults () {
        return Defaults$1
    }

    static get ClassPrefix () {
        return 'bs-popover'
    }

    /*--------------------------------------------------------------------------
    /* OVERRIDES
    /*--------------------------------------------------------------------------*/

    /**
     * Checks if the Popover has content.
     * @returns True if the Popover has content (title or body), false otherwise.
     */
    hasContent(TPElement) {
        const Popover = TPElement || this._TPElement;

        if (!Popover) {
            return false
        }

        const popoverHeaderEl = selectElement(POPOVER_SELECTORS.HEADER, Popover);
        const popoverBodyEl = selectElement(POPOVER_SELECTORS.BODY, Popover);
        const hasHeader = Boolean((popoverHeaderEl || {}).innerHTML);
        const hasBody = Boolean((popoverBodyEl || {}).innerHTML);

        return hasHeader || hasBody
    }

    /**
     * Sets the content for the Popover element.
     */
    setContent(TPElement) {
        const Popover = TPElement || this._TPElement;

        const popoverHeaderEl = selectElement(POPOVER_SELECTORS.HEADER, Popover);
        const popoverBodyEl = selectElement(POPOVER_SELECTORS.BODY, Popover);

        this.setElementContent( popoverHeaderEl, this.getTitle());
        this.setElementContent( popoverBodyEl, this.getContent());

        removeClasses(Popover, [TP_STATE_CLASSES.FADE, TP_STATE_CLASSES.SHOW]);
    }

    /*--------------------------------------------------------------------------
    /* CLASS SPECIFIC
    /*--------------------------------------------------------------------------*/

    /**
     * Returns the Popover content.
     */
    getContent() {
        let content = this._config.content || '';

        switch (content) {
            case 'string':
                content = content.trim();
                break
            case 'function':
                content = content(this._targetElement);
                break
            case 'object':
                if (content.nodeType && !content.innerHTML.trim()) {
                    content = '';
                }
                break
        }

        return content
    }
}

/**
 * Observes DOM changes.
 * @see http://stackoverflow.com/questions/3219758
 */
var DOMObserver = (el, callback, opts = null) => {

    if (opts === null) {
        opts = {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        };
    }

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const eventListenerSupported = window.addEventListener;

    el = el ? (el.$el || el) : null;
    if (!isElement(el)) {
        return null
    }

    let obs = null;

    if (MutationObserver) {
        obs = new MutationObserver(mutations => {
            let changed = false;
            for (let i = 0; i < mutations.length && !changed; i++) {
                const mutation = mutations[i];
                const type = mutation.type;
                const target = mutation.target;
                if (type === 'characterData' && target.nodeType === Node.TEXT_NODE) {
                    changed = true;
                } else if (type === 'attributes') {
                    changed = true;
                } else if (type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    changed = true;
                }
            }
            if (changed) {
                callback();
            }
        });

        obs.observe(el, { ...{ childList: true, subtree: true }, ...opts });
    } else if (eventListenerSupported) {
        el.addEventListener('DOMNodeInserted', callback, false);
        el.addEventListener('DOMNodeRemoved', callback, false);
    }

    return obs
};

var TooltipPopoverMixin = {
    /**
     * Watch the show and disabled props and handle each case accordingly.
     */
    watch: {
        show (show, oldShow) {
            if (show === oldShow) {
                return
            }

            show ? this._handleShow() : this._handleHide();
        },
        disabled (disabled, oldDisabled) {
            if (disabled === oldDisabled) {
                return
            }

            disabled ? this._handleDisable() : this._handleEnable();
        }
    },

    /**
     * Setup initial values after the instance is created.
     */
    created() {
        this._TPInstance = null;
        this._obs_title = null;
        this._obs_content = null;
    },

    /**
     * Bootstrap the Tooltip/Popover after the instance is mounted.
     */
    mounted() {
        this.$nextTick(() => {
            // The Tooltip/Popover instance is defined in each individual component
            const TPInstance = this.bootstrap();

            // If there's no TPInstance it means that there's no target, so just return here
            if (!TPInstance) {
                return
            }

            this._enableDOMObserver();

            if (this.disabled) {
                this._handleDisable();
            }

            if (this.show) {
                this._handleShow();
            }
        });
    },

    /**
     * Update the config when data changes.
     */
    updated() {
        if (!this._TPInstance) {
            return
        }

        this._TPInstance.updateConfig(this.getUpdatedConfig());
    },

    /**
     * Setup the observers.
     */
    activated() {
        this._enableDOMObserver();
    },

    /**
     * Disable the observers and hide the instance.
     */
    deactivated() {
        if (this._TPInstance) {
            this._disableDOMObserver();
            this._TPInstance.hide();
        }
    },

    /**
     * Clean up everything before the instance is destroyed.
     */
    beforeUnmount() {
        this._disableDOMObserver();

        if (this._TPInstance) {
            this._TPInstance.destroy();
            this._TPInstance = null;
        }
    },

    computed: {
        baseConfig() {
            const title = (this.title || '').trim();
            const content = (this.content || '').trim();
            const placement = TP_PLACEMENTS[this.placement.toUpperCase()] || 'auto';
            const container = this.container || false;
            const boundary = this.boundary;
            const delay = (typeof this.delay === 'object') ? this.delay : (parseInt(this.delay, 10) || 0);
            const offset = this.offset || 0;
            const animation = !this.noFade;
            const trigger = isArray(this.triggers) ? this.triggers.join(' ') : this.triggers;

            const callbacks = {
                show: this._emitShowEvent,
                shown: this._emitShownEvent,
                hide: this._emitHideEvent,
                hidden: this._emitHiddenEvent,
                enabled: this._emitEnabledEvent,
                disabled: this._emitDisabledEvent
            };

            return {
                title,
                content,
                placement,
                container,
                boundary,
                delay,
                offset,
                animation,
                trigger,
                callbacks
            }
        }
    },

    methods: {

        /*--------------------------------------------------------------------------
        /* PUBLIC
        /*--------------------------------------------------------------------------*/

        /**
         * Returns the target element.
         */
        getTarget() {
            let _target = null;

            switch (typeof this.target) {
                case 'function':
                    _target = this.target();
                    break
                case 'string':
                    _target = getById(this.target);
                    break
                case 'object':
                    if (isElement(this.target.$el)) {
                        _target = this.target.$el;
                    } else if (isElement(this.target)) {
                        _target = this.target;
                    }
                    break
            }

            return _target
        },

        /**
         * Returns the updated config.
         */
        getUpdatedConfig() {
            const updatedConfig = { ...this.baseConfig };

            // override title if slot is used
            if (this.$refs.title) {
                updatedConfig.title = this.$refs.title;
                updatedConfig.html = true;
            }

            // override content if slot is used
            if (this.$refs.content) {
                updatedConfig.content = this.$refs.content;
                updatedConfig.html = true;
            }

            return updatedConfig
        },

        /*--------------------------------------------------------------------------
        /* PRIVATE
        /*--------------------------------------------------------------------------*/

        _handleShow() {
            if (this._TPInstance) {
                this._TPInstance.show();
            }
        },

        _handleHide(callback) {
            if (this._TPInstance) {
                this._TPInstance.hide(callback);
            } else if (typeof callback === 'function') {
                callback();
            }
        },

        _handleDisable() {
            if (this._TPInstance) {
                this._TPInstance.disable();
            }
        },

        _handleEnable() {
            if (this._TPInstance) {
                this._TPInstance.enable();
            }
        },

        _emitShowEvent(event) {
            this.$emit('show', event);
        },

        _emitShownEvent(event) {
            this._enableDOMObserver();

            this.$emit('update:show', true);
            this.$emit('shown', event);
        },

        _emitHideEvent(event) {
            this.$emit('hide', event);
        },

        _emitHiddenEvent(event) {
            this._disableDOMObserver();

            this.$emit('update:show', false);
            this.$emit('hidden', event);
        },

        _emitEnabledEvent(event) {
            if (!event || event.type !== 'enabled') {
                return
            }

            this.$emit('update:disabled', false);
            this.$emit('disabled');
        },

        _emitDisabledEvent(event) {
            if (!event || event.type !== 'disabled') {
                return
            }

            this.$emit('update:disabled', true);
            this.$emit('enabled');
        },

        _updatePosition() {
            if (this._TPInstance) {
                this._TPInstance.update();
            }
        },

        _enableDOMObserver() {
            if (this.$refs.title) {
                this._obs_title = DOMObserver(
                    this.$refs.title,
                    this._updatePosition.bind(this)
                );
            }

            if (this.$refs.content) {
                this._obs_content = DOMObserver(
                    this.$refs.content,
                    this._updatePosition.bind(this)
                );
            }
        },

        _disableDOMObserver() {
            if (this._obs_title) {
                this._obs_title.disconnect();
                this._obs_title = null;
            }

            if (this._obs_content) {
                this._obs_content.disconnect();
                this._obs_content = null;
            }
        }
    }
};

var script$7 = {
    name: 'd-popover',
    mixins: [ TooltipPopoverMixin ],
    emits: ['show', 'shown', 'hide', 'hidden', 'update:show', 'update:disabled', 'enabled', 'disabled'],
    props: {
        /**
         * Title
         */
        title: {
            type: String,
            default: ''
        },
        /**
         * Content
         */
        content: {
            type: String,
            default: ''
        },
        /**
         * Triggers
         */
        triggers: {
            type: [String, Array],
            default: 'click'
        },
        /**
         * Placement.
         */
        placement: {
            type: String,
            default: 'top',
            validator: val => Object.keys(TP_PLACEMENTS).map(p => p.toLowerCase()).includes(val)
        },
        /**
         * The target element.
         */
        target: {
            type: [String, Object, Function]
        },
        /**
         * Delay in miliseconds.
         */
        delay: {
            type: [Number, Object, String],
            default: 0
        },
        /**
         * Offset.
         */
        offset: {
            type: [Number, String]
        },
        /**
         * Disable animations.
         */
        noFade: {
            type: Boolean,
            default: false
        },
        /**
         * Wrapping container.
         */
        container: {
            type: String,
            default: null
        },
        /**
         * Instance boundaries.
         */
        boundary: {
            type: [String, Object],
            default: 'scrollParent'
        },
        /**
         * Show state.
         */
        show: {
            type: Boolean,
            default: false
        },
        /**
         * Disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        /**
         * Gets the target and if the target exists, it initializes the Popover.
         * Used inside the TooltipPopoverMixin
         */
        bootstrap() {
            const target = this.getTarget();

            if (target) {
                this._TPInstance = new Popover(
                    target,
                    this.getUpdatedConfig(),
                    getEventBus(this)
                );
            }

            return this._TPInstance
        }
    }
};

const _hoisted_1$5 = {
  class: "d-none",
  style: {"display":"none"},
  "aria-hidden": "true"
};
const _hoisted_2$3 = { ref: "title" };
const _hoisted_3$1 = { ref: "content" };

function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", _hoisted_1$5, [
    createElementVNode("div", _hoisted_2$3, [
      renderSlot(_ctx.$slots, "title")
    ], 512 /* NEED_PATCH */),
    createElementVNode("div", _hoisted_3$1, [
      renderSlot(_ctx.$slots, "default")
    ], 512 /* NEED_PATCH */)
  ]))
}

script$7.render = render$7;
script$7.__file = "src/components/popover/Popover.vue";

const components$5 = {
    dPopover: script$7
};

const VuePlugin$7 = {
  install (Vue) {
    registerComponents(Vue, components$5);
  }
};

var script$6 = {
    name: 'd-progress',
    props: {
        /**
         * Theme color.
         */
        theme: {
            type: String,
            default: 'primary'
        },
        /**
         * Whether it should be striped, or not.
         */
        striped: {
            type: Boolean,
            default: false
        },
        /**
         * Whether it should be animated, or not.
         */
        animated: {
            type: Boolean,
            default: false
        },
        /**
         * Height value.
         */
        height: {
            type: String,
            default: null
        },
        /**
         * Precision number of digits.
         */
        precision: {
            type: Number,
            default: 0
        },
        /**
         * Whether to show progress, or not.
         */
        showProgress: {
            type: Boolean,
            default: false
        },
        /**
         * Whether to show the value, or not.
         */
        showValue: {
            type: Boolean,
            default: false
        },
        /**
         * The maximum value.
         */
        max: {
            type: Number,
            default: 100
        },
        /**
         * The value.
         */
        value: {
            type: Number,
            default: 0
        },
        /**
         * The size.
         */
        size: {
            type: String,
            default: null,
            validator: (v) => ['sm', 'lg'].includes(v)
        }
    }
};

function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_d_progress_bar = resolveComponent("d-progress-bar");

  return (openBlock(), createElementBlock("div", {
    class: normalizeClass(['progress', $props.size ? `progress-${$props.size}` : '']),
    style: normalizeStyle({ height: $props.height || null })
  }, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      createVNode(_component_d_progress_bar, normalizeProps(guardReactiveProps(_ctx.$props)), null, 16 /* FULL_PROPS */)
    ])
  ], 6 /* CLASS, STYLE */))
}

var css_248z$4 = "\n    /* Hide labels for small progress bars */\n.progress-sm span {\n        color: transparent;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2dyZXNzLnZ1ZSUzRnZ1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9OWFiN2NlZTImbGFuZy5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtJQUNJLHdDQUF3QztBQUM1QztRQUNRLGtCQUFrQjtBQUMxQiIsImZpbGUiOiJQcm9ncmVzcy52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD05YWI3Y2VlMiZsYW5nLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxuICAgIC8qIEhpZGUgbGFiZWxzIGZvciBzbWFsbCBwcm9ncmVzcyBiYXJzICovXG4ucHJvZ3Jlc3Mtc20gc3BhbiB7XG4gICAgICAgIGNvbG9yOiB0cmFuc3BhcmVudDtcbn1cbiJdfQ== */";
styleInject(css_248z$4);

script$6.render = render$6;
script$6.__file = "src/components/progress/Progress.vue";

var script$5 = {
    name: 'd-progress-bar',
    props: {
        /**
         * The value.
         */
        value: {
            type: Number,
            default: 0
        },
        /**
         * The label.
         */
        label: {
            type: String,
            value: null
        },
        /**
         * The max value.
         */
        max: {
            type: Number,
            default: null
        },
        /**
         * Precision number of digits.
         */
        precision: {
            type: Number,
            default: null
        },
        /**
         * Theme color.
         */
        theme: {
            type: String,
            default: null
        },
        /**
         * Whether it should be striped, or not.
         */
        striped: {
            type: Boolean,
            default: null
        },
        /**
         * Whether it should be animated, or not.
         */
        animated: {
            type: Boolean,
            default: null
        },
        /**
         * Whether it should show the progress, or not.
         */
        showProgress: {
            type: Boolean,
            default: null
        },
        /**
         * Whether it should show the value, or not.
         */
        showValue: {
            type: Boolean,
            default: null
        }
    },
    computed: {
        computedTheme() {
            return this.theme || this.$parent.theme
        },
        computedStriped() {
            return typeof this.striped === 'boolean' ? this.striped : (this.$parent.striped || false)
        },
        computedAnimated() {
            return typeof this.animated === 'boolean' ? this.animated : (this.$parent.animated || false)
        },
        computedMax() {
            return typeof this.max === 'number' ? this.max : (this.$parent.max || 100)
        },
        computedPrecision() {
            return typeof this.precision === 'number' ? this.precision : (this.$parent.precision || 0)
        },
        computedShowProgress() {
            return typeof this.showProgress === 'boolean' ? this.showProgress : (this.$parent.showProgress || false)
        },
        computedShowValue() {
            return typeof this.showValue === 'boolean' ? this.showValue : (this.$parent.showValue || false)
        },
        computedProgress() {
            const p = Math.pow(10, this.computedPrecision);
            return Math.round((100 * p * this.value) / this.computedMax) / p
        }
    }
};

const _hoisted_1$4 = ["aria-valuemax", "aria-valuenow"];
const _hoisted_2$2 = ["innerHTML"];
const _hoisted_3 = { key: 1 };
const _hoisted_4 = { key: 2 };

function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", {
    class: normalizeClass([
        'progress-bar',
        $options.computedTheme ? `bg-${$options.computedTheme}` : '',
        ($options.computedStriped || $options.computedAnimated) ? 'progress-bar-striped' : '',
        $options.computedAnimated ? 'progress-bar-animated' : ''
    ]),
    style: normalizeStyle({ width: (100 * ($props.value / $options.computedMax)) + '%' }),
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": $options.computedMax.toString(),
    "aria-valuenow": $props.value.toFixed($options.computedPrecision)
  }, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      ($props.label)
        ? (openBlock(), createElementBlock("span", {
            key: 0,
            innerHTML: $props.label
          }, null, 8 /* PROPS */, _hoisted_2$2))
        : createCommentVNode("v-if", true),
      ($options.computedShowProgress)
        ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString($options.computedProgress.toFixed($options.computedPrecision)), 1 /* TEXT */))
        : createCommentVNode("v-if", true),
      ($options.computedShowValue)
        ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString($props.value.toFixed($options.computedPrecision)), 1 /* TEXT */))
        : createCommentVNode("v-if", true)
    ])
  ], 14 /* CLASS, STYLE, PROPS */, _hoisted_1$4))
}

var css_248z$3 = "\n.progress-bar[data-v-b8297098] {\n    height: 100%;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2dyZXNzQmFyLnZ1ZSUzRnZ1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9YjgyOTcwOTgmc2NvcGVkPXRydWUmbGFuZy5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBO0lBQ0ksWUFBWTtBQUNoQiIsImZpbGUiOiJQcm9ncmVzc0Jhci52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD1iODI5NzA5OCZzY29wZWQ9dHJ1ZSZsYW5nLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLnByb2dyZXNzLWJhcltkYXRhLXYtYjgyOTcwOThdIHtcbiAgICBoZWlnaHQ6IDEwMCU7XG59XG4iXX0= */";
styleInject(css_248z$3);

script$5.render = render$5;
script$5.__scopeId = "data-v-b8297098";
script$5.__file = "src/components/progress/ProgressBar.vue";

const components$4 = {
    dProgress: script$6,
    dProgressBar: script$5
};

const VuePlugin$6 = {
  install (Vue) {
    registerComponents(Vue, components$4);
  }
};

var script$4 = {
    name: 'd-slider',
    emits: ['update:modelValue', 'input'],
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * Options config.
         */
        options: {
            type: Object,
            default() {
                return {}
            }
        },
        /**
         * Slider value.
         */
        modelValue: {
            type: [String, Array, Number],
            default: undefined
        },
        value: {
            type: [String, Array, Number],
            default: undefined
        },
        /**
         * Start value.
         */
        start: {
            type: [Number, Array],
            default: 0
        },
        /**
         * Range configuration.
         */
        range: {
            type: Object,
            default() {
                return { min: 0, max: 100 }
            }
        },
        /**
         * Connect configuration.
         */
        connect: {
            type: [Boolean, Array],
            default() {
                return [true, false]
            }
        }
    },
    watch: {
        computedValue(newVal, oldVal) {
            const sliderInstance = this.$el.noUiSlider;
            const sliderValue = sliderInstance.get();

            if (newVal !== oldVal && sliderValue !== newVal) {
                if (Array.isArray(sliderValue) && Array.isArray(newVal)) {
                    if (
                        oldVal.length === newVal.length &&
                        oldVal.every((v, i) => v === newVal[i] )
                    ) {
                        sliderInstance.set(newVal);
                    }
                } else {
                    sliderInstance.set(newVal);
                }
            }
        }
    },
    computed: {
        computedValue() {
            return this.modelValue !== undefined ? this.modelValue : this.value
        },
        computedID() {
            return this.id || `dr-slider-${guid()}`
        }
    },
    mounted() {
        const config = {
            start: this.computedValue || this.start,
            connect: this.connect,
            range: this.range,
            ...this.options
        };

        noUiSlider.create(this.$el, config);

        this.$el.noUiSlider.on('slide', () => {
            const value = this.$el.noUiSlider.get();
            if (value !== this.computedValue) {
                this.$emit('update:modelValue', value);
                this.$emit('input', value);
            }
        });
    }
};

const _hoisted_1$3 = ["id"];

function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", {
    class: "shards-custom-slider",
    ref: "slider",
    id: $options.computedID
  }, null, 8 /* PROPS */, _hoisted_1$3))
}

script$4.render = render$4;
script$4.__file = "src/components/slider/Slider.vue";

const components$3 = {
    dSlider: script$4
};

const VuePlugin$5 = {
  install (Vue) {
    registerComponents(Vue, components$3);
  }
};

var script$3 = {
    name: 'd-tab-button',
    emits: ['click'],
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The active state.
         */
        active: {
            type: Boolean,
            default: false
        },
        /**
         * The disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * The link class.
         */
        linkClass: {
            type: String,
            default: null
        },
        /**
         * The item class.
         */
        itemClass: {
            type: String,
            default: null
        },
        /**
         * The aria-setsize value.
         */
        setSize: {
            type: Number,
            default: 0,
        },
        /**
         * The position in set value (aria-posinset).
         */
        posInSet: {
            type: Number,
            default: 0,
        },
        /**
         * The aria-controls value.
         */
        controls: {
            type: String,
            default: null
        },
        /**
         * The content.
         */
        content: {
            type: String,
            default: null
        }
    },
    methods: {
        handleClick(e) {
            if (this.disabled) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (e.type === 'click'
                || e.keyCode === KEYCODES.ENTER
                || e.keyCode === KEYCODES.SPACE) {
                e.preventDefault();
                e.stopPropagation();
                this.$emit('click', e);
            }
        }
    },
    computed: {
        computedID() {
            return this.id || `d-tab-btn-${guid()}`
        }
    }
};

const _hoisted_1$2 = ["id", "disabled", "aria-selected", "aria-setsize", "aria-posinset", "aria-controls", "innerHTML"];

function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("li", {
    class: normalizeClass(['nav-item', $props.itemClass]),
    role: "presentation"
  }, [
    createElementVNode("a", {
      class: normalizeClass([
            'nav-link',
            $props.active ? 'active' : '',
            $props.disabled ? 'disabled' : '',
            $props.linkClass
        ]),
      role: "tab",
      tabindex: "-1",
      id: $options.computedID,
      disabled: $props.disabled,
      "aria-selected": $props.active ? 'true' : 'false',
      "aria-setsize": $props.setSize,
      "aria-posinset": $props.posInSet,
      "aria-controls": $props.controls,
      innerHTML: $props.content,
      onClick: _cache[0] || (_cache[0] = (...args) => ($options.handleClick && $options.handleClick(...args))),
      onKeydown: _cache[1] || (_cache[1] = (...args) => ($options.handleClick && $options.handleClick(...args)))
    }, null, 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_1$2)
  ], 2 /* CLASS */))
}

var css_248z$2 = "\n.nav-link.active[data-v-d09c6b4e] {\n    border-bottom: 1px solid transparent;\n}\n.nav-link[data-v-d09c6b4e]:hover {\n    cursor: pointer;\n}\n.nav-link.disabled[data-v-d09c6b4e]:hover {\n    cursor: not-allowed;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9UYWJCdXR0b24udnVlJTNGdnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD1kMDljNmI0ZSZzY29wZWQ9dHJ1ZSZsYW5nLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7SUFDSSxvQ0FBb0M7QUFDeEM7QUFDQTtJQUNJLGVBQWU7QUFDbkI7QUFDQTtJQUNJLG1CQUFtQjtBQUN2QiIsImZpbGUiOiJfVGFiQnV0dG9uLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPWQwOWM2YjRlJnNjb3BlZD10cnVlJmxhbmcuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXG4ubmF2LWxpbmsuYWN0aXZlW2RhdGEtdi1kMDljNmI0ZV0ge1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbn1cbi5uYXYtbGlua1tkYXRhLXYtZDA5YzZiNGVdOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG59XG4ubmF2LWxpbmsuZGlzYWJsZWRbZGF0YS12LWQwOWM2YjRlXTpob3ZlciB7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbn1cbiJdfQ== */";
styleInject(css_248z$2);

script$3.render = render$3;
script$3.__scopeId = "data-v-d09c6b4e";
script$3.__file = "src/components/tabs/_TabButton.vue";

var script$2 = {
    name: 'd-tabs',
    emits: ['update:modelValue', 'input'],
    components: {
        dTabButton: script$3
    },
    provide() {
        return {
            dTabs: {
                parent: this,
                registerTab: tab => this.registerTab(tab),
                unregisterTab: tab => this.unregisterTab(tab)
            }
        }
    },
    data() {
        return {
            currentTab: this.modelValue !== undefined ? this.modelValue : this.value,
            tabs: [],
            // eslint-disable-next-line
            _tabsContainerID: null
        }
    },
    watch: {
        currentTab (newVal, oldVal) {
            if (newVal === oldVal) {
                return
            }

            this.$emit('update:modelValue', newVal);
            this.$emit('input', newVal);
            if (this.tabs[newVal]) {
                this.tabs[newVal].$emit('click');
            }
        },
        computedValue (newVal, oldVal) {
            if (newVal === oldVal) {
                return
            }

            if (typeof oldVal !== 'number') {
                oldVal = 0;
            }

            const direction = newVal < oldVal ? -1 : 1;
            this.setTab(newVal, false, direction);
        }
    },
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * Whether it should be displayed as a card, or not.
         */
        card: {
            type: Boolean,
            default: false
        },
        /**
         * The value used to set the current tab.
         */
        modelValue: {
            type: Number,
            default: undefined
        },
        value: {
            type: Number,
            default: null
        },
        /**
         * Whether the tab controls should be displayed as pills, or not.
         */
        pills: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the tab controls should be displayed vertically, or not.
         */
        vertical: {
            type: Boolean,
            default: false
        },
        /**
         * The content class.
         */
        contentClass: {
            type: String,
            default: null
        },
        /**
         * The nav class.
         */
        navClass: {
            type: String,
            default: null
        },
        /**
         * The nav wrapper class.
         */
        navWrapperClass: {
            type: String,
            default: null
        }
    },
    computed: {
        computedValue() {
            return this.modelValue !== undefined ? this.modelValue : this.value
        },
        computedID() {
            return this.id || `dr-tabs-${guid()}`
        },
        computedTabControlsID() {
            return `dr-tab-controls-${guid()}`
        },
        computedTabButtonID() {
            return `dr-tabs-tab-${guid()}`
        },
        navStyle() {
            return this.pills ? 'pills' : 'tabs'
        },
        computedTabsClasses() {
            return [
                'tabs',
                this.vertical ? 'row' : '',
                (this.vertical && this.card) ? 'no-gutters' : '',
            ]
        },
        computedNavListClasses() {
            return [
                'nav',
                `nav-${this.navStyle}`,
                (this.card && !this.vertical) ? `card-header-${this.navStyle}` : '',
                (this.card && this.vertical) ? 'card-header' : '',
                (this.card && this.vertical) ? 'h-100' : '',
                this.vertical ? 'flex-column' : '',
                this.vertical ? 'border-bottom-0' : '',
                this.vertical ? 'rounded-0' : '',
                this.vertical ? 'd-tabs-vertical-nav' : '',
                this.navClass
            ]
        },
        computedNavListWrapperClasses() {
            return [
                this.card && !this.vertical ? 'card-header' : '',
                this.vertical ? 'col-auto' : '',
                this.navWrapperClass
            ]
        },
        computedTabsContainerClasses() {
            return [
                'tab-content',
                this.vertical ? 'col' : '',
                this.contentClass
            ]
        }
    },
    created() {
        this._tabsContainerID = `tabs-container-${guid()}`;
    },
    methods: {
        handleOnKeynav(e) {
            if (Object.keys(KEYCODES).some((k) => KEYCODES[k] === e.keyCode)) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (e.keyCode === KEYCODES.UP || e.keyCode === KEYCODES.LEFT ) {
                this.previousTab();
            }

            if (e.keyCode === KEYCODES.DOWN || e.keyCode === KEYCODES.RIGHT) {
                this.nextTab();
            }
        },
        nextTab() {
            this.setTab(this.currentTab + 1, false, 1);
        },
        previousTab() {
            this.setTab(this.currentTab - 1, false, -1);
        },
        setTab(index, force, direction) {
            direction = direction || 0;
            index = index || 0;

            direction = direction === 0 ? 0 : (direction > 0 ? 1 : -1);

            if (!force && index === this.currentTab) {
                return
            }

            const tab = this.tabs[index];

            if (!tab) {
                this.$emit('update:modelValue', this.currentTab);
                this.$emit('input', this.currentTab);
                return
            }

            if (tab.disabled) {
                if (direction) {
                    this.setTab(index + direction, force, direction);
                }

                return
            }

            this.tabs.forEach(_tab => {
                if (_tab === tab) {
                    _tab.localActiveState = true;
                    return
                }

                _tab.localActiveState = false;
            });

            this.currentTab = index;
        },
        registerTab(tab) {
            if (this.tabs.indexOf(tab) === -1) {
                this.tabs.push(tab);
            }

            this.$nextTick(this.updateTabs);
        },
        unregisterTab(tab) {
            const index = this.tabs.indexOf(tab);

            if (index !== -1) {
                this.tabs.splice(index, 1);
            }

            this.$nextTick(this.updateTabs);
        },
        updateTabs() {
            let tabIndex = null;

            this.tabs.forEach((tab, index) => {
                if (tab.localActiveState && !tab.disabled) {
                    tabIndex = index;
                }
            });

            if (tabIndex === null) {
                if (this.currentTab >= this.tabs.length) {
                    this.setTab(this.tabs.length - 1, true, -1);
                    return
                }

                if (this.tabs[this.currentTab] && !this.tabs[this.currentTab].disabled) {
                    tabIndex = this.currentTab;
                }

                this.tabs.forEach((tab, index) => {
                    if (!tab.disabled && tabIndex === null) {
                        tabIndex = index;
                    }
                });
            }

            this.setTab(tabIndex || 0, true, 0);
        }
    },
    mounted() {
        this.updateTabs();
    }
};

const _hoisted_1$1 = ["id"];
const _hoisted_2$1 = ["id"];

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_d_tab_button = resolveComponent("d-tab-button");

  return (openBlock(), createBlock(resolveDynamicComponent($props.tag), {
    id: $options.computedID,
    class: normalizeClass($options.computedTabsClasses)
  }, {
    default: withCtx(() => [
      createElementVNode("div", {
        class: normalizeClass($options.computedNavListWrapperClasses)
      }, [
        createElementVNode("ul", {
          class: normalizeClass($options.computedNavListClasses),
          role: "tablist",
          tabindex: "0",
          id: $options.computedTabControlsID,
          onKeydown: _cache[0] || (_cache[0] = (...args) => ($options.handleOnKeynav && $options.handleOnKeynav(...args)))
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($data.tabs, (tab, index) => {
            return (openBlock(), createBlock(_component_d_tab_button, {
              key: index,
              content: tab.headHtml || tab.title,
              href: tab.href,
              id: $options.computedTabButtonID,
              active: tab.localActiveState,
              disabled: tab.disabled,
              setSize: $data.tabs.length,
              posInSet: index + 1,
              controls: $data._tabsContainerID,
              linkClass: tab.titleLinkClass,
              itemClass: tab.titleItemClass,
              onClick: $event => ($options.setTab(index))
            }, null, 8 /* PROPS */, ["content", "href", "id", "active", "disabled", "setSize", "posInSet", "controls", "linkClass", "itemClass", "onClick"]))
          }), 128 /* KEYED_FRAGMENT */)),
          renderSlot(_ctx.$slots, "tabs")
        ], 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_1$1)
      ], 2 /* CLASS */),
      createElementVNode("div", {
        ref: "tabsContainer",
        class: normalizeClass($options.computedTabsContainerClasses),
        id: $data._tabsContainerID
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 10 /* CLASS, PROPS */, _hoisted_2$1)
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["id", "class"]))
}

var css_248z$1 = "\n.d-tabs-vertical-nav[data-v-663bac2f]:hover {\n    background: rgba(90, 97, 105, 0.06);\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYnMudnVlJTNGdnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD02NjNiYWMyZiZzY29wZWQ9dHJ1ZSZsYW5nLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7SUFDSSxtQ0FBbUM7QUFDdkMiLCJmaWxlIjoiVGFicy52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD02NjNiYWMyZiZzY29wZWQ9dHJ1ZSZsYW5nLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLmQtdGFicy12ZXJ0aWNhbC1uYXZbZGF0YS12LTY2M2JhYzJmXTpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogcmdiYSg5MCwgOTcsIDEwNSwgMC4wNik7XG59XG4iXX0= */";
styleInject(css_248z$1);

script$2.render = render$2;
script$2.__scopeId = "data-v-663bac2f";
script$2.__file = "src/components/tabs/Tabs.vue";

var script$1 = {
    name: 'd-tab',
    emits: ['click'],
    inject: {
        dTabs: {
            default: null
        }
    },
    data() {
        return {
            localActiveState: this.active && !this.disabled,
            show: false
        }
    },
    props: {
        /**
         * The element ID.
         */
        id: {
            type: String,
            default: null
        },
        /**
         * The active state.
         */
        active: {
            type: Boolean,
            default: false
        },
        /**
         * The element tag.
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * The button ID.
         */
        buttonId: {
            type: String,
            default: ''
        },
        /**
         * The title.
         */
        title: {
            type: String,
            default: ''
        },
        /**
         * The disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Whether the card should display the body, or not.
         */
        noBody: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedID() {
            return this.id || `dr-tab-${guid()}`
        },
        controlledBy() {
            return this.buttonId || `dr-tab-button-${guid()}`
        },
        computedFade() {
            return this.tabsParent && this.tabsParent.fade
        },
        _isTab() {
            return true
        },
        tabsParent() {
            return this.dTabs && this.dTabs.parent
        }
    },
    methods: {
        handleBeforeEnter() {
            this.show = false;
        },
        handleAfterEnter() {
            this.show = true;
        },
        handleAfterLeave() {
            this.show = false;
        }
    },
    mounted() {
        this.show = this.localActiveState;
        if (this.dTabs) {
            this.dTabs.registerTab(this);
        }
    },
    beforeUnmount() {
        if (this.dTabs) {
            this.dTabs.unregisterTab(this);
        }
    }
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(Transition, {
    mode: "out-in",
    name: "fade",
    onBeforeEnter: $options.handleBeforeEnter,
    onAfterEnter: $options.handleAfterEnter,
    onAfterLeave: $options.handleAfterLeave,
    persisted: ""
  }, {
    default: withCtx(() => [
      withDirectives((openBlock(), createBlock(resolveDynamicComponent($props.tag), {
        ref: "panel",
        role: "tabpanel",
        id: $options.computedID,
        "aria-hidden": $data.localActiveState ? 'false' : 'true',
        "aria-expanded": $data.localActiveState ? 'true' : 'false',
        "aria-labelledby": $options.controlledBy || null,
        class: normalizeClass([
                'tab-pane',
                ($options.tabsParent && $options.tabsParent.card && !$props.noBody) ? 'card-body' : '',
                $data.show ? 'show' : '',
                $props.disabled ? 'disabled' : '',
                $data.localActiveState ? 'active' : ''
            ])
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3 /* FORWARDED */
      }, 8 /* PROPS */, ["id", "aria-hidden", "aria-expanded", "aria-labelledby", "class"])), [
        [vShow, $data.localActiveState]
      ])
    ]),
    _: 3 /* FORWARDED */
  }, 8 /* PROPS */, ["onBeforeEnter", "onAfterEnter", "onAfterLeave"]))
}

var css_248z = "\n.fade-enter-active[data-v-3cfc6374] {\n  transition: opacity .25s ease-in-out;\n}\n.fade-leave-active[data-v-3cfc6374] {\n  transition: opacity .25s cubic-bezier(1.0, 0.5, 0.8, 1.0);\n}\n.fade-enter[data-v-3cfc6374],\n.fade-leave-to[data-v-3cfc6374] {\n  opacity: 0;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYi52dWUlM0Z2dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPTNjZmM2Mzc0JnNjb3BlZD10cnVlJmxhbmcuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTtFQUNFLG9DQUFvQztBQUN0QztBQUNBO0VBQ0UseURBQXlEO0FBQzNEO0FBQ0E7O0VBRUUsVUFBVTtBQUNaIiwiZmlsZSI6IlRhYi52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD0zY2ZjNjM3NCZzY29wZWQ9dHJ1ZSZsYW5nLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLmZhZGUtZW50ZXItYWN0aXZlW2RhdGEtdi0zY2ZjNjM3NF0ge1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4yNXMgZWFzZS1pbi1vdXQ7XG59XG4uZmFkZS1sZWF2ZS1hY3RpdmVbZGF0YS12LTNjZmM2Mzc0XSB7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgLjI1cyBjdWJpYy1iZXppZXIoMS4wLCAwLjUsIDAuOCwgMS4wKTtcbn1cbi5mYWRlLWVudGVyW2RhdGEtdi0zY2ZjNjM3NF0sXG4uZmFkZS1sZWF2ZS10b1tkYXRhLXYtM2NmYzYzNzRdIHtcbiAgb3BhY2l0eTogMDtcbn1cbiJdfQ== */";
styleInject(css_248z);

script$1.render = render$1;
script$1.__scopeId = "data-v-3cfc6374";
script$1.__file = "src/components/tabs/Tab.vue";

const components$2 = {
    dTabs: script$2,
    dTab: script$1
};

const VuePlugin$4 = {
  install (Vue) {
    registerComponents(Vue, components$2);
  }
};

const TooltipDefaults = {
    template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
};

const Defaults = { ...TPManager.Defaults, ...TooltipDefaults };

class Tooltip extends TPManager {

    static get Name() {
        return 'tooltip'
    }

    static get Defaults() {
        return Defaults
    }

    static get ClassPrefix() {
        return 'bs-tooltip'
    }

    /*--------------------------------------------------------------------------
    /* OVERRIDES
    /*--------------------------------------------------------------------------*/

    /**
     * Checks whether the Tooltip has any content.
     */
    hasContent(TPElement) {
        const Tooltip = TPElement || this._TPElement;

        if (!Tooltip) {
            return false
        }

        const tooltipInnerEl = selectElement(TOOLTIP_SELECTORS.TOOLTIP_INNER, Tooltip);

        return Boolean((tooltipInnerEl || {}).innerHTML)
    }

    /**
     * Sets the Tooltip content.
     */
    setContent(TPElement) {
        const Tooltip = TPElement || this._TPElement;

        if (!Tooltip) {
            return false
        }

        const tooltipInnerEl = selectElement(TOOLTIP_SELECTORS.TOOLTIP_INNER, Tooltip);
        this.setElementContent(tooltipInnerEl, this.getTitle());

        removeClasses(Tooltip, [TP_STATE_CLASSES.FADE, TP_STATE_CLASSES.SHOW]);
    }
}

var script = {
    name: 'd-tooltip',
    mixins: [ TooltipPopoverMixin ],
    emits: ['show', 'shown', 'hide', 'hidden', 'update:show', 'update:disabled', 'enabled', 'disabled'],
    props: {
        /**
         * Title.
         */
        title: {
            type: String,
            default: ''
        },
        /**
         * Triggers.
         */
        triggers: {
            type: [String, Array],
            default: 'hover focus'
        },
        /**
         * Placement.
         */
        placement: {
            type: String,
            default: 'top',
            validator: val => Object.keys(TP_PLACEMENTS).map(p => p.toLowerCase()).includes(val)
        },
        /**
         * The target element.
         */
        target: {
            type: [String, Object, Function]
        },
        /**
         * Delay in miliseconds.
         */
        delay: {
            type: [Number, Object, String],
            default: 0
        },
        /**
         * Offset.
         */
        offset: {
            type: [Number, String]
        },
        /**
         * Disable animations.
         */
        noFade: {
            type: Boolean,
            default: false
        },
        /**
         * Wrapping container.
         */
        container: {
            type: String,
            default: null
        },
        /**
         * Instance boundaries.
         */
        boundary: {
            type: [String, Object],
            default: 'scrollParent'
        },
        /**
         * Show state.
         */
        show: {
            type: Boolean,
            default: false
        },
        /**
         * Disabled state.
         */
        disabled: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        /**
         * Gets the target and if the target exists, it initializes the Tooltip.
         * Used inside the TooltipPopoverMixin
         */
        bootstrap() {
            const target = this.getTarget();

            if (target) {
                this._TPInstance = new Tooltip(
                    target,
                    this.getUpdatedConfig(),
                    getEventBus(this)
                );
            }

            return this._TPInstance
        }
    }
};

const _hoisted_1 = {
  class: "d-none",
  style: {"display":"none"},
  "aria-hiden": "true"
};
const _hoisted_2 = { ref: "title" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", _hoisted_1, [
    createElementVNode("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "default")
    ], 512 /* NEED_PATCH */)
  ]))
}

script.render = render;
script.__file = "src/components/tooltip/Tooltip.vue";

const components$1 = {
    dTooltip: script
};

const VuePlugin$3 = {
  install (Vue) {
    registerComponents(Vue, components$1);
  }
};

var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Alert: VuePlugin$w,
    Badge: VuePlugin$v,
    Breadcrumb: VuePlugin$u,
    Button: VuePlugin$t,
    ButtonGroup: VuePlugin$s,
    ButtonToolbar: VuePlugin$r,
    Card: VuePlugin$q,
    Collapse: VuePlugin$p,
    Datepicker: VuePlugin$n,
    Dropdown: VuePlugin$m,
    Embed: VuePlugin$l,
    Form: VuePlugin$k,
    FormCheckbox: VuePlugin$j,
    FormInput: VuePlugin$i,
    FormRadio: VuePlugin$h,
    FormSelect: VuePlugin$g,
    FormTextarea: VuePlugin$f,
    Image: VuePlugin$e,
    InputGroup: VuePlugin$d,
    Layout: VuePlugin$o,
    Link: VuePlugin$c,
    ListGroup: VuePlugin$b,
    Modal: VuePlugin$a,
    Nav: VuePlugin$9,
    Navbar: VuePlugin$8,
    Popover: VuePlugin$7,
    Progress: VuePlugin$6,
    Slider: VuePlugin$5,
    Tabs: VuePlugin$4,
    Tooltip: VuePlugin$3
});

const allListenTypes = {
    hover: true,
    click: true,
    focus: true
};

const BEL_KEY = '__DR_BOUND_EVENT_LISTENERS__';

const getElement = el => el && (el.elm || el.el || el);

const bindTargets = (el, binding, listenTypes, callback) => {
    const element = getElement(el);

    if (!element) {
        return []
    }

    const targets = Object.keys(binding.modifiers || {}).filter(t => !allListenTypes[t]);

    if (binding.value) {
        targets.push(binding.value);
    }

    const listener = () => {
        callback({ targets, el: element, binding });
    };

    Object.keys(allListenTypes).forEach(type => {
        if (listenTypes[type] || binding.modifiers[type]) {
            element.addEventListener(type, listener);
            const boundListeners = element[BEL_KEY] || {};
            boundListeners[type] = boundListeners[type] || [];
            boundListeners[type].push(listener);
            element[BEL_KEY] = boundListeners;
        }
    });

    return targets
};

const unbindTargets = (el, binding, listenTypes) => {
    const element = getElement(el);

    if (!element) {
        return
    }

    Object.keys(allListenTypes).forEach(type => {
        if (listenTypes[type] || binding.modifiers[type]) {
            const boundListeners = element[BEL_KEY] && element[BEL_KEY][type];
            if (boundListeners) {
                boundListeners.forEach(listener => element.removeEventListener(type, listener));
                delete element[BEL_KEY][type];
            }
        }
    });
};

const inBrowser$1 = typeof window !== 'undefined';
const DR_TOGGLE = '__DRTOGGLE';

var dToggle = {
    beforeMount(element, binding) {
        const bus = getEventBus(binding.instance);
        const targets = bindTargets(element, binding, { click: true }, ({ targets }) => {
            targets.forEach(target => bus.$emit(COLLAPSE_EVENTS.TOGGLE, target));
        });

        if (inBrowser$1 && targets.length > 0) {
            setAttr(element, 'aria-controls', targets.join(' '));
            setAttr(element, 'aria-expanded', 'false');

            if (element.tagName !== 'BUTTON') {
                setAttr(element, 'role', 'button');
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
            };
            bus.$on(COLLAPSE_EVENTS.STATE, element[DR_TOGGLE]);
        }
    },
    unmounted(element, binding) {
        unbindTargets(element, binding, { click: true });

        if (!element[DR_TOGGLE]) {
            return
        }

        getEventBus(binding.instance).$off(COLLAPSE_EVENTS.STATE, element[DR_TOGGLE]);
        element[DR_TOGGLE] = null;
    }
};

const directives$2 = {
  dToggle
};

const VuePlugin$2 = {
  install (Vue) {
    registerDirectives(Vue, directives$2);
  }
};

const inBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
const KEY = '_DR_TOOLTIP_';
const validTriggers = {
    'focus': true,
    'hover': true,
    'click': true,
    'blur': true
};

/**
 * Bindings parser.
 */
function parseBindings(bindings) {
    let config = {};

    switch (typeof bindings.value) {
        case 'string':
        case 'function':
            config.title = bindings.value;
            break
        case 'object':
            config = { ...bindings.value };
    }

    // Parse args (eg: v-d-tooltip:my-container)
    if (bindings.arg) {
        config.container = `#${bindings.arg}`; // #my-container
    }

    // Parse modifiers. eg: v-d-tooltip.my-modifier
    Object.keys(bindings.modifiers).forEach(mod => {
        // Parse if the title allows HTML
        if (/^html$/.test(mod)) {
            config.html = true;

        // Parse animation
        } else if (/^nofade$/.test(mod)) {
            config.animation = false;

        // Parse placement
        } else if (/^(auto|top(left|right)?|bottom(left|right)?|left(top|bottom)?|right(top|bottom)?)$/.test(mod)) {
            config.placement = mod;

        // Parse boundary
        } else if (/^(window|viewport)$/.test(mod)) {
            config.boundary = mod;

        // Parse delay
        } else if (/^d\d+$/.test(mod)) {
            const delay = parseInt(mod.slice(1), 10) || 0;
            if (delay) {
                config.delay = delay;
            }

        // Parse offset
        }  else if (/^o-?\d+$/.test(mod)) {
            const offset = parseInt(mod.slice(1), 10) || 0;
            if (offset) {
                config.offset = offset;
            }
        }
    });

    // Parse selected triggers.
    const selectedTriggers = {};
    let triggers = typeof config.trigger === 'string' ? config.trigger.trim().split(/\s+/) : [];

    triggers.forEach(trigger => {
        if (validTriggers[trigger]) {
            selectedTriggers[trigger] = true;
        }
    });

    // Parse trigger modifiers. eg: v-d-tooltip.click
    Object.keys(validTriggers).forEach(trigger => {
        if (bindings.modifiers[trigger]) {
            selectedTriggers[trigger] = true;
        }
    });

    config.trigger = Object.keys(selectedTriggers).join(' ');

    // Convert `blur` to `focus`
    if (config.trigger === 'blur') {
        config.trigger = 'focus';
    }

    // If there's no trigger assigned, just delete the key.
    if (!config.trigger) {
        delete config.trigger;
    }

    return config
}

function applyTooltip(el, bindings, vnode) {
    if (!inBrowser) {
        return
    }

    const parsedBindings = parseBindings(bindings);

    if (!el[KEY]) {
        el[KEY] = new Tooltip(el, parsedBindings, getEventBus(bindings.instance));
        return
    }

    el[KEY].updateConfig(parsedBindings);
}

var dTooltip = {
    beforeMount (el, bindings, vnode) {
        applyTooltip(el, bindings);
    },

    mounted(el, bindings, vnode) {
        applyTooltip(el, bindings);
    },

    updated (el, bindings, vnode) {
        if (bindings.value !== bindings.oldValue) {
            applyTooltip(el, bindings);
        }
    },

    unmounted (el) {
        if (!inBrowser) {
            return
        }

        if (el[KEY]) {
            el[KEY].destroy();
            el[KEY] = null;
            delete el[KEY];
        }
    }
};

const directives$1 = {
  dTooltip
};

const VuePlugin$1 = {
  install (Vue) {
    registerDirectives(Vue, directives$1);
  }
};

var directives = /*#__PURE__*/Object.freeze({
    __proto__: null,
    dToggle: VuePlugin$2,
    dTooltip: VuePlugin$1
});

const VuePlugin = {
  install: function (app) {
    if (app._shards_vue_installed) {
      return
    }

    app._shards_vue_installed = true;
    installEventBus(app);

    // Register component plugins
    for (let component in components) {
      app.use(components[component]);
    }

    // Register directive plugins
    for (let directive in directives) {
      app.use(directives[directive]);
    }
  }
};

export { VuePlugin as default };
//# sourceMappingURL=shards-vue.esm.js.map
