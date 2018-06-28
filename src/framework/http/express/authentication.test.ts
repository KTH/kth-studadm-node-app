import { describe , it } from 'mocha'
import { expect } from 'chai'
import { extractGroupName } from './authentication'

describe('authentication', function () {
  describe('extractGroupName', function () {
    it('should extract group name', function () {
      const groupName = extractGroupName('CN=app.app_group.KTH,DN=ug,DN=kth,DN=se')
      expect(groupName).to.equal('app.app_group.KTH')
    })
  })
})
