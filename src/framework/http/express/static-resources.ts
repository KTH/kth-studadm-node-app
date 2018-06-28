import express, { Application } from 'express'
import { perpetualCache } from './cache-strategies'

export function applyStaticRouting (uriPathPrefix: string, cachableFiles: string[], application: Application) {
  application.use(uriPathPrefix + '/static/kth-style', express.static('./node_modules/kth-style/dist'))
  for (const cachableFile of cachableFiles) {
    application.use(uriPathPrefix + '/static/' + cachableFile, perpetualCache)
  }
  application.use(uriPathPrefix  + '/static', express.static('./dist/public'))
}