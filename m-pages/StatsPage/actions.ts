import type { BankSelectOption, ParsedStatsFile, SelectOptionBankAccountId, Transaction } from '@/types'
import { MISC } from '@/common'
import { getFileBankAccounts } from '@/m-stats-file/service'
import { getBankAccountCurrency } from '@/utils/Parser'
import { i18n } from '@/lib/i18n'

export const getCurrencyForSelection = (selectedId: SelectOptionBankAccountId, transactions: Transaction[]) => {
  if (!selectedId || selectedId === 'all') {
    return transactions.length ? transactions[0].currency : MISC.DEFAULT_CURRENCY
  }

  return getBankAccountCurrency(selectedId) ?? MISC.DEFAULT_CURRENCY
}

export const getBankSelectOptions = (selectedFiles: ParsedStatsFile[]): BankSelectOption[] => {
  const accounts = getFileBankAccounts(selectedFiles)
  const options: BankSelectOption[] = accounts.map((account) => ({
    value: account.bankAccountId,
    label: account.label,
  }))

  // Only add "All / Combined" when the accounts have exactly the same currency
  // TODO: Once we have currency conversion logic "All" should always be available
  if (accounts.length > 1) {
    const sameCurrency = accounts.every((account) => account.currency === accounts[0].currency)
    if (sameCurrency) {
      options.unshift({
        value: 'all',
        label: i18n.t('STATS_PAGE.ALL_ACCOUNTS'),
      })
    }
  }

  return options
}
