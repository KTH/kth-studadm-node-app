
export class ControllerResponse {
}

export interface Controller<IN> {
  handle (input: IN): Promise<ControllerResponse>
}

export class RoutedJSXResponse extends ControllerResponse {
  constructor (public renderContext: { url?: string }, public jsx: any) {
    super()
  }
}

export class JSXResponse extends ControllerResponse {
  constructor (public jsx: any) {
    super()
  }
}

export class JsonResponse extends ControllerResponse {
  constructor (public body: any) {
    super()
  }
}

export class TextResponse extends ControllerResponse {
  constructor (public body: string) {
    super()
  }
}

export class RedirectResponse extends ControllerResponse {
  constructor (public newUrl: string) {
    super()
  }
}

export class NegotiatedResponse extends ControllerResponse {
  constructor (public typeMapping: {
    [key: string]: ControllerResponse
  }) {
    super()
  }
}

export class StatusResponse extends ControllerResponse {
  constructor (public status: number, public delegate: ControllerResponse) {
    super()
  }
}

export class FileAttachmentResponse extends ControllerResponse {
  constructor (public attachment: {filename: string, data: Buffer, contentType: string}) {
    super()
  }
}
