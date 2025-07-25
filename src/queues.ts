import {
  type VerificationResult,
  type VQueueVerificationConfig,
  parseVerificationResult,
} from './types.js'
import { VQueueNetworkError, VQueueError } from './errors.js'
import { VERIFY_API_URL } from './config.js'
import { validateUUID } from './utils.js'

/**
 * Verifies the queue token with Virtual Queue's API.
 *
 * @param token UUID value of the token to be verified.
 * @param config Configuration for the verification process.
 * @returns The response from the API. The field `success`
 * tells if the token is valid or not
 *
 * @throws `VQueueInvalidUUID` if the provided token is not valid UUIDv4.
 * @throws `VQueueNetworkError` if there is any connectivity issue.
 * @throws `VQueueError` in case of any unexpected error.
 */
export async function verifyToken(
  token: string,
  config?: VQueueVerificationConfig,
): Promise<VerificationResult> {
  try {
    validateUUID(token)

    const baseURL = config?.verificationURL || VERIFY_API_URL

    const res = await fetch(`${baseURL}?token=${token}`, {
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

/**
 * Verifies the queue token with Virtual Queue's API,
 * but doesn't throw any exception in case of errors.
 *
 * @param token UUID value of the token to be verified.
 * @param config Configuration for the verification process.
 * @returns The response from the API if there are no errors.
 * In case of an error the field `success` is set to `false`
 * and the reason is put in the field `message`.
 */
export async function safeVerifyToken(
  token: string,
  config?: VQueueVerificationConfig,
): Promise<VerificationResult> {
  try {
    return await verifyToken(token, config)
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'Safe token verification failed.',
    }
  }
}
