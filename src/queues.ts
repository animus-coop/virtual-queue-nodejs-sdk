import { type VerificationResult, parseVerificationResult } from './types.js'
import { VQueueNetworkError } from './errors.js'

const VERIFY_API_URL = 'https://app.virtual-queue.com/api/v1/verify'

export async function verifyToken(token: string): Promise<VerificationResult> {
  try {
    const res = await fetch(`${VERIFY_API_URL}?token=${token}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    const data = await res.json()
    return parseVerificationResult(data)
  } catch (err: unknown) {
    throw new VQueueNetworkError(
      'Network Error at token verfication: ' +
        (err instanceof Error ? err.message : `${err}`),
    )
  }
}
