'use client'

import { createContext, useContext } from 'react'

import type { ParsedStatsFile } from '@/types'
import { useFileHelper } from '@/hooks'

import type { CheckedTransactions, StatsTransactions } from './actions'
import { getCheckedTransactions, getStatsTransactions } from './actions'
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
}

/**
 * Lets the views inside the workspace use its file picker. Synchronous UI state only.
 */
export const WorkspaceContext = createContext<WorkspaceContextValue>({
  isDemoMode: false,
  onAddFiles: () => {},
  onAddFolder: () => {},
  dayFilter: { deselectedDays: new Set(), setDeselectedDays: () => {} },
  demoState: { values: {}, setValues: () => {} },
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

// Per checked files and deselected days (both memoized), so all components share one computation. The part that
// only depends on the files is kept when (de)selecting days.
const cache = new WeakMap<
  ParsedStatsFile[],
  { files: CheckedTransactions; byDays: WeakMap<Set<string>, StatsTransactions> }
>()

/**
 * Transactions of the checked parsed files, computed once for all components, see `getStatsTransactions`.
 */
export const useStatsTransactions = () => {
  const { selectedFiles } = useWorkspaceFiles()
  const { deselectedDays } = useWorkspaceDayFilter()
  let entry = cache.get(selectedFiles)

  if (!entry) {
    entry = { files: getCheckedTransactions(selectedFiles), byDays: new WeakMap() }
    cache.set(selectedFiles, entry)
  }

  let stats = entry.byDays.get(deselectedDays)

  if (!stats) {
    stats = getStatsTransactions(entry.files, deselectedDays)
    entry.byDays.set(deselectedDays, stats)
  }

  return stats
}
