import { InfoOutlined } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import type { TFunction } from 'i18next'
import { groupBy, uniq } from 'lodash'

import type { ParsedStatsFile, Transaction } from '@/types'
import type { Currency } from '@/types-enums'
import { getFileCurrency, getFileTransactions, getUniqueTransactions } from '@/m-stats-file/service'
import { getCurrencySymbol } from '@/utils/Currency'

import { AmountFilter } from '../../actions'
import type { VirtualTableColumn } from '../VirtualTable'

// Equal width digits, so numbers align across rows
const TABULAR_NUMS = { fontVariantNumeric: 'tabular-nums' } as const

export type SourcedTransaction = Transaction & {
  /**
   * Name of the file the transaction is from.
   */
  source: string
  /**
   * Names of all files containing the transaction, in file order.
   */
  sources: string[]
  /**
   * The same transaction is also in an earlier file (e.g. overlapping statements).
   */
  isDuplicate: boolean
}

/**
 * Transactions of all files in a single list, sorted by date. Stable, so the order within a file is kept for equal
 * dates. The first occurrence of a transaction in multiple files is the original, the others are duplicates.
 */
export const getSourcedTransactions = (files: ParsedStatsFile[]): SourcedTransaction[] => {
  const transactions = files.flatMap((file) =>
    getFileTransactions(file).map((transaction) => ({ ...transaction, source: file.file.name })),
  )
  const originals = new Set(getUniqueTransactions(transactions))
  const sourcesById = groupBy(transactions, 'id')

  return transactions
    .map((transaction) => ({
      ...transaction,
      sources: sourcesById[transaction.id].map(({ source }) => source),
      isDuplicate: !originals.has(transaction),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/**
 * Tooltip of the source column: the file, and where else the transaction is.
 */
export const getSourceLabel = ({ source, sources, isDuplicate }: SourcedTransaction, t: TFunction) => {
  if (isDuplicate) {
    return `${source}\n${t('DATA_PAGE.DUPLICATE_OF', { file: sources[0] })}`
  }

  const otherSources = sources.filter((name) => name !== source)
  return otherSources.length ? `${source}\n${t('DATA_PAGE.ALSO_IN', { files: otherSources.join(', ') })}` : source
}

/**
 * The shared currency of all files, or `null` if they are mixed.
 */
export const getSharedCurrency = (files: ParsedStatsFile[]): Currency | null => {
  const currencies = uniq(files.map(getFileCurrency))
  return currencies.length === 1 ? currencies[0] : null
}

export const getTransactionColumns = (
  currency: Currency | null,
  showSource: boolean,
  amountFilter: AmountFilter,
  t: TFunction,
): VirtualTableColumn[] => [
  { label: t('MISC.DATE'), width: 100, getStyle: () => TABULAR_NUMS },
  { label: t('MISC.DESCRIPTION'), width: 320 },
  {
    // Mixed currencies show the symbol per amount instead
    label: currency ? t('MISC.AMOUNT_WITH_CURRENCY', { currency: getCurrencySymbol(currency) }) : t('MISC.AMOUNT'),
    width: 120,
    align: 'right',
    // Only highlight money in when both directions are shown
    getStyle: (value) =>
      amountFilter === AmountFilter.ALL && value.startsWith('+') ? { ...TABULAR_NUMS, fontWeight: 600 } : TABULAR_NUMS,
  },
  { label: t('MISC.CATEGORY'), width: 160 },
  ...(showSource
    ? [
        {
          label: t('MISC.SOURCE'),
          fixedWidth: 32,
          hideLabel: true,
          align: 'center' as const,
          renderCell: (source: string) => (
            <Tooltip title={<Box sx={{ whiteSpace: 'pre-line' }}>{source}</Box>} placement="left">
              <InfoOutlined sx={{ display: 'block', mx: 'auto', fontSize: 14, color: 'text.secondary' }} />
            </Tooltip>
          ),
        },
      ]
    : []),
]
