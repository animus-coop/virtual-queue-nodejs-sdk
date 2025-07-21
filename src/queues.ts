import { type VerificationResult, parseVerificationResult } from './types.js'
import { VQueueNetworkError, VQueueError } from './errors.js'
import { VERIFY_API_URL } from './config.js'

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
    if (err instanceof VQueueError) {
      throw err
    }

    throw new VQueueNetworkError(
      'Network Error at token verfication: ' +
        (err instanceof Error ? err.message : `${err}`),
    )
  }
}

export async function safeVerifyToken(
  token: string,
): Promise<VerificationResult> {
  try {
    return verifyToken(token)
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'Safe token verification failed.',
    }
  }
}
