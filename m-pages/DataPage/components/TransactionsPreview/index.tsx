'use client'

import { useTheme } from '@mui/material/styles'
import { useMemo } from 'react'

import type { StatsFile } from '@/types'
import { isParsed } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { getMaxDecimalsForCurrency } from '@/utils/Currency'
import { toDisplayDate } from '@/utils/Date'
import { toFixedLocale } from '@/utils/Number'
import { getSubcategoryLabel } from '@/utils/TransactionParser'
import { useTranslation } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

import { AmountFilter } from '../../actions'
import PreviewSection from '../PreviewSection'
import VirtualTable from '../VirtualTable'
import { filterTransactions, getTransactionColumns } from './actions'

type TransactionsPreviewProps = {
  file: StatsFile
  amountFilter: AmountFilter
  scrollElement: HTMLElement | null
}

const Component = ({ file, amountFilter, scrollElement }: TransactionsPreviewProps) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { locale, dateFormat } = useUserPreferences()
  const parsedFile = isParsed(file) ? file : null
  const transactions = useMemo(
    () => (parsedFile ? filterTransactions(parsedFile.transactions, amountFilter) : []),
    [parsedFile, amountFilter],
  )
  const columns = useMemo(
    () => (parsedFile ? getTransactionColumns(parsedFile, amountFilter, theme.vars.palette.success.main, t) : []),
    [parsedFile, amountFilter, theme, t],
  )

  const getCells = (index: number) => {
    const transaction = transactions[index]
    const value = Big(transaction.value)
    // Signs are redundant when only one direction is shown
    const isSigned = amountFilter === AmountFilter.ALL
    const amount = toFixedLocale(
      isSigned ? transaction.value : value.abs().toString(),
      getMaxDecimalsForCurrency(transaction.currency),
      locale,
    )

    return [
      toDisplayDate(transaction.date, locale, { formatTo: dateFormat }),
      transaction.description,
      isSigned && value.gt(0) ? `+${amount}` : amount,
      getSubcategoryLabel(transaction.category),
    ]
  }

  return (
    <PreviewSection
      title={file.file.name}
      rowCount={parsedFile ? transactions.length : undefined}
      error={parsedFile ? null : t('DATA_PAGE.FILE_NOT_PARSED')}
    >
      <VirtualTable
        columns={columns}
        columnCount={columns.length}
        rowCount={transactions.length}
        getCells={getCells}
        scrollElement={scrollElement}
      />
    </PreviewSection>
  )
}

export default Component
