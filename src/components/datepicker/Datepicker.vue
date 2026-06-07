<template>
    <VueDatePicker
        :model-value="computedValue"
        :formats="computedFormats"
        :locale="computedLocale"
        :start-date="openDate"
        :disabled-dates="computedDisabledDates"
        :highlight="computedHighlight"
        :placeholder="placeholder"
        :inline="inline"
        :input-attrs="computedInputAttrs"
        :ui="computedUi"
        :class="computedWrapperClass"
        :week-start="mondayFirst ? 1 : undefined"
        :auto-apply="true"
        :enable-time-picker="false"
        :time-config="{ enableTimePicker: false }"
        :disabled="disabled"
        :text-input="typeable"
        v-bind="$attrs"
        @update:model-value="handleUpdate" />
</template>

<script>
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// Validator function that checks the date props.
const _datePropValidator = (v) => {
    return v === null
            || v instanceof Date
            || typeof v === 'string'
            || typeof v === 'number'
}

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
}

const _mergeClasses = (...values) => {
    return [...new Set(values.flatMap(_normalizeClass))]
}

const _normalizeDate = (value) => {
    if (value === null || typeof value === 'undefined') {
        return null
    }

    const date = value instanceof Date ? value : new Date(value)

    return Number.isNaN(date.getTime()) ? null : date
}

const _isSameDay = (left, right) => {
    return left.getFullYear() === right.getFullYear()
            && left.getMonth() === right.getMonth()
            && left.getDate() === right.getDate()
}

const _isInRange = (value, range) => {
    const from = _normalizeDate(range && range.from)
    const to = _normalizeDate(range && range.to)

    return Boolean(from && to && value >= from && value <= to)
}

export default {
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

            const disabledDates = this.disabledDates
            const to = _normalizeDate(disabledDates.to)
            const from = _normalizeDate(disabledDates.from)
            const dates = Array.isArray(disabledDates.dates)
                ? disabledDates.dates.map(_normalizeDate).filter(Boolean)
                : []
            const ranges = Array.isArray(disabledDates.ranges) ? disabledDates.ranges : []

            return (date) => {
                const value = _normalizeDate(date)

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

            const highlighted = this.highlighted
            const from = _normalizeDate(highlighted.from)
            const to = _normalizeDate(highlighted.to)
            const dates = Array.isArray(highlighted.dates)
                ? highlighted.dates.map(_normalizeDate).filter(Boolean)
                : []

            const hasRange = Boolean(from && to)

            if (!hasRange && !dates.length && !highlighted.customPredictor) {
                return highlighted
            }

            return (date) => {
                const value = _normalizeDate(date)

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
            this.$emit('update:modelValue', value)
            this.$emit('input', value)
        }
    }
}
</script>

<style lang="scss">
    @use "sass:color";

    $white: #fff;
    $black: #000;

    $color-silver-sand: #c3c7cc;
    $color-primary: #007bff;
    $color-shuttle-gray: #5a6169;
    $color-porcelain: #eceeef;

    $border-color: transparent;
    $border-radius-default: .375rem;
    $transition-default: all 250ms cubic-bezier(.27,.01,.38,1.06);
    $font-system: -apple-system, BlinkMacSystemFont,  "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

    $datepicker-color: $color-shuttle-gray;
    $datepicker-min-width: 10rem;
    $datepicker-background-color: $white;
    $datepicker-border-radius: $border-radius-default;
    $datepicker-font-size: 1rem;
    $datepicker-padding-x: 22px;
    $datepicker-padding-y: 20px;
    $datepicker-font-weight: 300;
    $datepicker-border: 1px solid rgba($black,.05);
    $datepicker-drop-shadows: 0 0.5rem 4rem rgba($black,.11),
                            0 10px 20px rgba($black,.05),
                            0 2px 3px rgba($black,.06);

    $datepicker-cell-width: 36px;
    $datepicker-cell-height: 36px;
    $datepicker-cell-hover-color: $color-porcelain;
    $datepicker-cell-line-height: 2;
    $datepicker-cell-font-size: 1rem;

    $datepicker-small-padding-y: .625rem;
    $datepicker-small-padding-x: .625rem;
    $datepicker-small-font-size: .75rem;
    $datepicker-small-max-width: 235px;

    $datepicker-small-day-font-size: 12px;
    $datepicker-small-day-font-weight: 500;
    $datepicker-small-day-width: 1.875rem;
    $datepicker-small-day-height: 1.875rem;
    $datepicker-small-day-line-height: 2.25;

    $datepicker-small-day-header-font-size: 100%;

    div.vdp-datepicker {
        --dp-font-family: #{$font-system};
        --dp-font-size: #{$datepicker-font-size};
        --dp-border-radius: #{$datepicker-border-radius};
        --dp-cell-border-radius: #{$datepicker-border-radius};
        --dp-cell-size: #{$datepicker-cell-width};
        --dp-primary-color: #{$color-primary};
        --dp-primary-text-color: #{$white};
        --dp-background-color: #{$datepicker-background-color};
        --dp-text-color: #{$datepicker-color};
        --dp-hover-color: #{$datepicker-cell-hover-color};
        --dp-hover-text-color: #{$datepicker-color};
        --dp-hover-icon-color: #{$datepicker-color};
        --dp-icon-color: #{$color-silver-sand};
        --dp-border-color: rgba(0, 0, 0, .15);
        --dp-menu-border-color: rgba(0, 0, 0, .15);
        --dp-border-color-hover: #{$color-silver-sand};
        --dp-border-color-focus: #{$color-primary};
        --dp-highlight-color: #{$color-primary};
        --dp-range-between-dates-background-color: #{$color-primary};
        --dp-range-between-dates-text-color: #{$white};
        --dp-range-between-border-color: #{$color-primary};
        --dp-input-padding: .4375rem .75rem;
        --dp-input-icon-padding: 2.25rem;
        --dp-menu-padding: 0;
        --dp-menu-min-width: #{$datepicker-min-width};

        display: inline-block;
        width: 100%;

        .dp--input-wrap {
            width: 100%;
        }

        .vdp-datepicker__input.dp--input {
            background-color: $white;
        }

        &__calendar {
            color: $datepicker-color;
            padding: $datepicker-padding-y $datepicker-padding-x;
            min-width: $datepicker-min-width;
            font-size: $datepicker-font-size;
            font-weight: $datepicker-font-weight;
            font-family: $font-system;
            background-color: $datepicker-background-color;
            border: $datepicker-border;
            border-radius: $datepicker-border-radius;
            box-shadow: $datepicker-drop-shadows;
            border: 1px solid rgba($black,.15) !important;

            .dp--menu-inner {
                padding: 0;
            }

            .dp--month-year-row {
                padding-bottom: 10px;
            }

            .dp--calendar-header {
                font-weight: 500;
            }

            .dp--calendar-header-separator {
                display: none;
            }

            .dp--month-year-select-base,
            .dp--inner-nav,
            .dp--cell-inner {
                transition: $transition-default;
                border-radius: $border-radius-default;
            }

            .dp--inner-nav {
                color: $color-silver-sand;
            }

            .dp--month-year-select-base {
                font-weight: 500;
            }

            .dp--calendar-header-item,
            .dp--cell-inner {
                width: $datepicker-cell-width;
                height: $datepicker-cell-height;
                padding: 0;
                font-size: $datepicker-cell-font-size;
            }

            .dp--cell-inner {
                line-height: $datepicker-cell-line-height;
                border-color: $border-color;
            }

            .dp--calendar-row {
                margin: 0;
            }

            .dp--date-hoverable:hover,
            .dp--month-year-select-base:hover,
            .dp--inner-nav:hover {
                background-color: $datepicker-cell-hover-color;
                border-color: $border-color !important;
            }

            .dp--active,
            .dp--range-border-start,
            .dp--range-border-end,
            .dp--cell-highlight,
            .dp--cell-highlight-active {
                background: $color-primary !important;
                color: $white;
            }

            .dp--active:hover,
            .dp--cell-highlight:hover,
            .dp--cell-highlight-active:hover {
                background: color.adjust($color-primary, $lightness: -5%) !important;
                border-color: $border-color !important;
            }

            .dp--range-between {
                background: $color-primary;
                border-color: $color-primary;
                color: $white;
                border-radius: 0;
            }

            // Header
            header {
                display: flex;
                padding-bottom: 10px;

                span {
                    transition: $transition-default;
                    border-radius: $border-radius-default;
                    font-weight: 500;

                    &.next:after {
                        border-left-color: $color-silver-sand;
                    }

                    &.prev:after {
                        border-right-color: $color-silver-sand;
                    }
                }
            }

            // Header elements and specific calendar cells.
            header span,
            .cell.day:not(.disabled):not(.blank), .cell.month, .cell.year {
                &:hover {
                    background-color: $datepicker-cell-hover-color;
                    border-color: $border-color !important;
                }
            }

            // Cells
            .cell {
                line-height: $datepicker-cell-line-height;
                font-size: $datepicker-cell-font-size;
                border-radius: $border-radius-default;
                transition: $transition-default;
                border-color: $border-color;
                height: auto;

                // Day headers
                &.day-header {
                    font-weight: 500;
                }

                // Days
                &.day {
                    width: $datepicker-cell-width;
                    height: $datepicker-cell-height;
                    border-radius: 50%;
                }

                // Months
                &.month,
                &.year {
                    height: $datepicker-cell-height;
                    font-size: 12px;
                    line-height: 33px;
                }

                // Selected
                &.selected,
                &.highlighted.selected {
                    background: $color-primary !important;
                    color: $white;
                    &:hover {
                        background: color.adjust($color-primary, $lightness: -5%) !important;
                        border-color: $border-color !important;
                    }
                }

                &.highlighted {
                    background: $color-primary;
                    color: $white;

                    &:hover {
                        background: color.adjust($color-primary, $lightness: -5%) !important;
                        border-color: $border-color !important;
                    }

                    &:not(.highlight-start):not(.highlight-end) {
                        border-radius: 0;
                    }

                    &.highlight-start {
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                    }

                    &.highlight-end {
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                    }
                }
            }
        }

        // Small Datepicker modifier.
        &__small {
            --dp-font-size: #{$datepicker-small-font-size};
            --dp-cell-size: #{$datepicker-small-day-width};

            padding: $datepicker-small-padding-y $datepicker-small-padding-x;
            font-size: $datepicker-small-font-size;
            max-width: $datepicker-small-max-width;

            .dp--calendar-header-item,
            .dp--cell-inner {
                width: $datepicker-small-day-width;
                height: $datepicker-small-day-height;
                line-height: $datepicker-small-day-line-height;
                font-size: $datepicker-small-day-font-size;
                font-weight: $datepicker-small-day-font-weight;
            }

            .dp--calendar-header-item {
                font-size: $datepicker-small-day-header-font-size;
            }

            .cell {
                &.day {
                    width: $datepicker-small-day-width;
                    height: $datepicker-small-day-height;
                    line-height: $datepicker-small-day-line-height;
                }

                &.day,
                &.month,
                &.year {
                    font-size: $datepicker-small-day-font-size;
                    font-weight: $datepicker-small-day-font-weight;
                }

                &.day-header {
                    font-size: $datepicker-small-day-header-font-size;
                }
            }
        }
    }
</style>
