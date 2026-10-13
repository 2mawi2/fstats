import { InfoOutlined } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import type { TFunction } from 'i18next'
import { groupBy, uniq } from 'lodash'

import type { ParsedStatsFile, Transaction } from '@/types'
import type { Currency } from '@/types-enums'
import { getFileCurrency, getFileTransactions, splitDuplicates } from '@/m-stats-file/service'
import { getCurrencySymbol } from '@/utils/Currency'

import { AmountFilter } from '../../actions'
import type { VirtualTableColumn } from '../VirtualTable'

// Equal width digits, so numbers align across rows
const TABULAR_NUMS = { fontVariantNumeric: 'tabular-nums' } as const

// Same as the bank chip of the file rows. Inline block, so the strikethrough of the row doesn't reach it
const DUPLICATE_TAG_SX = {
  display: 'inline-block',
  px: 0.75,
  cursor: 'default',
  border: 1,
  borderColor: 'divider',
  borderRadius: '10px',
  fontSize: 11,
  lineHeight: '16px',
  color: 'text.secondary',
} as const

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
          fixedWidth: isDuplicate ? 84 : 32,
          hideLabel: true,
          align: 'right' as const,
          renderCell: (source: string, rowIndex: number) => (
            // Duplicates show a tag instead of the icon, with the same tooltip
            <Tooltip title={<Box sx={{ whiteSpace: 'pre-line' }}>{source}</Box>} placement="left">
              {isDuplicate?.(rowIndex) ? (
                <Box component="span" sx={DUPLICATE_TAG_SX}>
                  {t('STATS_PAGE.DATA_VIEW.DUPLICATE_TAG')}
                </Box>
              ) : (
                <InfoOutlined sx={{ display: 'block', ml: 'auto', fontSize: 14, color: 'text.secondary' }} />
              )}
            </Tooltip>
          ),
        },
      ]
    : []),
]
