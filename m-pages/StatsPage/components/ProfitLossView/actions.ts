import type { TFunction } from 'i18next'
import { groupBy, sortBy } from 'lodash'

import type { CategoryCode, NumberString, ParsedStatsFile, Transaction } from '@/types'
import type { Currency, UserLocale } from '@/types-enums'
import { EXPENSE_CATEGORIES } from '@/common'
import { splitDuplicates } from '@/m-stats-file/service'
import { getTransactionDay, toDisplayDate } from '@/utils/Date'
import type { BankAccountId } from '@/utils/Parser'
import { getBankAccountId } from '@/utils/Parser'
import { getPercentage, isExpense, isIncome, sumValues } from '@/utils/Stats'
import { getCategoryLabel, getParentCategoryCode } from '@/utils/TransactionParser'
import { i18n } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

export const BreakdownPeriod = {
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
} as const

export type BreakdownPeriod = (typeof BreakdownPeriod)[keyof typeof BreakdownPeriod]

export const getBreakdownPeriodOptions = () => [
  { value: BreakdownPeriod.MONTH, label: i18n.t('STATS_PAGE.PROFIT_LOSS.PERIOD.MONTH') },
  { value: BreakdownPeriod.QUARTER, label: i18n.t('STATS_PAGE.PROFIT_LOSS.PERIOD.QUARTER') },
  { value: BreakdownPeriod.YEAR, label: i18n.t('STATS_PAGE.PROFIT_LOSS.PERIOD.YEAR') },
]

/**
 * Categorised as an internal transfer by the keyword rules.
 */
const TRANSFER_CATEGORIES: CategoryCode[] = ['TFI_01', 'TFO_01']

const UNCATEGORISED_CATEGORIES: CategoryCode[] = ['TFI_02', 'TFO_02']

/**
 * Bank transfers can take a few days, e.g. over a weekend.
 */
export const TRANSFER_MAX_DAYS = 3

const DAY_MS = 24 * 60 * 60 * 1000

export type AccountTransaction = Transaction & { bankAccountId: BankAccountId }

/**
 * Transactions of the files without duplicates, with the bank account of their section.
 */
export const getAccountTransactions = (files: ParsedStatsFile[]): AccountTransaction[] => {
  const transactions = files.flatMap((file) =>
    file.sections.flatMap((section) =>
      section.transactions.map((transaction) => ({
        ...transaction,
        bankAccountId: getBankAccountId(section.parserId),
      })),
    ),
  )

  return splitDuplicates(transactions).unique
}

const getDayDiff = (a: Transaction, b: Transaction) => {
  return Math.abs(Date.parse(getTransactionDay(a)) - Date.parse(getTransactionDay(b))) / DAY_MS
}

/**
 * Transfers between own accounts, which are neither income nor expenses: those categorised as such, and pairs of
 * opposite amounts in different accounts of the same currency at most `TRANSFER_MAX_DAYS` apart (closest first).
 */
export const splitTransfers = <T extends AccountTransaction>(transactions: T[]) => {
  const transferIds = new Set(
    transactions
      .filter((transaction) => transaction.category && TRANSFER_CATEGORIES.includes(transaction.category))
      .map((transaction) => transaction.id),
  )
  const getMatchKey = (transaction: T) => `${transaction.currency}|${Big(transaction.value).abs().toString()}`
  const incomingByKey = groupBy(transactions.filter(isIncome), getMatchKey)
  // Each transaction is paired at most once, categorised transfers too (with their uncategorised counterpart)
  const pairedIds = new Set<string>()

  sortBy(transactions.filter(isExpense), (transaction) => transaction.date).forEach((outgoing) => {
    const [match] = sortBy(
      (incomingByKey[getMatchKey(outgoing)] ?? []).filter(
        (incoming) =>
          incoming.bankAccountId !== outgoing.bankAccountId &&
          !pairedIds.has(incoming.id) &&
          getDayDiff(incoming, outgoing) <= TRANSFER_MAX_DAYS,
      ),
      (incoming) => getDayDiff(incoming, outgoing),
    )

    if (match) {
      pairedIds.add(outgoing.id)
      pairedIds.add(match.id)
      transferIds.add(outgoing.id)
      transferIds.add(match.id)
    }
  })

  return {
    transactions: transactions.filter((transaction) => !transferIds.has(transaction.id)),
    transfers: transactions.filter((transaction) => transferIds.has(transaction.id)),
  }
}

/**
 * E.g. "2026-03", "2026-Q1" or "2026", sortable as strings.
 */
export const getPeriodKey = (transaction: Pick<Transaction, 'date'>, period: BreakdownPeriod) => {
  const day = getTransactionDay(transaction)

  switch (period) {
    case BreakdownPeriod.YEAR:
      return day.slice(0, 4)
    case BreakdownPeriod.QUARTER:
      return `${day.slice(0, 4)}-Q${Math.ceil(Number(day.slice(5, 7)) / 3)}`
    default:
      return day.slice(0, 7)
  }
}

export const getPeriodLabel = (key: string, period: BreakdownPeriod, locale: UserLocale) => {
  switch (period) {
    case BreakdownPeriod.YEAR:
      return key
    case BreakdownPeriod.QUARTER:
      return `${key.slice(5)} ${key.slice(0, 4)}`
    default:
      return toDisplayDate(`${key}-01`, locale, { formatFrom: 'yyyy-MM-dd', formatTo: 'MMM yyyy' })
  }
}

export type ProfitLossRow = {
  key: string
  label: string
  /**
   * By period key, periods without transactions are missing.
   */
  values: Record<string, NumberString>
  total: NumberString
  children: ProfitLossRow[]
  /**
   * Only rows of a single transaction.
   */
  date?: string
}

/**
 * Sums of the transactions per period, negated for expenses so they're shown as positive amounts.
 */
const toRow = (
  key: string,
  label: string,
  transactions: Transaction[],
  period: BreakdownPeriod,
  { negate = false, children = [] }: { negate?: boolean; children?: ProfitLossRow[] } = {},
): ProfitLossRow => {
  const sign = negate ? -1 : 1
  const byPeriod = groupBy(transactions, (transaction) => getPeriodKey(transaction, period))
  const values = Object.fromEntries(
    Object.entries(byPeriod).map(([periodKey, items]) => [periodKey, sumValues(items).times(sign).toString()]),
  )

  return { key, label, values, total: sumValues(transactions).times(sign).toString(), children }
}

/**
 * Largest first.
 */
const sortRows = (rows: ProfitLossRow[]) => {
  return [...rows].sort((a, b) => Big(b.total).abs().cmp(Big(a.total).abs()) || a.label.localeCompare(b.label))
}

const isUncategorised = (transaction: Transaction) => {
  return !transaction.category || UNCATEGORISED_CATEGORIES.includes(transaction.category)
}

/**
 * One row per parent category (expandable to its subcategories), uncategorised transactions last.
 */
const getCategoryRows = (transactions: Transaction[], period: BreakdownPeriod, negate: boolean, t: TFunction) => {
  const uncategorised = transactions.filter(isUncategorised)
  const byParent = groupBy(
    transactions.filter((transaction) => !isUncategorised(transaction)),
    (transaction) => getParentCategoryCode(transaction.category!),
  )

  const rows = Object.entries(byParent).map(([parentCode, items]) => {
    const children = Object.entries(groupBy(items, (transaction) => transaction.category)).map(([code, subItems]) =>
      toRow(code, getCategoryLabel(code, t), subItems, period, { negate }),
    )

    return toRow(parentCode, getCategoryLabel(parentCode, t), items, period, { negate, children: sortRows(children) })
  })

  return [
    ...sortRows(rows),
    ...(uncategorised.length
      ? [toRow('uncategorised', t('STATS_PAGE.PROFIT_LOSS.UNCATEGORISED'), uncategorised, period, { negate })]
      : []),
  ]
}

const isExpenseCategory = (transaction: Transaction) => {
  return transaction.category
    ? getParentCategoryCode(transaction.category) in EXPENSE_CATEGORIES
    : isExpense(transaction)
}

/**
 * The transfers as one row per transaction, by date.
 */
const getTransferRows = (transfers: Transaction[], period: BreakdownPeriod) => {
  return sortBy(transfers, (transaction) => transaction.date).map((transaction) => ({
    ...toRow(transaction.id, transaction.description, [transaction], period),
    date: transaction.date,
  }))
}

/**
 * Net result as a percentage of the income, `undefined` without income.
 */
export const getNetMargin = (net: NumberString | undefined, income: NumberString | undefined) => {
  return income === undefined || Big(income).eq(0) ? undefined : getPercentage(net ?? '0', income).toString()
}

export type ProfitLoss = {
  currency: Currency
  /**
   * Period keys with transactions (or transfers), oldest first.
   */
  periods: string[]
  income: { rows: ProfitLossRow[]; total: ProfitLossRow }
  expenses: { rows: ProfitLossRow[]; total: ProfitLossRow }
  net: ProfitLossRow
  /**
   * Of the net result, per period (missing without income) and in total.
   */
  netMargin: { values: Record<string, NumberString>; total?: NumberString }
  transfers: { incoming: ProfitLossRow; outgoing: ProfitLossRow; net: ProfitLossRow; count: number }
}

/**
 * Income statement of the transactions (without duplicates, see `getAccountTransactions`) per period, one per currency
 * as amounts in different currencies can't be summed up. Transfers between own accounts are excluded from it, but
 * listed separately.
 */
export const getProfitLoss = (
  accountTransactions: AccountTransaction[],
  period: BreakdownPeriod,
  t: TFunction,
): ProfitLoss[] => {
  const byCurrency = groupBy(accountTransactions, (transaction) => transaction.currency)

  return Object.entries(byCurrency).map(([currency, currencyTransactions]) => {
    const { transactions, transfers } = splitTransfers(currencyTransactions)
    const expenses = transactions.filter(isExpenseCategory)
    const income = transactions.filter((transaction) => !isExpenseCategory(transaction))
    const incomingTransfers = transfers.filter(isIncome)
    const outgoingTransfers = transfers.filter((transaction) => !isIncome(transaction))
    const periods = Object.keys(
      groupBy(currencyTransactions, (transaction) => getPeriodKey(transaction, period)),
    ).sort()

    const incomeTotal = toRow('income', t('STATS_PAGE.PROFIT_LOSS.TOTAL_INCOME'), income, period)
    const net = toRow('net', t('STATS_PAGE.PROFIT_LOSS.NET'), transactions, period)
    const netMargins = periods.flatMap((periodKey) => {
      const rate = getNetMargin(net.values[periodKey], incomeTotal.values[periodKey])
      return rate === undefined ? [] : [[periodKey, rate]]
    })

    return {
      currency: currency as Currency,
      periods,
      income: {
        rows: getCategoryRows(income, period, false, t),
        total: incomeTotal,
      },
      expenses: {
        rows: getCategoryRows(expenses, period, true, t),
        total: toRow('expenses', t('STATS_PAGE.PROFIT_LOSS.TOTAL_EXPENSES'), expenses, period, {
          negate: true,
        }),
      },
      net,
      netMargin: {
        values: Object.fromEntries(netMargins),
        total: getNetMargin(net.total, incomeTotal.total),
      },
      transfers: {
        incoming: toRow('transfersIn', t('STATS_PAGE.PROFIT_LOSS.TRANSFERS_IN'), incomingTransfers, period, {
          children: getTransferRows(incomingTransfers, period),
        }),
        outgoing: toRow('transfersOut', t('STATS_PAGE.PROFIT_LOSS.TRANSFERS_OUT'), outgoingTransfers, period, {
          children: getTransferRows(outgoingTransfers, period),
        }),
        net: toRow('transfersNet', t('STATS_PAGE.PROFIT_LOSS.TRANSFERS_NET'), transfers, period),
        count: transfers.length,
      },
    }
  })
}
