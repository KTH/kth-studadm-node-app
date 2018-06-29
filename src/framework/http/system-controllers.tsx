import { createElement } from 'inferno-create-element'
import log from 'kth-node-log'
import {
  Controller,
  ControllerResponse,
  JsonResponse,
  JSXResponse,
  NegotiatedResponse,
  StatusResponse,
  TextResponse
} from './controller-contract'
import { cortinaBlocksGetter } from '../cortina/get-cortina-blocks'
import { ResourceFileNames } from '../pages/get-resource-filenames'
import { ErrorPage } from '../pages/error-page'
import { AboutPage, BuildInfo, PackageInfo } from '../pages/about-page'

export interface CortinaInput {
  lang: 'sv' | 'en'
  baseUrl: string
  url: string
}

type ErrorControllerInput = CortinaInput & { error: any }

const errorMessages = {
  errorNotFound: {
    sv: 'Tyvärr kunde vi inte hitta sidan du söker',
    en: 'Sorry, we can\'t find your requested page'
  },
  errorGeneric: {
    sv: 'Något gick fel, var god försök igen senare',
    en: 'Something went wrong, please try again later.'
  },
  errorForbidden: {
    sv: 'Du saknar behörighet till sidan',
    en: 'You don\'t have permission to access to this page'
  },
  supportReferenceId: {
    sv: 'Vid felanmälan och kontakt med support, ange referens',
    en: 'Please use this reference if you need support regarding this error'
  }
}

function getFriendlyErrorMessage (error: any, lang: 'sv' | 'en') {
  const statusCode = error && error.status || 500
  switch (statusCode) {
    case 404:
      return errorMessages.errorNotFound[lang]
    case 403:
      return errorMessages.errorForbidden[lang]
    default:
      return errorMessages.errorGeneric[lang]
  }
}


export class ErrorController implements Controller<ErrorControllerInput> {

  constructor (private uriPathPrefix: string,
               private getCortinaBlocks: cortinaBlocksGetter,
               private resourceFileNames: ResourceFileNames) {}

  async handle (input: ErrorControllerInput): Promise<ControllerResponse> {
    const supportReferenceId = Date.now().toString(36)
    const error = input.error
    log.error({ err: error, supportReferenceId: supportReferenceId })
    let lang = input.lang
    const statusCode = error.status || 500

    const blocks = await this.getCortinaBlocks(lang, input.baseUrl + input.url)
    return new StatusResponse(statusCode,
      new NegotiatedResponse({
        'html': new JSXResponse(<ErrorPage blocks={blocks}
                                           friendly={getFriendlyErrorMessage(error, lang)}
                                           supportReferenceId={supportReferenceId}
                                           supportMessage={errorMessages.supportReferenceId[lang]}
                                           message={error.message}
                                           language={lang}
                                           status={statusCode}
                                           proxyPrefixPathUri={this.uriPathPrefix}
                                           resourceFileNames={this.resourceFileNames}/>),

        'json': new JsonResponse({
          message: error.message,
          supportReferenceId: supportReferenceId,
          friendly: getFriendlyErrorMessage(error, lang)
        }),
        'text': new TextResponse(error.message + ' (' + supportReferenceId + ')')
      })
    )
  }
}

export class AboutController implements Controller<{}> {

  constructor (private packageInfo: PackageInfo,
               private buildInfo: BuildInfo,
               private uriPathPrefix: string) {}

  async handle (input: {}): Promise<ControllerResponse> {
    return new JSXResponse(
      <AboutPage packageInfo={this.packageInfo} buildInfo={this.buildInfo} proxyPrefixUri={this.uriPathPrefix}/>
    )
  }

}

export interface MonitorResult {
  ok: boolean
  message?: string
}

export interface Monitor {
  name: string
  optional?: boolean
  performCheck (): Promise<MonitorResult>
}

export class MonitorController implements Controller<{}> {

  constructor (private monitorCheckers: Monitor[]) {}

  private static performCheck (checker: Monitor): Promise<MonitorResult & {monitor: Monitor}> {
    try {
      return checker.performCheck()
        .then(result => ({ monitor: checker, ...result }))
        .catch(e => ({
          ok: false,
          message: 'error executing check',
          monitor: checker
        }))
    } catch (e) {
      return Promise.resolve({
        ok: false,
        message: 'error executing check',
        monitor: checker
      })
    }
  }

  private static resultToString (result: MonitorResult & {monitor: Monitor}) {
    const status = result.ok ? 'OK' : 'ERROR'
    const message = result.message ? ' ' + result.message : ''
    return ' - ' + result.monitor.name + ': ' + status + message
  }

  async handle (input: {}): Promise<ControllerResponse> {
    const results = await Promise.all(this.monitorCheckers.map(MonitorController.performCheck))
    const allOk = results
      .filter(result => !result.monitor.optional)
      .map(result => result.ok)
      .reduce((ok, allOk) => ok && allOk, true)
    const mainStatus = allOk ? 'OK' : 'ERROR'
    const details = results.map(MonitorController.resultToString)
      .join('\n')
    return new TextResponse('APPLICATION_STATUS: ' + mainStatus + '\n' + details)
  }
}
