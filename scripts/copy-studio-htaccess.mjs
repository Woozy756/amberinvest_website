import {copyFileSync, mkdirSync} from 'node:fs'
import path from 'node:path'

const source = path.join(process.cwd(), 'config', 'studio.htaccess')
const destinationDir = path.join(process.cwd(), '.sanity-dist')
const destination = path.join(destinationDir, '.htaccess')

mkdirSync(destinationDir, {recursive: true})
copyFileSync(source, destination)
console.log(`Copied ${source} -> ${destination}`)
