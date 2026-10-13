'use client'

import { InsertChartOutlined } from '@mui/icons-material'
import { Box, Divider, Stack } from '@mui/material'

import { getFileTransactions } from '@/m-stats-file/service'
import { useTransactionHelper, useUserPreferences } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import {
  filterTransactions,
  getAmountFilterOptions,
  getCurrency,
  getEmptyReason,
  getTransactionCounts,
} from '../../actions'
import { useShownFiles, useWorkspaceFiles } from '../../context'
import { useAmountFilter } from '../../useAmountFilter'
import BalanceChart from '../BalanceChart'
import CategoryBreakdown from '../CategoryBreakdown'
import DropZoneDisplay from '../DropZoneDisplay'
import NoSelectionDisplay from '../NoSelectionDisplay'
import NoTransactionsDisplay from '../NoTransactionsDisplay'
import SegmentedToggle from '../SegmentedToggle'
import TransactionChart from '../TransactionChart'
import TransactionCountChart from '../TransactionCountChart'
import ViewToolbar from '../ViewToolbar'
import { ui } from './styled'

/**
 * Stats view of the workspace: charts and category breakdown of the selected files.
 */
const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  const { locale, dateFormat } = useUserPreferences()
  const { files } = useWorkspaceFiles()
  const { parsedFiles: selectedFiles, allParsedFiles, deselectedDays, excludedDayCount } = useShownFiles()
  const [amountFilter, setAmountFilter] = useAmountFilter()
  const { transactions, transactionRangeItems } = useTransactionHelper({
    files: selectedFiles,
    locale,
    dateFormat,
    filterTransactions: (unique) => filterTransactions(unique, amountFilter),
    excludedDays: deselectedDays,
  })
  const counts = getTransactionCounts(
    filterTransactions(allParsedFiles.flatMap(getFileTransactions), amountFilter),
    deselectedDays,
  )
  const currency = getCurrency(transactions)
  const emptyReason = getEmptyReason(allParsedFiles, selectedFiles, amountFilter)

  return (
    <>
      <ViewToolbar>
        <SegmentedToggle
          value={amountFilter}
          options={getAmountFilterOptions()}
          onChange={setAmountFilter}
          disabled={!selectedFiles.length}
          disabledTooltip={t('STATS_PAGE.NO_SELECTION.TITLE')}
        />
      </ViewToolbar>
      <Box sx={sx.scroll}>
        {!files.length ? (
          <DropZoneDisplay
            icon={InsertChartOutlined}
            title={t('STATS_PAGE.STATS_VIEW.NO_DATA')}
            subtitleKey="STATS_PAGE.STATS_VIEW.NO_DATA_SELECT"
          />
        ) : !selectedFiles.length ? (
          <NoSelectionDisplay />
        ) : emptyReason ? (
          <NoTransactionsDisplay reason={emptyReason} />
        ) : (
          <Stack divider={<Divider flexItem />}>
            <Box sx={sx.section}>
              <BalanceChart transactionRangeItems={transactionRangeItems} excludedDayCount={excludedDayCount} />
            </Box>

            <Box sx={sx.section}>
              <TransactionCountChart transactions={transactions} excludedDays={deselectedDays} counts={counts} />
            </Box>

            <Box sx={sx.section}>
              <TransactionChart transactions={transactions} currency={currency} />
            </Box>

            <Box sx={sx.section}>
              <CategoryBreakdown transactions={transactions} currency={currency} amountFilter={amountFilter} />
            </Box>
          </Stack>
        )}
      </Box>
    </>
  )
}

export default Component
