import { ErrorWithStatus } from './error-with-status'

export function requireGroup(groupName: string, userGroups: string[]) {
  if (!userGroups.some(userGroup => userGroup === groupName)) {
    throw new ErrorWithStatus('Forbidden', 403)
  }
}