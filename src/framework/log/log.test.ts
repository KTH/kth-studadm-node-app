import log from 'kth-node-log'
import { initLogger } from './init-logger'

describe('logging', function () {
  describe('check info log', function () {
    it('should info log without error', function () {
      initLogger('development', 'debug', 'kth-studadm-node-app')
      log.info('test')
    })
  })
})
