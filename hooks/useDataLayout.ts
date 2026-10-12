'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'

export const DEFAULT_DATA_COLUMN_WIDTHS = [20, 55, 25] // %

export const DEFAULT_DATA_EXPLORER_SPLIT = 60 // %

export const DataLayout = {
  DEFAULT: 'default',
  CUSTOM: 'custom',
} as const

export type DataLayout = (typeof DataLayout)[keyof typeof DataLayout]

/**
 * Resizable layout of the data page: the column widths and the split of the left column.
 *
 * There are always two versions, the default and the user's custom layout. Resizing while the default is active
 * starts a new custom layout from the default values (overwriting the previous one) and activates it.
 */
export const useDataLayout = () => {
  const [activeLayout, setActiveLayout] = useLocalStorage<DataLayout>(MISC.LS_DATA_LAYOUT_KEY, DataLayout.DEFAULT, {
    initializeWithValue: false,
  })
  const [storedWidths, setCustomColumnWidths] = useLocalStorage<number[]>(
    MISC.LS_DATA_COLUMN_WIDTHS_KEY,
    DEFAULT_DATA_COLUMN_WIDTHS,
    { initializeWithValue: false },
  )
  const [customExplorerSplit, setCustomExplorerSplit] = useLocalStorage<number>(
    MISC.LS_DATA_EXPLORER_SPLIT_KEY,
    DEFAULT_DATA_EXPLORER_SPLIT,
    { initializeWithValue: false },
  )
  // Ignore stored widths from a different column layout
  const customColumnWidths =
    storedWidths.length === DEFAULT_DATA_COLUMN_WIDTHS.length ? storedWidths : DEFAULT_DATA_COLUMN_WIDTHS
  const isDefaultActive = activeLayout === DataLayout.DEFAULT

  const startCustomLayout = () => {
    if (isDefaultActive) {
      setCustomColumnWidths(DEFAULT_DATA_COLUMN_WIDTHS)
      setCustomExplorerSplit(DEFAULT_DATA_EXPLORER_SPLIT)
      setActiveLayout(DataLayout.CUSTOM)
    }
  }

  const setColumnWidths = (widths: number[]) => {
    startCustomLayout()
    setCustomColumnWidths(widths)
  }

  const setExplorerSplit = (split: number) => {
    startCustomLayout()
    setCustomExplorerSplit(split)
  }

  return {
    columnWidths: isDefaultActive ? DEFAULT_DATA_COLUMN_WIDTHS : customColumnWidths,
    explorerSplit: isDefaultActive ? DEFAULT_DATA_EXPLORER_SPLIT : customExplorerSplit,
    setColumnWidths,
    setExplorerSplit,
    customColumnWidths,
    customExplorerSplit,
    activeLayout,
    setActiveLayout,
  }
}
