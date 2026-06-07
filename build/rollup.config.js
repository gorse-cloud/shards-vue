'use strict'

import path from 'path'
import fs from 'fs'
import { name as packageName, dependencies, version } from '../package.json'

import cleanCSS from 'clean-css'
import buble from 'rollup-plugin-buble'
import vuePlugin from 'rollup-plugin-vue'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const PATHS = require('./paths')

const [major, minor] = process.versions.node.split('.').map(parseFloat)
if (major < 7 || (major === 7 && minor <= 5)) {
    utils.logError('Node 7.6+ is required.')
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
    bootstrap: 'bootstrap',
    nouislider: 'noUiSlider',
    '@gorse/shards-ui': 'Shards',
    'vue-clickaway': 'vueClickaway',
    'vuejs-datepicker': 'VueDatepicker'
}

module.exports = {
    input: PATHS.INPUT,
    external: Object.keys(dependencies).filter(dep => {
        return ['popper.js', 'lodash.xor'].indexOf(dep) === -1
    }),
    plugins: [
        vuePlugin({
            compileTemplate: true,
            style: {
                preprocessOptions: {
                    scss: {
                        silenceDeprecations: ['legacy-js-api']
                    }
                }
            },
            cssModules: {
                generateScopedName: '[name]__[local]'
            },
            css(style) {
                fs.writeFileSync(
                    path.resolve(PATHS.DIST, `${bundleName}.css`),
                    new cleanCSS().minify(style).styles
                )
            }
        }),
        nodeResolve({ external: ['vue'] }),
        commonjs(),
        buble({
            objectAssign: 'Object.assign'
        })
    ],
    output: [
        {
            banner,
            format: 'cjs',
            name: camelize(bundleName),
            file: path.resolve(PATHS.DIST, bundleName + '.common.js'),
            sourcemap: true
        },
        {
            banner,
            format: 'umd',
            name: camelize(bundleName),
            modulename: camelize(bundleName),
            globals,
            file: path.resolve(PATHS.DIST, bundleName + '.umd.js'),
            sourcemap: true
        },
        {
            banner,
            format: 'es',
            name: camelize(bundleName),
            modulename: camelize(bundleName),
            file: path.resolve(PATHS.DIST, bundleName + '.esm.js'),
            sourcemap: true
        }
    ]
}
