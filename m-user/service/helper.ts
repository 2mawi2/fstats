import type { User } from '@/types'
import { ColorMode, UserLocale } from '@/types-enums'
import { MISC } from '@/common'
import { i18n } from '@/lib/i18n'
import { getQueryClient } from '@/lib/tanstack-query'

import { addUser, getUser, updateUser } from '../api'
import { userKey } from './keys'

export const getUserDefaults = (): User => ({
  created: '',
  modified: '',
  id: '',
  locale: MISC.DEFAULT_LOCALE,
  colorMode: MISC.DEFAULT_COLOR_MODE,
  persistData: MISC.DEFAULT_PERSIST_DATA,
  dateFormat: MISC.DEFAULT_DATE_FORMAT,
})

/**
 * Ensures user exists in storage and populates query cache. This allows us to
 * call `useUser()` without having to check whether the user call is loading.
 */
export const ensureUserExists = async (): Promise<User> => {
  const queryClient = getQueryClient()
  let user = await getUser()
  // The language is detected (or selected) by i18n, number and date formatting follow it
  const locale = (i18n.resolvedLanguage as UserLocale | undefined) ?? MISC.DEFAULT_LOCALE

  if (user) {
    // Run migrations
    if (!user.dateFormat) {
      user = await updateUser({ dateFormat: MISC.DEFAULT_DATE_FORMAT })
    }

    if (user.locale !== locale) {
      user = await updateUser({ locale })
    }
  } else {
    const newUser = getUserDefaults()
    user = await addUser({
      ...newUser,
      locale,
      colorMode: window.localStorage.getItem(MISC.LS_MUI_COLOR_MODE_KEY)
        ? (window.localStorage.getItem(MISC.LS_MUI_COLOR_MODE_KEY) as ColorMode)
        : newUser.colorMode,
    })
  }

  queryClient.setQueryData(userKey.detail(MISC.USER_KEY), user)

  return user
}
