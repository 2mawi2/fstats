import type { CustomParser } from '@/types'
import { zCustomParser } from '@/types'
import { parseOrThrow } from '@/lib/zod'

export const syncCustomParser = (dataToSync: CustomParser): CustomParser => {
  return parseOrThrow(zCustomParser, dataToSync, 'Cannot sync CustomParser')
}
