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
  Monitor,
  MonitorController,
  notFoundHandler,
  remapLdapOptionsForLdapClient,
  TextResponse
} from '..'
import { createClient } from 'kth-node-ldap'
import { buildInfo } from './version'

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
  },
  'supportReferenceId': {
    sv: 'Vid felanmälan och kontakt med support, ange referens',
    en: 'Please use this reference if you need support regarding this error'
  },
  'errorNotFound': {
    sv: 'Tyvärr kunde vi inte hitta sidan du söker',
    en: 'Sorry, we can\'t find your requested page'
  },
  'errorGeneric': {
    sv: 'Något gick fel, var god försök igen senare',
    en: 'Something went wrong, please try again later.'
  },
  'errorForbidden': {
    sv: 'Du saknar behörighet till sidan',
    en: 'You don\'t have permission to access to this page'
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
    console.log(input.groups)
    return new TextResponse('Test ' + input.query.name)
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
const errorController = new ErrorController(uriPathPrefix, getCortinaBlocks, resourceFileNames, getMessage)
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
