import { readFileSync } from 'fs'
import log from 'kth-node-log'

export interface ResourceFileNames {
  vendorJs: string,
  appJs: string
}

export function getResourceFileNames (manifestFilePath: string): ResourceFileNames {
  try {
    const manifest = JSON.parse(readFileSync(manifestFilePath, 'utf8'))
    return {
      vendorJs: manifest['vendor.js'],
      appJs: manifest['app.js']
    }
  } catch (e) {
    log.error('Cannot load file names manifest, ensure that the client code bundles has been built')
    throw e
  }
}
