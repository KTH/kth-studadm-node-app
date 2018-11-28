import passport from 'passport'
import log from 'kth-node-log'
import { GatewayStrategy, routeHandlers, Strategy as CasStrategy } from 'kth-node-passport-cas'
import { LdapClient } from 'kth-node-ldap'
import { Application, RequestHandler, Router } from 'express'
import { ErrorWithStatus } from '../error-with-status'

export interface AuthenticationConfiguration {
  cas: {
    ssoBaseURL: string,
    pgtUrl?: string
  }
  uriPathPrefix: string
  hostUrl: string,
  ldap: any
}

export interface Authentication {
  applyTo: (server: Application) => {
    serverLogin: RequestHandler
    requireGroup: (groupName: string) => RequestHandler
  }
}

interface LdapUser {
  ugUsername: string
  displayName: string
  mail: string
  ugLadok3StudentUid: string | undefined
  memberOf: string[]
  ugLadok3StudentUid: string
}

export function extractGroupName (ldapDn: string): string | null {
  const pattern = /^CN=([a-zA-Z0-9_.]+)/
  const match = pattern.exec(ldapDn)
  if (match) {
    return match[1]
  } else {
    return null
  }
}

function requireGroup (acceptedGroup: string): RequestHandler {
  return authorizeGroups(groupNames => groupNames.some(groupName => acceptedGroup === groupName))
}

function authorizeGroups (isAuthorized: (groupNames: string[]) => boolean): RequestHandler {
  return (req, res, next) => {
    const userGroups = req.session && req.session.authUser && req.session.authUser.groups || []
    if (isAuthorized(userGroups)) {
      return next()
    } else {
      return next(new ErrorWithStatus('Forbidden', 403))
    }
  }
}

export function createAuthentication (ldapClient: LdapClient, config: AuthenticationConfiguration, roleFilter: (groupName: string) => boolean): Authentication {
  passport.serializeUser(function (user, done) {
    if (user) {
      log.debug('User serialized: ' + user)
      done(null, user)
    } else {
      done(null)
    }
  })

  passport.deserializeUser(function (user, done) {
    if (user) {
      log.debug('User deserialized: ' + user)
      done(null, user)
    } else {
      done(null)
    }
  })

  const casOptions = {
    ssoBaseURL: config.cas.ssoBaseURL,
    serverBaseURL: config.hostUrl,
    pgtURL: config.cas.pgtUrl ? config.hostUrl + config.cas.pgtUrl : null
  }

  passport.use(new CasStrategy(casOptions,
    function (logOnResult, done) {
      const user = logOnResult.user
      log.debug(`User from CAS: ${user} ${JSON.stringify(logOnResult)}`)
      return done(null, user, logOnResult)
    }
  ))

  passport.use(new GatewayStrategy({
    casUrl: config.cas.ssoBaseURL
  }, function (result, done) {
    log.debug({ result: result }, `CAS Gateway user: ${result.user}`)
    done(null, result.user, result)
  }))

  // The factory routeHandlers.getRedirectAuthenticatedUser returns a middleware that sets the user in req.session.authUser and
  // redirects to appropriate place when returning from CAS login
  // The unpackLdapUser function transforms an ldap user to a user object that is stored as
  const redirectAuthenticatedUserHandler = routeHandlers.getRedirectAuthenticatedUser({
    ldapConfig: config.ldap,
    ldapClient: ldapClient,
    proxyPrefixPath: config.uriPathPrefix,
    unpackLdapUser: function (ldapUser: LdapUser, pgtIou?: string) {
      return {
        username: ldapUser.ugUsername,
        displayName: ldapUser.displayName,
        email: ldapUser.mail,
        ugLadok3StudentUid: ldapUser.ugLadok3StudentUid,
        pgtIou: pgtIou,
        ugLadok3StudentUid: ldapUser.ugLadok3StudentUid,
        groups: ldapUser.memberOf
          .map(extractGroupName)
          .filter(groupName => groupName && roleFilter(groupName))
      }
    }
  })

  function applyToServer (server: Application) {
    const { authLoginHandler, authCheckHandler, logoutHandler, pgtCallbackHandler, serverLogin } = routeHandlers({
      casLoginUri: config.uriPathPrefix + '/login',
      casGatewayUri: config.uriPathPrefix + '/loginGateway',
      proxyPrefixPath: config.uriPathPrefix,
      server: server
    })

    server.use(passport.initialize())
    server.use(passport.session())

    const authRoute = Router()
    authRoute.get('/login', authLoginHandler, redirectAuthenticatedUserHandler)
    authRoute.get('/loginGateway', authCheckHandler, redirectAuthenticatedUserHandler)
    authRoute.get('/logout', logoutHandler)
    authRoute.get('/pgtCallback', pgtCallbackHandler)
    server.use(config.uriPathPrefix, authRoute)
    return { serverLogin, requireGroup: requireGroup }
  }

  return {
    applyTo: applyToServer
  }
}
