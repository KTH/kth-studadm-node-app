import express, { Application } from 'express'
import cookieParser from 'cookie-parser'

export function applyRequestParsing (application: Application) {
  application.use(express.json())
  application.use(express.urlencoded({ extended: true }))
  application.use(cookieParser())
}
