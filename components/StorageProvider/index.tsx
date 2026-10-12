'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { MISC } from '@/common'
import { reparseOutdatedFiles } from '@/m-stats-file/service'
import { ensureUserExists } from '@/m-user/service'
import { db, initStorage } from '@/lib/localforage'

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
        await db.filesStore.clear()
        window.localStorage.removeItem(MISC.LS_SELECTED_FILE_IDS_KEY)
      }

      await reparseOutdatedFiles()
      sessionStorage.setItem(MISC.SS_SESSION_KEY, 'true')
      setIsLoading(false)
    }
    init()
  }, [])

  if (isLoading) {
    return null
  }

  return children
}

export default Component
