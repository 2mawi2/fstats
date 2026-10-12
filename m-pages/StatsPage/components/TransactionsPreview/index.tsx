'use client'

import { useMemo } from 'react'

import type { StatsFile } from '@/types'
import { isParsed } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { toDisplayDate } from '@/utils/Date'
import { toFixedLocaleAmount, toFixedLocaleCurrency } from '@/utils/Number'
import { getSubcategoryLabel } from '@/utils/TransactionParser'
import { useTranslation } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

import { AmountFilter, filterTransactions } from '../../actions'
import FileMessage from '../FileMessage'
import PreviewSection from '../PreviewSection'
import { STICKY_HEADER_OFFSET } from '../PreviewSection/actions'
import VirtualTable from '../VirtualTable'
import { getSharedCurrency, getSourcedTransactions, getSourceLabel, getTransactionColumns } from './actions'

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
  // Shown on its own, with its status when it couldn't be parsed
  const singleFile = isCombined ? undefined : (parsedFiles[0] ?? files[0])
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
    // Signs are redundant when only one direction is shown
    const isSigned = amountFilter === AmountFilter.ALL
    const displayValue = isSigned ? transaction.value : Big(transaction.value).abs().toString()
    const formatAmount = currency ? toFixedLocaleAmount : toFixedLocaleCurrency
    const amount = formatAmount(displayValue, transaction.currency, locale, { showPlusSign: isSigned })

    return [
      toDisplayDate(transaction.date, locale, { formatTo: dateFormat }),
      transaction.description,
      amount,
      getSubcategoryLabel(transaction.category),
      ...(isCombined ? [getSourceLabel(transaction, t)] : []),
    ]
  }

  return (
    <PreviewSection
      title={singleFile ? singleFile.file.name : t('MISC.ALL_TRANSACTIONS')}
      file={singleFile}
      rowCount={parsedFiles.length ? transactions.length : undefined}
      // A single table, so its title and header row can stay in view
      isSticky={isCombined}
    >
      {parsedFiles.length ? (
        <VirtualTable
          columns={columns}
          columnCount={columns.length}
          rowCount={transactions.length}
          getCells={getCells}
          stickyHeaderTop={isCombined ? STICKY_HEADER_OFFSET : undefined}
          getRowStyle={(index) => (transactions[index].isDuplicate ? DUPLICATE_ROW_STYLE : undefined)}
          scrollElement={scrollElement}
        />
      ) : (
        <FileMessage file={files[0]} message={t('STATS_PAGE.DATA_VIEW.FILE_NOT_PARSED')} />
      )}
    </PreviewSection>
  )
}

export default Component
