import type { User, UserAtRest } from '@/types'
import { zSyncableUser } from '@/types'

export const syncUser = (dataToSync: User): UserAtRest => {
  const res = zSyncableUser.safeParse(dataToSync)

  if (!res.success) {
    const errors = res.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
    throw new Error(`Cannot sync User: ${errors}`)
  }

  return res.data
}
