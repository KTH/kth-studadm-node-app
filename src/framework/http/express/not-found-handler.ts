import { ErrorWithStatus } from '../error-with-status'

export function notFoundHandler (req, res, next) {
  next(new ErrorWithStatus('Not Found: ' + req.originalUrl, 404))
}
