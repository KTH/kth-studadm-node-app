import { describe , it } from 'mocha'
import { expect } from 'chai'
import { extractGroupName, extractGroups } from './authentication'

const ldapDN = 'CN=app.app_group.KTH,DN=ug,DN=kth,DN=se'
const groupName = 'app.app_group.KTH'

describe('authentication', function () {
  describe('extractGroupName', function () {
    it('should extract group name', function () {
      const groupName = extractGroupName(ldapDN)
      expect(groupName).to.equal(groupName)
    })
  })

  describe('extractGroups', function () {
    it('should extract groups from single group', function () {
      const groups = extractGroups({
        displayName: '',
        mail: '',
        memberOf: ldapDN,
        ugLadok3StudentUid: undefined,
        ugUsername: ''
      }, (groupName) => groupName === groupName)
      expect(groups.length).to.equal(1)
    })
    it('should extract groups from many groups', function () {
      const groups = extractGroups({
        displayName: '',
        mail: '',
        memberOf: [ldapDN, ldapDN],
        ugLadok3StudentUid: undefined,
        ugUsername: ''
      }, (groupName) => groupName === groupName)
      expect(groups.length).to.equal(2)
    })
  })
})
