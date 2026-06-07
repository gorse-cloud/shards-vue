'use strict'

const path = require('path')
const fs = require('fs')
const { minify } = require('terser')
const PATHS = require('./paths')

function stripTrailingWhitespace(content) {
    return content
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/[ \t]+$/gm, '')
}

async function optimize() {
    const files = fs.readdirSync(PATHS.DIST)
        .filter(file => file.endsWith('.js') && file.indexOf('.min.js') === -1)
        .map(file => path.resolve(PATHS.DIST, file))

    for (const file of files) {
        if (path.basename(file).indexOf('.min.js') !== -1) {
            continue
        }

        // Define minified file path
        let minFilePath = path.basename(file).replace('.js', '.min.js')
        minFilePath = path.resolve(PATHS.DIST + '/' + minFilePath)

        // Define minified file's map path
        let minMapPath = path.basename(file).replace('.js', '.min.map')
        minMapPath = path.resolve(PATHS.DIST + '/' + minMapPath)

        // Minify
        let _c = fs.readFileSync(file, 'utf8')
        _c = stripTrailingWhitespace(_c)
        fs.writeFileSync(file, _c)
        const sourceMapPath = `${file}.map`
        const sourceMapContent = fs.existsSync(sourceMapPath)
            ? fs.readFileSync(sourceMapPath, 'utf8')
            : null

        _c = await minify(_c, {
            compress: true,
            mangle: true,
            sourceMap: {
                content: sourceMapContent,
                filename: path.basename(minFilePath),
                url: path.basename(minMapPath)
            }
        })

        // Write minified file and sourcemap
        fs.writeFileSync(minFilePath, _c.code)
        fs.writeFileSync(minMapPath, _c.map)
    }
}

optimize().catch(err => {
    console.error(err)
    process.exit(1)
})
