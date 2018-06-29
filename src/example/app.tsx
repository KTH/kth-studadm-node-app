//noinspection ES6UnusedImports
import { createElement } from 'inferno-create-element'
import express from 'express'
import cookieSession from 'cookie-session'
import { config as loadDotEnvFile } from 'dotenv'
import { getEnv, unpackLDAPConfig } from 'kth-node-configuration'
import {
  AboutController,
  applyRequestParsing,
  applyStaticRouting,
  Controller,
  ControllerResponse,
  ControllerSupportExpress,
  CortinaInput,
  createAuthentication,
  createGetCortinaBlocks,
  createLdapOptions,
  ErrorController,
  getPackageInfo,
  getResourceFileNames,
  initLogger,
  JSXResponse,
  Monitor,
  MonitorController,
  notFoundHandler,
  Page,
  remapLdapOptionsForLdapClient
} from '..'
import { createClient } from 'kth-node-ldap'
import { buildInfo } from './version'
import { cortinaBlocks } from './cortina-blocks'
import { DataEnvelope } from '../framework/components/data-envelope'
import { ClientConfig, clientConfigEnvelopeId } from './client-config'

interface Input extends CortinaInput {
  params: any,
  query: any,
  groups: string[]
}

loadDotEnvFile()
initLogger('development', 'info', 'test-app')

const messages = {
  'site_name': {
    sv: 'Exempelapp',
    en: 'Example app'
  },
  'locale_text': {
    sv: 'Exempelapp på svenska',
    en: 'Example app in swedish'
  }
}

const getMessage = (key: keyof typeof messages, lang: 'sv' | 'en') => messages[key][lang]

const uriPathPrefix = '/test'
const hostUrl = 'http://localhost:3222'

const ldapOptions = createLdapOptions('OU=UG,DC=ref,DC=ug,DC=kth,DC=se')
const ldapConfig = unpackLDAPConfig('LDAP_URI', getEnv('LDAP_PASSWORD'), null, ldapOptions)
const ldapClient = createClient(remapLdapOptionsForLdapClient(ldapConfig))

const authentication = createAuthentication(ldapClient, {
  cas: {
    ssoBaseURL: 'https://login-r.referens.sys.kth.se'
  },
  uriPathPrefix: uriPathPrefix,
  hostUrl: hostUrl,
  ldap: ldapConfig
}, groupName => groupName.indexOf('app.kopps') === 0)

class IndexController implements Controller<Input> {

  async handle (input: Input): Promise<ControllerResponse> {
    const clientConfig: ClientConfig = { path: uriPathPrefix }
    const extraHeadContent = (<DataEnvelope id={clientConfigEnvelopeId} data={clientConfig}/>)
    return new JSXResponse(
      <Page resourceFileNames={getResourceFileNames('./dist/public/manifest.json')}
            blocks={cortinaBlocks}
            title={'Example app'}
            proxyPrefixPathUri={uriPathPrefix}
            language={'sv'}
            extraHeadContent={extraHeadContent}>
        <h1>
          Example app
        </h1>
        <h2>Input</h2>
        <pre>{JSON.stringify(input, null, 2)}</pre>
      </Page>
    )
  }
}

const controllerSupport = new ControllerSupportExpress<Input>(req => ({
  params: req.params,
  query: req.query,
  groups: req.session.authUser.groups,
  url: req.url,
  baseUrl: req.baseUrl,
  lang: 'sv'
}))

const getCortinaBlocks = createGetCortinaBlocks(getMessage, {
  blockUrl: 'https://www.kth.se/cm/',
  uriPathPrefix,
  hostUrl
})

const monitor1: Monitor = {
  name: 'monitor1',
  performCheck () {
    return Promise.resolve({
      ok: true,
      message: 'all is well'
    })
  }
}

const monitor2: Monitor = {
  name: 'monitor2',
  optional: true,
  performCheck () {
    return Promise.resolve({
      ok: false,
      message: 'could be better...'
    })
  }
}

const resourceFileNames = getResourceFileNames('./dist/public/manifest.json')
const packageInfo = getPackageInfo()
const errorController = new ErrorController(uriPathPrefix, getCortinaBlocks, resourceFileNames)
const aboutController = new AboutController(packageInfo, buildInfo, uriPathPrefix)
const monitorController = new MonitorController([monitor1, monitor2])

function createExpressApp (indexController: IndexController) {
  const application = express()
  application.set('case sensitive routing', true)
  // application.use(accessLog({ useAccessLog: true }))
  applyRequestParsing(application)
  applyStaticRouting('/test', [], application)
  application.use(cookieSession({
    name: 'test-app-sid',
    keys: ['secret1', 'secret2']
  }))

  // application.use(languageHandler)

  const { serverLogin } = authentication.applyTo(application)

  application.use(uriPathPrefix + '/_about', controllerSupport.requestHandlerFrom(aboutController))
  application.use(uriPathPrefix + '/_monitor', controllerSupport.requestHandlerFrom(monitorController))
  application.use(uriPathPrefix, serverLogin, controllerSupport.requestHandlerFrom(indexController))

  application.use(notFoundHandler)

  application.use(uriPathPrefix, controllerSupport.errorRequestHandlerFrom(errorController))
  return application
}

createExpressApp(new IndexController())
  .listen(3222, () => console.log('Started'))
