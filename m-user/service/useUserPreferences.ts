'use client'

import type { UserPreferences } from '@/types'
import { DateFormat, UserLocale } from '@/types-enums'

import { useMutateUpdateUser, useUser } from './hooks'

export const useUserPreferences = (): UserPreferences & {
  setLocale: (locale: UserLocale) => void
  setPersistData: (persistData: boolean) => void
  setDateFormat: (dateFormat: DateFormat) => void
} => {
  const { data: user } = useUser()
  const { mutate: updateUser } = useMutateUpdateUser()

  return {
    locale: user.locale,
    persistData: user.persistData,
    dateFormat: user.dateFormat,
    setLocale: (locale) => updateUser({ locale }),
    setPersistData: (persistData) => updateUser({ persistData }),
    setDateFormat: (dateFormat) => updateUser({ dateFormat }),
  }
}
