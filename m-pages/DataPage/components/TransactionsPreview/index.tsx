'use client'

import { useMemo } from 'react'

import type { StatsFile } from '@/types'
import { isParsed } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { getMaxDecimalsForCurrency } from '@/utils/Currency'
import { toDisplayDate } from '@/utils/Date'
import { toFixedLocale, toFixedLocaleCurrency } from '@/utils/Number'
import { getSubcategoryLabel } from '@/utils/TransactionParser'
import { useTranslation } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

import { AmountFilter, filterTransactions } from '../../actions'
import PreviewSection from '../PreviewSection'
import { STICKY_HEADER_OFFSET } from '../PreviewSection/actions'
import VirtualTable from '../VirtualTable'
import { getSharedCurrency, getSourcedTransactions, getSourceLabel, getTransactionColumns } from './actions'

// Duplicates are shown greyed out
const DUPLICATE_ROW_STYLE = { opacity: 0.4 }

type TransactionsPreviewProps = {
  files: StatsFile[]
  amountFilter: AmountFilter
  includeDuplicates: boolean
  scrollElement: HTMLElement | null
}

/**
 * Transactions of all files in a single table, with their source file when there is more than one.
 */
const Component = ({ files, amountFilter, includeDuplicates, scrollElement }: TransactionsPreviewProps) => {
  const { t } = useTranslation()
  const { locale, dateFormat } = useUserPreferences()
  const parsedFiles = useMemo(() => files.filter(isParsed), [files])
  const isCombined = parsedFiles.length > 1
  const currency = useMemo(() => getSharedCurrency(parsedFiles), [parsedFiles])
  const allTransactions = useMemo(
    () => filterTransactions(getSourcedTransactions(parsedFiles), amountFilter),
    [parsedFiles, amountFilter],
  )
  const transactions = useMemo(
    () => (includeDuplicates ? allTransactions : allTransactions.filter((transaction) => !transaction.isDuplicate)),
    [allTransactions, includeDuplicates],
  )
  const columns = useMemo(
    () => getTransactionColumns(currency, isCombined, amountFilter, t),
    [currency, isCombined, amountFilter, t],
  )

  const getCells = (index: number) => {
    const transaction = transactions[index]
    const value = Big(transaction.value)
    // Signs are redundant when only one direction is shown
    const isSigned = amountFilter === AmountFilter.ALL
    const displayValue = isSigned ? transaction.value : value.abs().toString()
    const amount = currency
      ? toFixedLocale(displayValue, getMaxDecimalsForCurrency(transaction.currency), locale)
      : toFixedLocaleCurrency(displayValue, transaction.currency, locale)

    return [
      toDisplayDate(transaction.date, locale, { formatTo: dateFormat }),
      transaction.description,
      isSigned && value.gt(0) ? `+${amount}` : amount,
      getSubcategoryLabel(transaction.category),
      ...(isCombined ? [getSourceLabel(transaction, t)] : []),
    ]
  }

  return (
    <PreviewSection
      title={isCombined ? t('DATA_PAGE.ALL_TRANSACTIONS') : (parsedFiles[0] ?? files[0]).file.name}
      rowCount={parsedFiles.length ? transactions.length : undefined}
      error={parsedFiles.length ? null : t('DATA_PAGE.FILE_NOT_PARSED')}
      // A single table, so its title and header row can stay in view
      isSticky={isCombined}
    >
      <VirtualTable
        columns={columns}
        columnCount={columns.length}
        rowCount={transactions.length}
        getCells={getCells}
        stickyHeaderTop={isCombined ? STICKY_HEADER_OFFSET : undefined}
        getRowStyle={(index) => (transactions[index].isDuplicate ? DUPLICATE_ROW_STYLE : undefined)}
        scrollElement={scrollElement}
      />
    </PreviewSection>
  )
}

export default Component
