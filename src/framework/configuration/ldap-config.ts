export function remapLdapOptionsForLdapClient (unpackedConfig: any) {
  return {
    url: unpackedConfig.uri,
    timeout: unpackedConfig.timeout,
    connectTimeout: unpackedConfig.connecttimeout,
    maxConnections: unpackedConfig.maxconnections,
    bindDN: unpackedConfig.username,
    bindCredentials: unpackedConfig.password,
    checkInterval: unpackedConfig.checkinterval,
    maxIdleTime: unpackedConfig.maxidletime,
    reconnectOnIdle: unpackedConfig.reconnectOnIdle,
    reconnectTime: unpackedConfig.reconnectTime,
    reconnect: true
  }
}

export function createLdapOptions (ldapBase: string) {
  return {
    base: ldapBase,
    filter: '(ugKthid=KTHID)',
    filterReplaceHolder: 'KTHID',
    userattrs: ['displayName', 'mail', 'ugUsername', 'memberOf', 'ugLadok3StudentUid'],
    groupattrs: ['cn', 'objectCategory'],
    reconnect: true
  }
}
