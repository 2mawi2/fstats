'use client'

import { createContext, useContext } from 'react'

import type { useFileHelper } from '@/hooks'

import type { StatsTransactions } from './actions'
import type { DayFilter } from './useDayFilter'
import type { DemoState } from './useViewStorage'

type WorkspaceContextValue = {
  /**
   * Only the read-only demo file is shown, see `getDemoFile`.
   */
  isDemoMode: boolean
  onAddFiles: () => void
  onAddFolder: () => void
  dayFilter: DayFilter
  demoState: DemoState
  /**
   * Shared, so all components get the same (memoized) values.
   */
  files: ReturnType<typeof useFileHelper>
  stats: StatsTransactions
}

/**
 * Lets the views inside the workspace use its file picker, files and transactions. Synchronous state only.
 */
export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export const useWorkspace = () => {
  const value = useContext(WorkspaceContext)

  if (!value) {
    throw new Error('useWorkspace must be used inside the workspace')
  }

  return value
}

/**
 * The files shown in the workspace, only the demo file in demo mode.
 */
export const useWorkspaceFiles = () => {
  return useWorkspace().files
}

/**
 * Days deselected in the date explorer, see `useDayFilter`.
 */
export const useWorkspaceDayFilter = () => {
  return useWorkspace().dayFilter
}

/**
 * Transactions of the checked parsed files, computed once for all components, see `getStatsTransactions`.
 */
export const useStatsTransactions = () => {
  return useWorkspace().stats
}
