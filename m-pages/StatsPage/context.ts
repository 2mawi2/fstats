'use client'

import { createContext, useContext } from 'react'

import { useFileHelper } from '@/hooks'

type WorkspaceContextValue = {
  /**
   * Only the read-only demo file is shown, see `getDemoFile`.
   */
  isDemoMode: boolean
  onAddFiles: () => void
  onAddFolder: () => void
}

/**
 * Lets the views inside the workspace use its file picker. Synchronous UI state only.
 */
export const WorkspaceContext = createContext<WorkspaceContextValue>({
  isDemoMode: false,
  onAddFiles: () => {},
  onAddFolder: () => {},
})

export const useWorkspace = () => {
  return useContext(WorkspaceContext)
}

/**
 * The files shown in the workspace, only the demo file in demo mode.
 */
export const useWorkspaceFiles = () => {
  const { isDemoMode } = useWorkspace()
  return useFileHelper({ isDemoMode })
}
