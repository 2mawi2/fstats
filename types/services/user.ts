import { z } from 'zod'

import { zDateFormat, zUserLocale } from '@/types-enums'

import { zDateTimeString, zIdString, zNonEmptyString } from '../global'
import type { _KeysCheck } from '../key-check'

const zUserPreferences = z.object({
  locale: zUserLocale,
  persistData: z.boolean(),
  dateFormat: zDateFormat,
})

export type UserPreferences = z.infer<typeof zUserPreferences>

const zUser = z.object({
  created: z.union([z.literal(''), zDateTimeString]),
  modified: z.union([z.literal(''), zDateTimeString]),
  id: z.union([z.literal(''), zIdString]),
  ...zUserPreferences.shape,
})

export type User = z.infer<typeof zUser>

export const zSyncableUser = z.object({
  ...zUser.shape,
  created: zDateTimeString,
  modified: zDateTimeString,
  id: zNonEmptyString,
})

export type UserAtRest = z.infer<typeof zSyncableUser>

// Safety checks
true satisfies _KeysCheck<User, UserAtRest>
