'use client'

import { Box, FormControlLabel, Switch } from '@mui/material'
import { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { ViewToolbar } from '@/m-pages/Workspace/components'
import { useWorkspace } from '@/m-pages/Workspace/context'
import { useFileHelper } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import {
  AmountFilter,
  getAmountFilterOptions,
  getDuplicateCount,
  getTableViewOptions,
  getTransactionsLayoutOptions,
  TableView,
  TransactionsLayout,
} from './actions'
import { CsvPreview, DropZoneDisplay, NoSelectionDisplay, SegmentedToggle, TransactionsPreview } from './components'
import { ui } from './styled'

const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  // State rather than a ref, so the previews re-render once the scroll element exists
  const [middleColumn, setMiddleColumn] = useState<HTMLDivElement | null>(null)
  const [tableView, setTableView] = useLocalStorage<TableView>(MISC.LS_DATA_TABLE_VIEW_KEY, TableView.RAW, {
    initializeWithValue: false,
  })
  const [transactionsLayout, setTransactionsLayout] = useLocalStorage<TransactionsLayout>(
    MISC.LS_DATA_TRANSACTIONS_LAYOUT_KEY,
    TransactionsLayout.COMBINED,
    { initializeWithValue: false },
  )
  const [includeDuplicates, setIncludeDuplicates] = useLocalStorage(MISC.LS_DATA_INCLUDE_DUPLICATES_KEY, false, {
    initializeWithValue: false,
  })
  const [amountFilter, setAmountFilter] = useLocalStorage<AmountFilter>(
    MISC.LS_DATA_AMOUNT_FILTER_KEY,
    AmountFilter.ALL,
    {
      initializeWithValue: false,
    },
  )
  const { isDemoMode, onAddFiles, onAddFolder } = useWorkspace()
  const { files, checkedFiles, selectedFiles: checkedParsedFiles } = useFileHelper({ isDemoMode })
  // Multiple parsed files are shown as one, with combined stats above the stats per file
  const isCombined = checkedParsedFiles.length > 1
  const isTransactionsSplit = isCombined && transactionsLayout === TransactionsLayout.SPLIT
  // Only the combined table has duplicates
  const duplicateCount = isCombined && !isTransactionsSplit ? getDuplicateCount(checkedParsedFiles, amountFilter) : 0

  return (
    <>
      {/* Outside the scroll container, so it stays in place */}
      {!checkedFiles.length ? (
        <ViewToolbar>
          <SegmentedToggle value={tableView} options={getTableViewOptions()} onChange={setTableView} disabled />
        </ViewToolbar>
      ) : (
        <ViewToolbar>
          <SegmentedToggle value={tableView} options={getTableViewOptions()} onChange={setTableView} />
          {tableView === TableView.TRANSACTIONS && isCombined ? (
            <SegmentedToggle
              value={transactionsLayout}
              options={getTransactionsLayoutOptions()}
              onChange={setTransactionsLayout}
            />
          ) : null}
          {tableView === TableView.TRANSACTIONS ? (
            <SegmentedToggle value={amountFilter} options={getAmountFilterOptions()} onChange={setAmountFilter} />
          ) : null}
          {tableView === TableView.TRANSACTIONS && duplicateCount ? (
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={includeDuplicates}
                  onChange={(event) => setIncludeDuplicates(event.target.checked)}
                />
              }
              label={t('DATA_PAGE.SHOW_DUPLICATES', { count: duplicateCount })}
              slotProps={{ typography: { variant: 'caption', color: 'text.secondary' } }}
              sx={sx.duplicatesSwitch}
            />
          ) : null}
        </ViewToolbar>
      )}
      <Box ref={setMiddleColumn} sx={sx.middleScroll}>
        {/* Single child, observed by the tables for layout changes above them */}
        <div>
          {!files.length ? (
            <DropZoneDisplay onAddFiles={onAddFiles} onAddFolder={onAddFolder} />
          ) : !checkedFiles.length ? (
            <NoSelectionDisplay />
          ) : tableView === TableView.TRANSACTIONS ? (
            isTransactionsSplit ? (
              checkedFiles.map((file) => (
                <TransactionsPreview
                  key={file.id}
                  files={[file]}
                  amountFilter={amountFilter}
                  includeDuplicates={includeDuplicates}
                  scrollElement={middleColumn}
                />
              ))
            ) : (
              <TransactionsPreview
                files={checkedFiles}
                amountFilter={amountFilter}
                includeDuplicates={includeDuplicates}
                scrollElement={middleColumn}
              />
            )
          ) : (
            checkedFiles.map((file) => <CsvPreview key={file.id} file={file} scrollElement={middleColumn} />)
          )}
        </div>
      </Box>
    </>
  )
}

export default Component
