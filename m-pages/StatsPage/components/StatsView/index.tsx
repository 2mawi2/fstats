'use client'

import { Box, Divider, Stack } from '@mui/material'
import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { getTableViewOptions, TableView } from '@/m-pages/DataPage/actions'
import { NoSelectionDisplay, SegmentedToggle } from '@/m-pages/DataPage/components'
import { ViewToolbar } from '@/m-pages/Workspace/components'
import { useWorkspace } from '@/m-pages/Workspace/context'
import { useFileHelper, useTransactionHelper, useUserPreferences } from '@/hooks'

import { getCurrency } from '../../actions'
import CategoryBreakdown from '../CategoryBreakdown'
import NoDataDisplay from '../NoDataDisplay'
import SummaryChart from '../SummaryChart'
import TransactionChart from '../TransactionChart'
import { ui } from './styled'

/**
 * Middle column of the stats view: charts and category breakdown of the selected files.
 */
const Component = () => {
  const sx = ui()
  const { locale, dateFormat } = useUserPreferences()
  const { isDemoMode, onAddFiles, onAddFolder } = useWorkspace()
  const { files, selectedFiles } = useFileHelper({ isDemoMode })
  const { transactions, transactionRangeItems } = useTransactionHelper({
    files: selectedFiles,
    locale,
    dateFormat,
  })
  const currency = getCurrency(transactions)
  // Only applies to the data page, shown disabled so the toolbar doesn't change when switching
  const [tableView] = useLocalStorage<TableView>(MISC.LS_DATA_TABLE_VIEW_KEY, TableView.RAW, {
    initializeWithValue: false,
  })

  return (
    <>
      <ViewToolbar>
        <SegmentedToggle value={tableView} options={getTableViewOptions()} onChange={() => {}} disabled />
      </ViewToolbar>
      <Box sx={sx.scroll}>
        {!files.length ? (
          <NoDataDisplay onAddFiles={onAddFiles} onAddFolder={onAddFolder} />
        ) : !selectedFiles.length ? (
          <NoSelectionDisplay />
        ) : (
          <Stack divider={<Divider flexItem />}>
            <Box sx={sx.section}>
              <SummaryChart transactionRangeItems={transactionRangeItems} />
            </Box>

            <Box sx={sx.section}>
              <CategoryBreakdown transactions={transactions} currency={currency} />
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
