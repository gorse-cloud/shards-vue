'use strict'

const path = require('path')
const vuePlugin = require('rollup-plugin-vue')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const postcss = require('rollup-plugin-postcss')
const {
    name: packageName,
    dependencies = {},
    peerDependencies = {},
    version
} = require('../package.json')

const PATHS = require('./paths')

const [major, minor] = process.versions.node.split('.').map(parseFloat)
if (major < 7 || (major === 7 && minor <= 5)) {
    console.error('Node 7.6+ is required.')
    process.exit()
}

// Converts strings into camelCase
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) {
            return ''
        }
        return index == 0 ? match.toLowerCase() : match.toUpperCase()
    })
}

const year = new Date().getFullYear()
const bundleName = packageName.split('/').pop()
const banner = `/*
* Shards Vue v${version} (https://designrevision.com/downloads/shards-vue/)
* Based on: Bootstrap ${dependencies.bootstrap} (https://getbootstrap.com)
* Based on: Shards ${dependencies['@gorse/shards-ui']} (https://designrevision.com/downloads/shards/)
* Copyright 2017-${year} DesignRevision (https://designrevision.com)
* Copyright 2017-${year} Catalin Vasile (http://catalin.me)
*/`

const globals = {
    vue: 'Vue',
    bootstrap: 'bootstrap',
    nouislider: 'noUiSlider',
    '@gorse/shards-ui': 'Shards',
    '@vuepic/vue-datepicker': 'VueDatePicker'
}

module.exports = {
    input: PATHS.INPUT,
    external: Object.keys({ ...dependencies, ...peerDependencies }).filter(dep => {
        return ['popper.js', 'lodash.xor'].indexOf(dep) === -1
    }),
    plugins: [
        vuePlugin({
            preprocessStyles: true,
            cssModulesOptions: {
                generateScopedName: '[name]__[local]'
            }
        }),
        postcss({
            sourceMap: true,
            minimize: false,
            inject: true
        }),
        nodeResolve(),
        commonjs()
    ],
    output: [
        {
            banner,
            format: 'cjs',
            name: camelize(bundleName),
            file: path.resolve(PATHS.DIST, bundleName + '.common.js'),
            sourcemap: true,
            exports: 'named'
        },
        {
            banner,
            format: 'umd',
            name: camelize(bundleName),
            globals,
            file: path.resolve(PATHS.DIST, bundleName + '.umd.js'),
            sourcemap: true,
            exports: 'named'
        },
        {
            banner,
            format: 'es',
            file: path.resolve(PATHS.DIST, bundleName + '.esm.js'),
            sourcemap: true
        }
    ]
}
