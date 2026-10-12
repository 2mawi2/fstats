'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'

import { TableView } from './actions'

/**
 * Raw or transactions table of the data view, shared so the stats view can show it in the same toolbar.
 */
export const useTableView = () => {
  return useLocalStorage<TableView>(MISC.LS_DATA_TABLE_VIEW_KEY, TableView.RAW, {
    initializeWithValue: false,
  })
}
