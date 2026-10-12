import { green, red } from '@mui/material/colors'

import type { NumberString, Transaction } from '@/types'
import { Big } from '@/lib/w-big'

export const getStats = (
  transactions: Transaction[],
): {
  totalIncome: NumberString
  totalExpense: NumberString
  profit: NumberString
  expenseRatio: NumberString
  profitMargin: NumberString
} => {
  const totalIncome = transactions.reduce((acc, transaction) => {
    const value = Big(transaction.value)
    return acc.plus(value.gt(0) ? value : Big(0))
  }, Big(0))

  const totalExpense = transactions.reduce((acc, transaction) => {
    const value = Big(transaction.value)
    return acc.plus(value.lt(0) ? value.abs() : Big(0))
  }, Big(0))

  const profit = totalIncome.minus(totalExpense)
  const profitMargin = totalIncome.gt(0) ? profit.div(totalIncome).times(100) : Big(0)
  const expenseRatio = totalIncome.gt(0) ? totalExpense.div(totalIncome).times(100) : Big(0)

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
