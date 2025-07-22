import { beforeAll, describe, expect, it, jest } from '@jest/globals'

import { verifyToken, safeVerifyToken } from '@vqueue/sdk'

const GOOD_TOKEN = 'a78502ab-8506-4984-8b58-ad15810868a3'
const BAD_TOKEN = 'e656a844-9ac0-4880-8490-b5c9a46d6fed'
const NETWORK_ERROR_TOKEN = '4e89bf36-f885-43c6-9e66-03e74f0c08d8'

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

const MOCK_RESPONSE_STATUS = {
  [GOOD_TOKEN]: 200,
  [BAD_TOKEN]: 404,
}

describe('Queue token verification', () => {
  beforeAll(() => {
    global.fetch = jest.fn((resource: string) => {
      const token = resource.slice(resource.indexOf('token=') + 6)

      if (token === NETWORK_ERROR_TOKEN) {
        throw TypeError('Something went wrong')
      }

      return Promise.resolve(
        new Response(JSON.stringify(MOCK_RESPONSE_DATA[token]), {
          status: MOCK_RESPONSE_STATUS[token],
          headers: { 'Content-Type': 'application/json' },
        }),
      )
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

    it('should throw for invalid UUID', async () => {
      await expect(verifyToken('this-isnt-a-valid-uuid')).rejects.toThrow()
    })

    it('should throw for network error', async () => {
      await expect(verifyToken(NETWORK_ERROR_TOKEN)).rejects.toThrow()
    })
  })

  describe('safeVerifyToken', () => {
    it('should respond {success: true} for valid token', async () => {
      await expect(safeVerifyToken(GOOD_TOKEN)).resolves.toEqual(
        MOCK_RESPONSE_DATA[GOOD_TOKEN],
      )
    })

    it('should respond {success: false} for bad token', async () => {
      await expect(safeVerifyToken(BAD_TOKEN)).resolves.toEqual(
        MOCK_RESPONSE_DATA[BAD_TOKEN],
      )
    })

    it('should return {succes: false} for invalid UUID', async () => {
      await expect(
        safeVerifyToken('this-isnt-a-valid-uuid'),
      ).resolves.toMatchObject({ success: false })
    })

    it('should return {success: false} for network error', async () => {
      await expect(safeVerifyToken(NETWORK_ERROR_TOKEN)).resolves.toMatchObject(
        {
          success: false,
        },
      )
    })
  })
})
