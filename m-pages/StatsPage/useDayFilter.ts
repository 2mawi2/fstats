'use client'

import { useMemo, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'

export type DayFilter = {
  /**
   * Days (`yyyy-MM-dd`) deselected in the date explorer.
   */
  deselectedDays: Set<string>
  setDeselectedDays: (days: Set<string>) => void
}

/**
 * Days deselected in the date explorer, shared by the transactions and stats views via the workspace context.
 * Deselected rather than selected days are stored, so days of newly added files are shown. Not stored in demo mode,
 * so the demo starts with all days selected and doesn't filter the user's files.
 */
export const useDayFilter = ({ isDemoMode }: { isDemoMode: boolean }): DayFilter => {
  const [storedDays, setStoredDays] = useLocalStorage<string[]>(MISC.LS_DATA_DESELECTED_DAYS_KEY, [], {
    initializeWithValue: false,
  })
  const storedDeselectedDays = useMemo(() => new Set(storedDays), [storedDays])
  const [demoDeselectedDays, setDemoDeselectedDays] = useState<Set<string>>(new Set())
  const [wasDemoMode, setWasDemoMode] = useState(isDemoMode)

  // Reset when entering or leaving the demo, the page stays mounted
  if (isDemoMode !== wasDemoMode) {
    setWasDemoMode(isDemoMode)
    setDemoDeselectedDays(new Set())
  }

  if (isDemoMode) {
    return { deselectedDays: demoDeselectedDays, setDeselectedDays: setDemoDeselectedDays }
  }

  return { deselectedDays: storedDeselectedDays, setDeselectedDays: (days) => setStoredDays([...days]) }
}
