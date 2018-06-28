import { PackageInfo } from './about-page'
import { readFileSync } from 'fs'
import log from 'kth-node-log'

export function getPackageInfo (): PackageInfo {
  try {
    return JSON.parse(readFileSync('./package.json', 'utf8'))
  } catch (e) {
    log.error('Cannot load file names manifest, ensure that the client code bundles has been built')
    throw e
  }
}
