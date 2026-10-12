import type { User, UserAtRest } from '@/types'
import { zSyncableUser } from '@/types'
import { parseOrThrow } from '@/lib/zod'

export const syncUser = (dataToSync: User): UserAtRest => {
  return parseOrThrow(zSyncableUser, dataToSync, 'Cannot sync User')
}
