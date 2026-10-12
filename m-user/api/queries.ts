import { formatISO } from 'date-fns'

import type { User, UserAtRest } from '@/types'
import { MISC } from '@/common'
import { db } from '@/lib/localforage'

import { syncUser } from './helper'

export const getUser = async (): Promise<User | null> => {
  return db.userStore.getItem<UserAtRest>(MISC.USER_KEY)
}

export const addUser = async (data: User): Promise<User> => {
  if (!data) {
    throw new Error('No data provided!')
  }

  const modified = formatISO(new Date())
  const updatedUser: User = {
    ...data,
    id: MISC.USER_KEY,
    created: modified,
    modified,
  }

  // Syncing strips unknown (e.g. removed) keys, so return the synced user rather than the merged one
  return db.userStore.setItem<UserAtRest>(MISC.USER_KEY, syncUser(updatedUser))
}

export const updateUser = async (updates: Partial<User>): Promise<User> => {
  const data = await db.userStore.getItem<UserAtRest>(MISC.USER_KEY)

  if (!data) {
    throw new Error(`User with id "${MISC.USER_KEY}" not found`)
  }

  const modified = formatISO(new Date())
  const updatedUser: User = {
    ...data,
    ...updates,
    modified,
  }

  // Syncing strips unknown (e.g. removed) keys, so return the synced user rather than the merged one
  return db.userStore.setItem<UserAtRest>(MISC.USER_KEY, syncUser(updatedUser))
}
