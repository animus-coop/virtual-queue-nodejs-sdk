import { describe, expect, it } from '@jest/globals'

import { validateUUID } from './utils.js'

describe('Utils', () => {
  describe('validateUUID', () => {
    it('should detect invalid UUIDs', () => {
      expect(() => validateUUID('')).toThrow()
      expect(() => validateUUID('this-isnt-a-valid-uuid')).toThrow()
      expect(() =>
        validateUUID('62d4ef63-d19c-48b8-82cb-5a90fc64fabx'),
      ).toThrow()
    })

    it('should detect valid UUIDs', () => {
      expect(() =>
        validateUUID('6151b802-e55f-4fb1-aecb-6c2ccca99f75'),
      ).not.toThrow()
      expect(() =>
        validateUUID('280c8a15-2431-407f-aea2-30b663442dd7'),
      ).not.toThrow()
      expect(() =>
        validateUUID('2194f806-cbe1-4c8d-a860-c71b6e2f029a'),
      ).not.toThrow()
    })
  })
})
