'use client'

import { createContext, useContext, useMemo } from 'react'

import { useFileHelper } from '@/hooks'

import { getShownFiles } from './actions'
import type { DayFilter } from './useDayFilter'

type WorkspaceContextValue = {
  /**
   * Only the read-only demo file is shown, see `getDemoFile`.
   */
  isDemoMode: boolean
  onAddFiles: () => void
  onAddFolder: () => void
  dayFilter: DayFilter
}

/**
 * Lets the views inside the workspace use its file picker. Synchronous UI state only.
 */
export const WorkspaceContext = createContext<WorkspaceContextValue>({
  isDemoMode: false,
  onAddFiles: () => {},
  onAddFolder: () => {},
  dayFilter: { deselectedDays: new Set(), setDeselectedDays: () => {} },
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

/**
 * Days deselected in the date explorer, see `useDayFilter`.
 */
export const useWorkspaceDayFilter = () => {
  return useWorkspace().dayFilter
}

/**
 * The checked files as shown by the date explorer, the single source of the day filtered transactions, see
 * `getShownFiles`.
 */
export const useShownFiles = () => {
  const { checkedFiles } = useWorkspaceFiles()
  const { deselectedDays } = useWorkspaceDayFilter()
  return useMemo(() => getShownFiles(checkedFiles, deselectedDays), [checkedFiles, deselectedDays])
}
