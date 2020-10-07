import {
  BinaryFileAttachmentResponse,
  Controller,
  ControllerResponse,
  FileAttachmentResponse,
  JsonResponse,
  NegotiatedResponse,
  RedirectResponse,
  StatusResponse,
  TextResponse,
  JSXResponse,
  RoutedJSXResponse
} from '../controller-contract'
import { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express'
import { renderToString } from 'inferno-server'

export type InputMapper<ControllerInput> = (req: Request, res: Response) => ControllerInput

export type Newable<T extends ControllerResponse> = { new (...args: any[]): T; }

export type Delegator = (controllerResponse: ControllerResponse, req: Request, res: Response) => void

export interface ExpressResponder<T extends ControllerResponse> {
  responseType: Newable<T>

  applyToResponse (controllerResponse: T, req: Request, res: Response, delegator: Delegator): void
}

const builtInResponders: ExpressResponder<any>[] = [
  {
    responseType: JSXResponse,
    applyToResponse (jsxResponse, req, res) {
      res.send('<!DOCTYPE html>\n' + renderToString(jsxResponse.jsx))
    }
  },
  {
    responseType: RoutedJSXResponse,
    applyToResponse (routedJsxResponse, req, res) {
      const content = renderToString(routedJsxResponse.jsx)
      if (routedJsxResponse.renderContext.url) {
        res.redirect(routedJsxResponse.renderContext.url)
      } else {
        res.send('<!DOCTYPE html>\n' + content)
      }
    }
  },
  {
    responseType: JsonResponse,
    applyToResponse (jsonResponse: JsonResponse, req: Request, res: Response) {
      res.json(jsonResponse.body)
    }
  },
  {
    responseType: TextResponse,
    applyToResponse (textResponse: TextResponse, req: Request, res: Response) {
      res.type('text').send(textResponse.body)
    }
  },
  {
    responseType: RedirectResponse,
    applyToResponse (redirectResponse: RedirectResponse, req: Request, res: Response) {
      res.redirect(redirectResponse.newUrl)
    }
  },
  {
    responseType: FileAttachmentResponse,
    applyToResponse (controllerResponse: FileAttachmentResponse, req: Request, res: Response) {
      res.setHeader('Content-Disposition', 'attachment; filename=' + controllerResponse.attachment.filename)
      res.contentType(controllerResponse.attachment.contentType)
      res.end(controllerResponse.attachment.data)
    }
  },
  {
    responseType: BinaryFileAttachmentResponse,
    applyToResponse (controllerResponse: BinaryFileAttachmentResponse, req: Request, res: Response) {
      res.setHeader('Content-Disposition', 'attachment; filename=' + controllerResponse.attachment.filename)
      res.contentType(controllerResponse.attachment.contentType)
      res.end(controllerResponse.attachment.data, 'binary')
    }
  },
  {
    responseType: StatusResponse,
    applyToResponse (statusResponse: StatusResponse, req: Request, res: Response, delegator: Delegator) {
      res.status(statusResponse.status)
      delegator(statusResponse.delegate, req, res)
    }
  },
  {
    responseType: NegotiatedResponse,
    applyToResponse (negotiatedResponse: NegotiatedResponse, req: Request, res: Response, delegator: Delegator) {
      const bestType = req.accepts(Object.keys(negotiatedResponse.typeMapping))
      if (!bestType) {
        res.status(406).type('text').send('406 Not Acceptable')
      } else {
        delegator(negotiatedResponse.typeMapping[bestType], req, res)
      }
    }
  }
]

function applyResponder (availableResponders: ExpressResponder<any>[],
                         controllerResponse: ControllerResponse,
                         req: Request,
                         res: Response) {
  const matchingResponders = builtInResponders
    .filter(responder => controllerResponse instanceof responder.responseType)
  if (matchingResponders.length === 0) {
    throw new Error('Unsupported controller response type')
  } else {
    const remainingResponders = availableResponders.filter(responder => responder !== matchingResponders[0])
    matchingResponders[0].applyToResponse(controllerResponse, req, res, applyResponder.bind(null, remainingResponders))
  }
}

export class ControllerSupportExpress<IN> {
  private responders: ExpressResponder<any>[]

  constructor (private mapInput: InputMapper<IN>) {
    this.responders = builtInResponders.slice()
  }

  addResponder (responder: ExpressResponder<any>): ControllerSupportExpress<IN> {
    this.responders.unshift(responder)
    return this
  }

  requestHandlerFrom (controller: Controller<IN>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        controller.handle(this.mapInput(req, res))
          .then(response => applyResponder(this.responders, response, req, res))
          .catch(err => next(err))
      } catch (err) {
        next(err)
      }
    }
  }

  errorRequestHandlerFrom (controller: Controller<IN & {error: any}>): ErrorRequestHandler {
    return (error, req, res, next) => {
      try {
        const input = this.mapInput(req, res)
        const errorInput = Object.assign({}, input, { error })
        controller.handle(errorInput)
          .then(response => applyResponder(this.responders, response, req, res))
          .catch(err => next(err))
      } catch (err) {
        res.status(500).type('text').send('Something went wrong, try again later')
      }
    }
  }
}
