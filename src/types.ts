import { z } from 'zod'

import { VQueueError } from './errors.js'

const verificationDataSchema = z.object({
  token: z.uuid(),
  finished_line: z.object({
    finished_at: z.date(),
    ingressed_at: z.date(),
  }),
})

const sucessVerificationResultSchema = z.object({
  success: z.literal(true),
  data: verificationDataSchema,
  message: z.string(),
})

const errorVerificationResultSchema = z.object({
  success: z.literal(false),
  data: verificationDataSchema.optional(),
  message: z.string(),
  errorCode: z.number('error_code').int().optional(),
})

const verificationResultSchema = z.discriminatedUnion('success', [
  sucessVerificationResultSchema,
  errorVerificationResultSchema,
])

export type VerificationResult = z.infer<typeof verificationResultSchema>

export function parseVerificationResult(input: unknown): VerificationResult {
  const parsed = verificationResultSchema.safeParse(input)
  if (!parsed.success) {
    throw new VQueueError(`Error parsing input: ${parsed.error.message}`)
  }

  return parsed.data as VerificationResult
}
