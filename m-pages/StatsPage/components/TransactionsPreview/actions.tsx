import { InfoOutlined } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import type { TFunction } from 'i18next'
import { groupBy, uniq } from 'lodash'

import type { ParsedStatsFile, Transaction } from '@/types'
import type { Currency, DateFormat, UserLocale } from '@/types-enums'
import { getFileCurrency, getFileTransactions, splitDuplicates } from '@/m-stats-file/service'
import { getCurrencySymbol } from '@/utils/Currency'
import { toDisplayDate } from '@/utils/Date'
import { toFixedLocaleAmount, toFixedLocaleCurrency } from '@/utils/Number'
import { getSubcategoryLabel } from '@/utils/TransactionParser'
import { Big } from '@/lib/w-big'

import { AmountFilter } from '../../actions'
import type { VirtualTableColumn } from '../VirtualTable'

// Equal width digits, so numbers align across rows
const TABULAR_NUMS = { fontVariantNumeric: 'tabular-nums' } as const

// Same as the bank chip of the file rows, with the info icon. Inline flex, so the strikethrough of the row doesn't
// reach it
const DUPLICATE_TAG_SX = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  pl: 0.75,
  pr: '4px',
  // Into the cell padding, so the icon lines up with those of the other rows (padding and border)
  mr: '-5px',
  cursor: 'default',
  border: 1,
  borderColor: 'divider',
  borderRadius: '10px',
  fontSize: 11,
  lineHeight: '16px',
  color: 'text.secondary',
} as const

const INFO_ICON_SX = { display: 'block', fontSize: 14, color: 'text.secondary' } as const

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
 * Transactions of all files in a single list, newest first like the date explorer. Stable, so the order of files is
 * kept for equal dates. The first occurrence of a transaction in multiple files is the original, the others are
 * duplicates.
 */
export const getSourcedTransactions = (files: ParsedStatsFile[]): SourcedTransaction[] => {
  const transactions = files.flatMap((file) =>
    getFileTransactions(file).map((transaction) => ({ ...transaction, source: file.file.name })),
  )
  const duplicates = new Set(splitDuplicates(transactions).duplicates)
  const sourcesById = groupBy(transactions, 'id')

  return transactions
    .map((transaction) => ({
      ...transaction,
      sources: sourcesById[transaction.id].map(({ source }) => source),
      isDuplicate: duplicates.has(transaction),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Tooltip of the source column: the file, and where else the transaction is.
 */
export const getSourceLabel = ({ source, sources, isDuplicate }: SourcedTransaction, t: TFunction) => {
  if (isDuplicate) {
    return `${source}\n${t('STATS_PAGE.DATA_VIEW.DUPLICATE_OF', { file: sources[0] })}`
  }

  const otherSources = sources.filter((name) => name !== source)
  return otherSources.length
    ? `${source}\n${t('STATS_PAGE.DATA_VIEW.ALSO_IN', { files: otherSources.join(', ') })}`
    : source
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
  /**
   * Shows a "Duplicate" tag next to the source of duplicates, only when some are shown.
   */
  isDuplicate?: (rowIndex: number) => boolean,
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
          fixedWidth: isDuplicate ? 96 : 32,
          hideLabel: true,
          align: 'right' as const,
          renderCell: (source: string, rowIndex: number) => (
            // Duplicates show a tag with the icon
            <Tooltip title={<Box sx={{ whiteSpace: 'pre-line' }}>{source}</Box>} placement="left">
              {isDuplicate?.(rowIndex) ? (
                <Box component="span" sx={DUPLICATE_TAG_SX}>
                  {t('STATS_PAGE.DATA_VIEW.DUPLICATE_TAG')}
                  <InfoOutlined sx={INFO_ICON_SX} />
                </Box>
              ) : (
                <InfoOutlined sx={{ ...INFO_ICON_SX, ml: 'auto' }} />
              )}
            </Tooltip>
          ),
        },
      ]
    : []),
]

/**
 * Shown values of the transaction, without the source (only a tooltip).
 */
export const getTransactionCells = (
  transaction: SourcedTransaction,
  {
    currency,
    amountFilter,
    locale,
    dateFormat,
  }: { currency: Currency | null; amountFilter: AmountFilter; locale: UserLocale; dateFormat: DateFormat },
) => {
  // Signs are redundant when only one direction is shown
  const isSigned = amountFilter === AmountFilter.ALL
  const displayValue = isSigned ? transaction.value : Big(transaction.value).abs().toString()
  // Mixed currencies show the symbol per amount
  const formatAmount = currency ? toFixedLocaleAmount : toFixedLocaleCurrency

  return [
    toDisplayDate(transaction.date, locale, { formatTo: dateFormat }),
    transaction.description,
    formatAmount(displayValue, transaction.currency, locale, { showPlusSign: isSigned }),
    getSubcategoryLabel(transaction.category),
  ]
}
