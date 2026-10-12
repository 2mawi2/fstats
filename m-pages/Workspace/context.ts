'use client'

import { createContext, useContext } from 'react'

type WorkspaceContextValue = {
  /**
   * Only the read-only demo file is shown, see `getDemoFile`.
   */
  isDemoMode: boolean
  onAddFiles: () => void
  onAddFolder: () => void
}

/**
 * Lets the pages of the workspace layout use its file picker. Synchronous UI state only.
 */
export const WorkspaceContext = createContext<WorkspaceContextValue>({
  isDemoMode: false,
  onAddFiles: () => {},
  onAddFolder: () => {},
})

export const useWorkspace = () => {
  return useContext(WorkspaceContext)
}
