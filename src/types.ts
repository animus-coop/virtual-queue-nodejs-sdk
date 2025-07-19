import { z } from 'zod'

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
  data: z.object<VerificationData>().optional(),
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
    console.error(
      `Error parsing field value: ${JSON.stringify(input, null, 2)}`,
    )
    console.error(`Zod error: ${parsed.error.message}`)
    throw new Error('Invalid field value schema')
  }

  return parsed.data as VerificationResult
}
