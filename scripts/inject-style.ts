import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function main() {
  const styleContent = readFileSync(
    resolve(__dirname, '../dist/assets/index.css'),
    'utf-8',
  )
  const injectStyle = `<style>${styleContent}</style>`
  const htmlContent = readFileSync(
    resolve(__dirname, '../dist/index.html'),
    'utf8',
  )
  writeFileSync(
    resolve(__dirname, '../index.html'),
    htmlContent.replace('</head>', `${injectStyle}</head>`),
  )
}

main()
