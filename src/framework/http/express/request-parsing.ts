import { Application } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

export function applyRequestParsing (application: Application) {
  application.use(bodyParser.json())
  application.use(bodyParser.urlencoded({ extended: true }))
  application.use(cookieParser())
}
