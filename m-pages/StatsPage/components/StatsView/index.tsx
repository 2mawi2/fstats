'use client'

import { InsertChartOutlined } from '@mui/icons-material'
import { Box, Divider, Stack } from '@mui/material'

import { useTransactionHelper, useUserPreferences } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import {
  filterDays,
  filterTransactions,
  getAmountFilterOptions,
  getCurrency,
  getEmptyReason,
  getExcludedDayCount,
} from '../../actions'
import { useWorkspaceDayFilter, useWorkspaceFiles } from '../../context'
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
  const { files, selectedFiles } = useWorkspaceFiles()
  const [amountFilter, setAmountFilter] = useAmountFilter()
  const { deselectedDays } = useWorkspaceDayFilter()
  const { transactions, transactionRangeItems } = useTransactionHelper({
    files: selectedFiles,
    locale,
    dateFormat,
    filterTransactions: (unique) => filterDays(filterTransactions(unique, amountFilter), deselectedDays),
    excludedDays: deselectedDays,
  })
  const currency = getCurrency(transactions)
  const emptyReason = getEmptyReason(selectedFiles, amountFilter, deselectedDays)

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
              <BalanceChart
                transactionRangeItems={transactionRangeItems}
                excludedDayCount={getExcludedDayCount(selectedFiles, deselectedDays)}
              />
            </Box>

            <Box sx={sx.section}>
              <TransactionCountChart transactions={transactions} excludedDays={deselectedDays} />
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
