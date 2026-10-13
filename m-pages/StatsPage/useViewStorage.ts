'use client'

import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { useWorkspace } from './context'

export type DemoState = {
  /**
   * View state of the demo by local storage key, see `useViewStorage`.
   */
  values: Record<string, unknown>
  setValues: Dispatch<SetStateAction<Record<string, unknown>>>
}

/**
 * Page state backing `useViewStorage` in demo mode. Reset when entering or leaving the demo, the page stays mounted.
 */
export const useDemoState = (isDemoMode: boolean): DemoState => {
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [wasDemoMode, setWasDemoMode] = useState(isDemoMode)

  if (isDemoMode !== wasDemoMode) {
    setWasDemoMode(isDemoMode)
    setValues({})
  }

  return { values, setValues }
}

/**
 * View state stored in local storage, or in the page state in demo mode, so the demo starts with the defaults and
 * doesn't filter the user's files.
 */
export const useViewStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const { isDemoMode, demoState } = useWorkspace()
  const [storedValue, setStoredValue] = useLocalStorage<T>(key, initialValue, { initializeWithValue: false })
  const { values, setValues } = demoState
  const setDemoValue = useCallback((value: T) => setValues((state) => ({ ...state, [key]: value })), [key, setValues])

  if (!isDemoMode) {
    return [storedValue, setStoredValue]
  }

  return [key in values ? (values[key] as T) : initialValue, setDemoValue]
}
