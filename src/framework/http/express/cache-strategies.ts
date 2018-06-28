import { RequestHandler } from 'express'

export const noCache: RequestHandler = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  next()
}

export const perpetualCache: RequestHandler = (req, res, next) => {
  res.setHeader('Cache-Control', 'max-age=31556926')
  next()
}
