import type { Transaction } from '@/types'
import { MISC } from '@/common'

// TODO: Once we have currency conversion logic, convert files with different currencies
export const getCurrency = (transactions: Transaction[]) => {
  return transactions.length ? transactions[0].currency : MISC.DEFAULT_CURRENCY
}
