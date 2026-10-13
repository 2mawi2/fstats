'use client'

import { useMemo } from 'react'

import type { StatsFile } from '@/types'
import { isParsed } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { getTransactionDay, toDisplayDate } from '@/utils/Date'
import { toFixedLocaleAmount, toFixedLocaleCurrency } from '@/utils/Number'
import { getSubcategoryLabel } from '@/utils/TransactionParser'
import { useTranslation } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

import { AmountFilter, filterTransactions, getTransactionCounts, getTransactionCountText } from '../../actions'
import { useWorkspaceDayFilter } from '../../context'
import FileMessage from '../FileMessage'
import PreviewSection from '../PreviewSection'
import { STICKY_HEADER_OFFSET } from '../PreviewSection/actions'
import VirtualTable from '../VirtualTable'
import { getSharedCurrency, getSourcedTransactions, getSourceLabel, getTransactionColumns } from './actions'

// On days deselected in the date explorer
const DESELECTED_ROW_STYLE = { opacity: 0.4 }
// Also struck through, the same transaction as one in an earlier file
const DUPLICATE_ROW_STYLE = { opacity: 0.4, textDecoration: 'line-through' }

type TransactionsPreviewProps = {
  files: StatsFile[]
  amountFilter: AmountFilter
  includeDuplicates: boolean
  /**
   * Transactions on days deselected in the date explorer are greyed out, otherwise hidden.
   */
  includeDateExcluded: boolean
  scrollElement: HTMLElement | null
}

/**
 * Transactions of all files in a single table, with their source file when there is more than one.
 */
const Component = ({
  files,
  amountFilter,
  includeDuplicates,
  includeDateExcluded,
  scrollElement,
}: TransactionsPreviewProps) => {
  const { t } = useTranslation()
  const { locale, dateFormat } = useUserPreferences()
  const { deselectedDays } = useWorkspaceDayFilter()
  const parsedFiles = useMemo(() => files.filter(isParsed), [files])
  const isCombined = parsedFiles.length > 1
  // Shown on its own, with its status when it couldn't be parsed
  const singleFile = isCombined ? undefined : (parsedFiles[0] ?? files[0])
  const currency = useMemo(() => getSharedCurrency(parsedFiles), [parsedFiles])
  const allTransactions = useMemo(
    () => filterTransactions(getSourcedTransactions(parsedFiles), amountFilter),
    [parsedFiles, amountFilter],
  )
  const shownTransactions = useMemo(
    () => (includeDuplicates ? allTransactions : allTransactions.filter((transaction) => !transaction.isDuplicate)),
    [allTransactions, includeDuplicates],
  )
  const counts = useMemo(() => getTransactionCounts(allTransactions, deselectedDays), [allTransactions, deselectedDays])
  const transactions = useMemo(
    () =>
      includeDateExcluded
        ? shownTransactions
        : shownTransactions.filter((transaction) => !deselectedDays.has(getTransactionDay(transaction))),
    [shownTransactions, includeDateExcluded, deselectedDays],
  )
  const columns = useMemo(
    () =>
      getTransactionColumns(
        currency,
        isCombined,
        amountFilter,
        t,
        transactions.some((transaction) => transaction.isDuplicate)
          ? (rowIndex) => transactions[rowIndex].isDuplicate
          : undefined,
      ),
    [currency, isCombined, amountFilter, t, transactions],
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
      // Like everywhere else, those greyed out or struck through aren't counted
      caption={parsedFiles.length ? getTransactionCountText(counts) : undefined}
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
          getRowStyle={(index) =>
            transactions[index].isDuplicate
              ? DUPLICATE_ROW_STYLE
              : deselectedDays.has(getTransactionDay(transactions[index]))
                ? DESELECTED_ROW_STYLE
                : undefined
          }
          scrollElement={scrollElement}
        />
      ) : (
        <FileMessage file={files[0]} message={t('STATS_PAGE.DATA_VIEW.FILE_NOT_PARSED')} />
      )}
    </PreviewSection>
  )
}

export default Component
