import { green, red } from '@mui/material/colors'

import type { NumberString, Transaction } from '@/types'
import type { BigSource } from '@/lib/w-big'
import { Big } from '@/lib/w-big'

type HasValue = Pick<Transaction, 'value'>

export const isIncome = (transaction: HasValue): boolean => {
  return Big(transaction.value).gt(0)
}

export const isExpense = (transaction: HasValue): boolean => {
  return Big(transaction.value).lt(0)
}

export const sumValues = (transactions: HasValue[]): Big => {
  return transactions.reduce((acc, transaction) => acc.plus(transaction.value), Big(0))
}

/**
 * `part` as a percentage of `total`, or 0 if `total` is 0.
 */
export const getPercentage = (part: BigSource, total: BigSource): Big => {
  return Big(total).eq(0) ? Big(0) : Big(part).div(total).times(100)
}

export const getStats = (
  transactions: Transaction[],
): {
  totalIncome: NumberString
  totalExpense: NumberString
  profit: NumberString
  expenseRatio: NumberString
  profitMargin: NumberString
} => {
  const totalIncome = sumValues(transactions.filter(isIncome))
  const totalExpense = sumValues(transactions.filter(isExpense)).abs()
  const profit = totalIncome.minus(totalExpense)
  const profitMargin = getPercentage(profit, totalIncome)
  const expenseRatio = getPercentage(totalExpense, totalIncome)

  return {
    totalIncome: totalIncome.toString(),
    totalExpense: totalExpense.toString(),
    profit: profit.toString(),
    profitMargin: profitMargin.toString(),
    expenseRatio: expenseRatio.toString(),
  }
}

export const getProfitLossColors = (
  hasProfit: boolean,
  isDarkMode: boolean,
): {
  incomeTextColor: string
  incomeBgColor: string
  expensesTextColor: string
  expensesBgColor: string
  profitTextColor: string
  profitBgColor: string
} => {
  const incomeTextColor = 'primary.main'
  const incomeBgColor = isDarkMode ? 'rgba(76, 175, 80, 0.08)' : green[50]

  const expensesBgColor = isDarkMode ? 'rgba(244, 67, 54, 0.08)' : red[50]
  const expensesTextColor = isDarkMode ? red[400] : red[700]

  const profitBgColor = hasProfit ? incomeBgColor : expensesBgColor
  const profitTextColor = hasProfit ? 'success.main' : 'error.main'

  return {
    incomeTextColor,
    incomeBgColor,
    expensesTextColor,
    expensesBgColor,
    profitTextColor,
    profitBgColor,
  }
}
