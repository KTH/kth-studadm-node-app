import cortina from 'kth-node-cortina-block'
import log from 'kth-node-log'
import redis from 'kth-node-redis'

import { ClientOpts } from 'redis'

export interface GetCortinaBlockOptions {
  blockUrl: string
  headers?: any
  addBlocks?: any
  uriPathPrefix,
  hostUrl: string
  redisOptions?: ClientOpts
}

type Lang = 'sv' | 'en'

export type messageGetter = (key: 'site_name' | 'locale_text', lang: Lang) => string

export type cortinaBlocksGetter = (lang: Lang, url: string) => Promise<any>

const memCache = new Map<string, { time: Date, blocks: any }>()
const maxAge = 2 * 60 * 60 * 1000

function getFromCache (key: string) {
  const result = memCache.get(key)
  if (result) {
    const age = new Date().getTime() - result.time.getTime()
    if (age < maxAge) {
      return result.blocks
    }
  }
  return null
}

function addToCache (key: string, blocks: any) {
  memCache.set(key, {
    time: new Date(),
    blocks
  })
  return blocks
}

export function createGetCortinaBlocks (getMessage: messageGetter, options: GetCortinaBlockOptions): cortinaBlocksGetter {

  function prepareBlocks (blocks: any, lang: Lang, requestUrl: string) {
    return cortina.prepare(blocks, {
      // if you don't want/need custom site name or locale text,
      // simply comment out the appropriate lines of code

      // this sets the site name shown in the header
      siteName: getMessage('site_name', lang),

      // this needs to be set to the "opposite" of the current language
      localeText: getMessage('locale_text', lang === 'en' ? 'sv' : 'en'),

      urls: {
        // baseUrl is the location where the router was mounted. This solves a particular problem with
        // publications-web and could lead to problems in other apps. Beware...
        request: requestUrl,
        app: options.hostUrl + options.uriPathPrefix
      }
    })
  }

  function getRedisClient (redisOptions: ClientOpts) {
    return redis('cortina', redisOptions)
      .catch(err => {
        log.warn('Unable to connect to client, falling back to cache less', err)
        return null
      })
  }

  function getBlocksToPrepare (lang: Lang, requestUrl: string) {
    const cortinaParams = {
      language: lang,
      url: options.blockUrl,
      headers: options.headers,
      blocks: options.addBlocks,
      redis: null
    }
    if (options.redisOptions) {
      return getRedisClient(options.redisOptions)
        .then(client => {
          cortinaParams.redis = client
          cortina(cortinaParams)
        })
    } else {
      const key = requestUrl + '|' + lang
      const fromCache = getFromCache(key)
      if (!fromCache) {
        return cortina(cortinaParams)
          .then(blocks => addToCache(key, blocks))
      } else {
        return Promise.resolve(fromCache)
      }
    }

  }

  return function (lang: Lang, requestUrl: string) {
    return getBlocksToPrepare(lang, requestUrl)
      .then(function (blocks) {
        log.debug('Cortina blocks loaded')
        return prepareBlocks(blocks, lang, requestUrl)
      }).catch(function (err) {
        log.error('Cortina failed to load blocks: ' + err.message)
        return Promise.reject(err)
      })
  }
}
