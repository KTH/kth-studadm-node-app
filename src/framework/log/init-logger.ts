import log from "kth-node-log"
import bunyan from 'bunyan'
import { getEnv } from "kth-node-configuration"
export function initLogger(env: string, level: string, name: string) {
  log.init({
    level,
    env,
    name,
    serializers: {
      req: bunyan.stdSerializers.req,
      res: bunyan.stdSerializers.res,
      err: bunyan.stdSerializers.err
    }
  })
}