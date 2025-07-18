import { type VerificationResult, parseVerificationResult } from './types.js'

const VERIFY_API_URL = 'https://app.virtual-queue.com/api/v1/verify'

export async function verifyToken(token: string): Promise<VerificationResult> {
  const res = await fetch(`${VERIFY_API_URL}?token=${token}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  const data = await res.json()
  return parseVerificationResult(data)
}
