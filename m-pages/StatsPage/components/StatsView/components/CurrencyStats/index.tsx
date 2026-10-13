'use client'

import { Box, Divider, Stack } from '@mui/material'
import { useMemo } from 'react'

import type { ParsedStatsFile } from '@/types'
import type { Currency } from '@/types-enums'
import { getFileTransactions } from '@/m-stats-file/service'
import { getTransactionHelper, useUserPreferences } from '@/hooks'

import { filterTransactions, getTransactionCounts } from '../../../../actions'
import { useShownFiles } from '../../../../context'
import { useTransactionFilter } from '../../../../useTransactionFilter'
import BalanceChart from '../../../BalanceChart'
import CategoryBreakdown from '../../../CategoryBreakdown'
import TransactionChart from '../../../TransactionChart'
import TransactionCountChart from '../../../TransactionCountChart'
import { ui } from './styled'

type CurrencyStatsProps = {
  currency: Currency
  /**
   * Of the currency, as shown by the date explorer.
   */
  files: ParsedStatsFile[]
  /**
   * Of the currency, before the date explorer.
   */
  allFiles: ParsedStatsFile[]
  /**
   * In the chart titles, when several currencies are shown.
   */
  chip?: string
}

/**
 * Charts and category breakdown of the files of one currency.
 */
const Component = ({ currency, files, allFiles, chip }: CurrencyStatsProps) => {
  const sx = ui()
  const { locale, dateFormat } = useUserPreferences()
  const { deselectedDays, excludedDayCount } = useShownFiles()
  const { filter, amountFilter } = useTransactionFilter()
  const { transactions, transactionRangeItems } = useMemo(
    () =>
      getTransactionHelper({
        files,
        locale,
        dateFormat,
        filterTransactions: (unique) => filterTransactions(unique, filter),
        excludedDays: deselectedDays,
      }),
    [files, locale, dateFormat, filter, deselectedDays],
  )
  const counts = useMemo(
    () => getTransactionCounts(filterTransactions(allFiles.flatMap(getFileTransactions), filter), deselectedDays),
    [allFiles, filter, deselectedDays],
  )

  return (
    <Stack divider={<Divider flexItem />}>
      <Box sx={sx.section}>
        <BalanceChart transactionRangeItems={transactionRangeItems} excludedDayCount={excludedDayCount} chip={chip} />
      </Box>

      <Box sx={sx.section}>
        <TransactionCountChart transactions={transactions} excludedDays={deselectedDays} counts={counts} chip={chip} />
      </Box>

      <Box sx={sx.section}>
        <TransactionChart transactions={transactions} currency={currency} chip={chip} />
      </Box>

      <Box sx={sx.section}>
        <CategoryBreakdown transactions={transactions} currency={currency} amountFilter={amountFilter} chip={chip} />
      </Box>
    </Stack>
  )
}

export default Component
