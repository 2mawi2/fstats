'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { MISC } from '@/common'
import { clearSessionFiles, reparseOutdatedFiles } from '@/m-stats-file/service'
import { ensureUserExists } from '@/m-user/service'
import { logger } from '@/utils/Logger'
import { initStorage } from '@/lib/localforage'

type StorageProps = {
  children: ReactNode
}

const Component = ({ children }: StorageProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      initStorage()
      const user = await ensureUserExists()

      if (!user.persistData && !sessionStorage.getItem(MISC.SS_SESSION_KEY)) {
        await clearSessionFiles()
      }

      await reparseOutdatedFiles()
      sessionStorage.setItem(MISC.SS_SESSION_KEY, 'true')
    }

    init()
      .catch((error) => logger('error', 'StorageProvider', 'Failed to initialise storage:', error))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return null
  }

  return children
}

export default Component
