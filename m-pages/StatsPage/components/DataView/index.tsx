'use client'

import { Box, FormControlLabel, Switch } from '@mui/material'
import { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { useTranslation } from '@/lib/i18n'

import {
  AmountFilter,
  getAmountFilterOptions,
  getDuplicateCount,
  getTableViewOptions,
  getTransactionsLayoutOptions,
  TableView,
  TransactionsLayout,
} from '../../actions'
import { useWorkspaceFiles } from '../../context'
import { useTableView } from '../../useTableView'
import CsvPreview from '../CsvPreview'
import DropZoneDisplay from '../DropZoneDisplay'
import NoSelectionDisplay from '../NoSelectionDisplay'
import SegmentedToggle from '../SegmentedToggle'
import TransactionsPreview from '../TransactionsPreview'
import ViewToolbar from '../ViewToolbar'
import { ui } from './styled'

/**
 * Data view of the workspace: the raw CSV or transactions of the checked files.
 */
const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  // State rather than a ref, so the previews re-render once the scroll element exists
  const [middleColumn, setMiddleColumn] = useState<HTMLDivElement | null>(null)
  const [tableView, setTableView] = useTableView()
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
  const { files, checkedFiles, selectedFiles: checkedParsedFiles } = useWorkspaceFiles()
  const isEmpty = !files.length || !checkedFiles.length
  // The view's controls only apply to checked files
  const isTransactionsView = checkedFiles.length > 0 && tableView === TableView.TRANSACTIONS
  // Multiple parsed files are shown as one, with combined stats above the stats per file
  const isCombined = checkedParsedFiles.length > 1
  const isTransactionsSplit = isCombined && transactionsLayout === TransactionsLayout.SPLIT
  // Only the combined table has duplicates
  const duplicateCount = isCombined && !isTransactionsSplit ? getDuplicateCount(checkedParsedFiles, amountFilter) : 0

  return (
    <>
      {/* Outside the scroll container, so it stays in place */}
      <ViewToolbar>
        <SegmentedToggle
          value={tableView}
          options={getTableViewOptions()}
          onChange={setTableView}
          disabled={!checkedFiles.length}
        />
        {isTransactionsView && isCombined ? (
          <SegmentedToggle
            value={transactionsLayout}
            options={getTransactionsLayoutOptions()}
            onChange={setTransactionsLayout}
          />
        ) : null}
        {isTransactionsView ? (
          <SegmentedToggle value={amountFilter} options={getAmountFilterOptions()} onChange={setAmountFilter} />
        ) : null}
        {isTransactionsView && duplicateCount ? (
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={includeDuplicates}
                onChange={(event) => setIncludeDuplicates(event.target.checked)}
              />
            }
            label={t('STATS_PAGE.DATA_VIEW.SHOW_DUPLICATES', { count: duplicateCount })}
            slotProps={{ typography: { variant: 'caption', color: 'text.secondary' } }}
            sx={sx.duplicatesSwitch}
          />
        ) : null}
      </ViewToolbar>
      <Box ref={setMiddleColumn} sx={sx.middleScroll(isEmpty)}>
        {/* Single child, observed by the tables for layout changes above them */}
        <div>
          {!files.length ? (
            <DropZoneDisplay />
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
