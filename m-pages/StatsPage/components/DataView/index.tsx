'use client'

import { Box } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useDeferredValue, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { getFileTransactions } from '@/m-stats-file/service'
import { useTranslation } from '@/lib/i18n'

import {
  filterTransactions,
  getAmountFilterOptions,
  getEmptyReason,
  getTransactionCounts,
  getTransactionsLayoutOptions,
  TransactionsLayout,
} from '../../actions'
import { useShownFiles, useWorkspaceDayFilter, useWorkspaceFiles } from '../../context'
import { getView, WorkspaceView } from '../../params'
import { useTableOptions } from '../../useTableOptions'
import { useTransactionFilter } from '../../useTransactionFilter'
import CsvPreview from '../CsvPreview'
import DropZoneDisplay from '../DropZoneDisplay'
import NoSearchResultsDisplay from '../NoSearchResultsDisplay'
import NoSelectionDisplay from '../NoSelectionDisplay'
import NoTransactionsDisplay from '../NoTransactionsDisplay'
import SearchField from '../SearchField'
import SegmentedToggle from '../SegmentedToggle'
import TransactionsPreview from '../TransactionsPreview'
import ViewToolbar from '../ViewToolbar'
import { toSearchQuery } from '../VirtualTable/actions'
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
  // Kept when switching between the CSV and transactions views. Deferred, so typing stays responsive with many rows.
  const [search, setSearch] = useState('')
  const searchQuery = toSearchQuery(useDeferredValue(search))
  const { includeDuplicates, setIncludeDuplicates, includeDateExcluded, setIncludeDateExcluded } = useTableOptions()
  const { filter, amountFilter, setAmountFilter } = useTransactionFilter()
  const { deselectedDays } = useWorkspaceDayFilter()
  const { parsedFiles: shownParsedFiles } = useShownFiles()
  // All transactions, those on days deselected in the date explorer are greyed out or hidden
  const { files, checkedFiles, selectedFiles: checkedParsedFiles } = useWorkspaceFiles()
  const visibleParsedFiles = includeDateExcluded ? checkedParsedFiles : shownParsedFiles
  // The filters don't apply to the CSV view
  const emptyReason = isTransactions ? getEmptyReason(checkedParsedFiles, visibleParsedFiles, filter) : null
  const isEmpty = !files.length || !checkedFiles.length || !!emptyReason
  // The view's controls only apply to checked files
  const isTransactionsView = checkedFiles.length > 0 && isTransactions
  // Multiple parsed files are shown as one, with combined stats above the stats per file
  const isCombined = checkedParsedFiles.length > 1
  const isTransactionsSplit = isCombined && transactionsLayout === TransactionsLayout.SPLIT
  const counts = getTransactionCounts(
    filterTransactions(checkedParsedFiles.flatMap(getFileTransactions), filter),
    deselectedDays,
  )
  // Only the combined table has duplicates
  const duplicateCount = isCombined && !isTransactionsSplit ? counts.duplicateCount : 0

  return (
    <>
      {/* Outside the scroll container, so it stays in place */}
      <ViewToolbar
        end={<SearchField value={search} onChange={setSearch} disabled={isEmpty} />}
        options={
          isTransactionsView
            ? [
                {
                  key: 'dateExcluded',
                  label: t('STATS_PAGE.DATA_VIEW.SHOW_DATE_EXCLUDED'),
                  count: counts.dateExcludedCount,
                  checked: includeDateExcluded,
                  onChange: setIncludeDateExcluded,
                },
                {
                  key: 'duplicates',
                  label: t('STATS_PAGE.DATA_VIEW.SHOW_DUPLICATES'),
                  count: duplicateCount,
                  checked: includeDuplicates,
                  onChange: setIncludeDuplicates,
                },
              ]
            : undefined
        }
      >
        {/* Always shown, so the toolbar doesn't change when switching views */}
        <SegmentedToggle
          value={amountFilter}
          options={getAmountFilterOptions()}
          onChange={setAmountFilter}
          disabled={!isTransactionsView}
          disabledTooltip={
            !checkedFiles.length
              ? t('STATS_PAGE.NO_SELECTION.TITLE')
              : !isTransactions
                ? t('STATS_PAGE.CSV_DISABLED')
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
                  filter={filter}
                  includeDuplicates={includeDuplicates}
                  includeDateExcluded={includeDateExcluded}
                  scrollElement={middleColumn}
                  search={searchQuery}
                />
              ))
            ) : (
              <TransactionsPreview
                files={checkedFiles}
                filter={filter}
                includeDuplicates={includeDuplicates}
                includeDateExcluded={includeDateExcluded}
                scrollElement={middleColumn}
                search={searchQuery}
              />
            )
          ) : (
            checkedFiles.map((file) => (
              <CsvPreview key={file.id} file={file} scrollElement={middleColumn} search={searchQuery} />
            ))
          )}
        </div>
        {/* Shown by CSS once the tables leave the content empty, so they don't need to report their matches */}
        {searchQuery ? (
          <Box sx={sx.noSearchResults}>
            <NoSearchResultsDisplay search={search.trim()} onClear={() => setSearch('')} />
          </Box>
        ) : null}
      </Box>
    </>
  )
}

export default Component
