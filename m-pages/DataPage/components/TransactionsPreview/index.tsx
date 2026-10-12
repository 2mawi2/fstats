'use client'

import { FormControlLabel, Switch } from '@mui/material'
import { useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import type { StatsFile } from '@/types'
import { MISC } from '@/common'
import { isParsed } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { getMaxDecimalsForCurrency } from '@/utils/Currency'
import { toDisplayDate } from '@/utils/Date'
import { toFixedLocale, toFixedLocaleCurrency } from '@/utils/Number'
import { getSubcategoryLabel } from '@/utils/TransactionParser'
import { useTranslation } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

import { AmountFilter } from '../../actions'
import PreviewSection from '../PreviewSection'
import VirtualTable from '../VirtualTable'
import {
  filterTransactions,
  getSharedCurrency,
  getSourcedTransactions,
  getSourceLabel,
  getTransactionColumns,
} from './actions'

// Duplicates are shown greyed out
const DUPLICATE_ROW_STYLE = { opacity: 0.4 }

type TransactionsPreviewProps = {
  files: StatsFile[]
  amountFilter: AmountFilter
  scrollElement: HTMLElement | null
}

/**
 * Transactions of all files in a single table, with their source file when there is more than one.
 */
const Component = ({ files, amountFilter, scrollElement }: TransactionsPreviewProps) => {
  const { t } = useTranslation()
  const { locale, dateFormat } = useUserPreferences()
  const parsedFiles = useMemo(() => files.filter(isParsed), [files])
  const isCombined = parsedFiles.length > 1
  const currency = useMemo(() => getSharedCurrency(parsedFiles), [parsedFiles])
  const [showDuplicates, setShowDuplicates] = useLocalStorage(MISC.LS_DATA_SHOW_DUPLICATES_KEY, false, {
    initializeWithValue: false,
  })
  const allTransactions = useMemo(
    () => filterTransactions(getSourcedTransactions(parsedFiles), amountFilter),
    [parsedFiles, amountFilter],
  )
  const duplicateCount = useMemo(
    () => allTransactions.filter((transaction) => transaction.isDuplicate).length,
    [allTransactions],
  )
  const transactions = useMemo(
    () => (showDuplicates ? allTransactions : allTransactions.filter((transaction) => !transaction.isDuplicate)),
    [allTransactions, showDuplicates],
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
      actions={
        duplicateCount ? (
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showDuplicates}
                onChange={(event) => setShowDuplicates(event.target.checked)}
              />
            }
            label={t('DATA_PAGE.SHOW_DUPLICATES', { count: duplicateCount })}
            slotProps={{ typography: { variant: 'caption', color: 'text.secondary' } }}
            sx={{ mr: 0 }}
          />
        ) : null
      }
    >
      <VirtualTable
        columns={columns}
        columnCount={columns.length}
        rowCount={transactions.length}
        getCells={getCells}
        getRowStyle={(index) => (transactions[index].isDuplicate ? DUPLICATE_ROW_STYLE : undefined)}
        scrollElement={scrollElement}
      />
    </PreviewSection>
  )
}

export default Component
