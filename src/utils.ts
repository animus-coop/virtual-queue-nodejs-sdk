import { z } from 'zod'
import { VQueueInvalidUUID } from './errors.js'

export const validateUUID = (uuid: string) => {
  const parsed = z.uuid().safeParse(uuid)
  if (!parsed.success) {
    throw new VQueueInvalidUUID(parsed.error.message)
  }
}
