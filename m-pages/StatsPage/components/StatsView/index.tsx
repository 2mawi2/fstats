'use client'

import { InsertChartOutlined } from '@mui/icons-material'
import { Box, Divider, Stack } from '@mui/material'

import { useTransactionHelper, useUserPreferences } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { filterTransactions, getAmountFilterOptions, getCurrency } from '../../actions'
import { useWorkspaceFiles } from '../../context'
import { useAmountFilter } from '../../useAmountFilter'
import CategoryBreakdown from '../CategoryBreakdown'
import DropZoneDisplay from '../DropZoneDisplay'
import NoSelectionDisplay from '../NoSelectionDisplay'
import SegmentedToggle from '../SegmentedToggle'
import SummaryChart from '../SummaryChart'
import TransactionChart from '../TransactionChart'
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
  const { transactions, transactionRangeItems } = useTransactionHelper({
    files: selectedFiles,
    locale,
    dateFormat,
    filterTransactions: (unique) => filterTransactions(unique, amountFilter),
  })
  const currency = getCurrency(transactions)

  return (
    <>
      <ViewToolbar>
        <SegmentedToggle
          value={amountFilter}
          options={getAmountFilterOptions()}
          onChange={setAmountFilter}
          disabled={!selectedFiles.length}
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
        ) : (
          <Stack divider={<Divider flexItem />}>
            <Box sx={sx.section}>
              <SummaryChart transactionRangeItems={transactionRangeItems} />
            </Box>

            <Box sx={sx.section}>
              <CategoryBreakdown transactions={transactions} currency={currency} amountFilter={amountFilter} />
            </Box>

            <Box sx={sx.section}>
              <TransactionChart transactions={transactions} currency={currency} />
            </Box>
          </Stack>
        )}
      </Box>
    </>
  )
}

export default Component
