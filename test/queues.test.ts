import { beforeAll, describe, expect, it, jest } from '@jest/globals'

import { verifyToken } from '@vqueue/sdk'

const GOOD_TOKEN = 'a78502ab-8506-4984-8b58-ad15810868a3'
const BAD_TOKEN = 'e656a844-9ac0-4880-8490-b5c9a46d6fed'

const MOCK_RESPONSE_DATA = {
  [GOOD_TOKEN]: {
    data: {
      token: GOOD_TOKEN,
      finished_line: {
        finished_at: '2024-09-17T09:47:10Z',
        ingressed_at: '2024-09-17T09:15:53Z',
      },
    },
    message: 'Token succesfully verified',
    success: true,
  },
  [BAD_TOKEN]: {
    data: {},
    message: 'The queue could not be verified.',
    success: false,
    error_code: 404,
  },
}

const MOCK_RESPONSES = {
  [GOOD_TOKEN]: new Response(JSON.stringify(MOCK_RESPONSE_DATA[GOOD_TOKEN]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  }),
  [BAD_TOKEN]: new Response(JSON.stringify(MOCK_RESPONSE_DATA[BAD_TOKEN]), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  }),
}

describe('Queue token verification', () => {
  beforeAll(() => {
    global.fetch = jest.fn((resource: string) => {
      const token = resource.slice(resource.indexOf('token=') + 6)
      return Promise.resolve(MOCK_RESPONSES[token])
    })
  })

  describe('verifyToken', () => {
    it('should respond {success: true} for valid token', async () => {
      await expect(verifyToken(GOOD_TOKEN)).resolves.toEqual(
        MOCK_RESPONSE_DATA[GOOD_TOKEN],
      )
    })

    it('should respond {success: false} for bad token', async () => {
      await expect(verifyToken(BAD_TOKEN)).resolves.toEqual(
        MOCK_RESPONSE_DATA[BAD_TOKEN],
      )
    })
  })
})
