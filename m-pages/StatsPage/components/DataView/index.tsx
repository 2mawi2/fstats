'use client'

import { Box, FormControlLabel, Switch } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { useTranslation } from '@/lib/i18n'

import {
  getAmountFilterOptions,
  getDuplicateCount,
  getEmptyReason,
  getTransactionsLayoutOptions,
  TransactionsLayout,
} from '../../actions'
import { useWorkspaceFiles } from '../../context'
import { getView, WorkspaceView } from '../../params'
import { useAmountFilter } from '../../useAmountFilter'
import CsvPreview from '../CsvPreview'
import DropZoneDisplay from '../DropZoneDisplay'
import NoSelectionDisplay from '../NoSelectionDisplay'
import NoTransactionsDisplay from '../NoTransactionsDisplay'
import SegmentedToggle from '../SegmentedToggle'
import TransactionsPreview from '../TransactionsPreview'
import ViewToolbar from '../ViewToolbar'
import { ui } from './styled'

/**
 * Transactions or CSV view of the workspace (`view` param) of the checked files.
 */
const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  // State rather than a ref, so the previews re-render once the scroll element exists
  const [middleColumn, setMiddleColumn] = useState<HTMLDivElement | null>(null)
  const isTransactions = getView(useSearchParams()) === WorkspaceView.TRANSACTIONS
  const [transactionsLayout, setTransactionsLayout] = useLocalStorage<TransactionsLayout>(
    MISC.LS_DATA_TRANSACTIONS_LAYOUT_KEY,
    TransactionsLayout.COMBINED,
    { initializeWithValue: false },
  )
  const [includeDuplicates, setIncludeDuplicates] = useLocalStorage(MISC.LS_DATA_INCLUDE_DUPLICATES_KEY, false, {
    initializeWithValue: false,
  })
  const [amountFilter, setAmountFilter] = useAmountFilter()
  // All transactions, those on days deselected in the date explorer are greyed out rather than removed
  const { files, checkedFiles, selectedFiles: checkedParsedFiles } = useWorkspaceFiles()
  // The filters don't apply to the CSV view
  const emptyReason = isTransactions ? getEmptyReason(checkedParsedFiles, checkedParsedFiles, amountFilter) : null
  const isEmpty = !files.length || !checkedFiles.length || !!emptyReason
  // The view's controls only apply to checked files
  const isTransactionsView = checkedFiles.length > 0 && isTransactions
  // Multiple parsed files are shown as one, with combined stats above the stats per file
  const isCombined = checkedParsedFiles.length > 1
  const isTransactionsSplit = isCombined && transactionsLayout === TransactionsLayout.SPLIT
  // Only the combined table has duplicates
  const duplicateCount = isCombined && !isTransactionsSplit ? getDuplicateCount(checkedParsedFiles, amountFilter) : 0

  return (
    <>
      {/* Outside the scroll container, so it stays in place */}
      <ViewToolbar>
        {/* Always shown, so the toolbar doesn't change when switching views */}
        <SegmentedToggle
          value={amountFilter}
          options={getAmountFilterOptions()}
          onChange={setAmountFilter}
          disabled={!isTransactionsView}
          disabledTooltip={
            !isTransactions
              ? t('STATS_PAGE.CSV_DISABLED')
              : !checkedFiles.length
                ? t('STATS_PAGE.NO_SELECTION.TITLE')
                : undefined
          }
        />
        {isTransactionsView && isCombined ? (
          <SegmentedToggle
            value={transactionsLayout}
            options={getTransactionsLayoutOptions()}
            onChange={setTransactionsLayout}
          />
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
          ) : emptyReason ? (
            <NoTransactionsDisplay reason={emptyReason} />
          ) : isTransactions ? (
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
