import { uniqBy } from 'lodash'

import type { BankSelectOption, ParsedStatsFile, SelectOptionBankAccountId, Transaction } from '@/types'
import { MISC } from '@/common'
import { AVAILABLE_PARSERS, getBankAccountName } from '@/utils/Parser'
import { i18n } from '@/lib/i18n'

export const getCurrencyForSelection = (selectedId: SelectOptionBankAccountId, transactions: Transaction[]) => {
  if (!selectedId || selectedId === 'all') {
    return transactions.length ? transactions[0].currency : MISC.DEFAULT_CURRENCY
  }

  const parser = Object.values(AVAILABLE_PARSERS).find((parser) => parser.bankAccountId === selectedId)

  return parser?.currency ?? MISC.DEFAULT_CURRENCY
}

export const getBankSelectOptions = (selectedFiles: ParsedStatsFile[]): BankSelectOption[] => {
  const banks = selectedFiles.map((file) => {
    const parser = AVAILABLE_PARSERS[file.parserId]
    return {
      bankAccountId: parser.bankAccountId,
      label: getBankAccountName(file.parserId).alt,
      currency: parser.currency,
    }
  })

  const uniqueBanks = uniqBy(banks, 'bankAccountId')

  const options: BankSelectOption[] = uniqueBanks.map((bank) => ({
    value: bank.bankAccountId,
    label: bank.label,
  }))

  options.sort((a, b) => a.value.localeCompare(b.value))

  // Only add "All / Combined" when uniqueBanks have exactly the same currency
  // TODO: Once we have currency conversion logic "All" should always be available
  if (uniqueBanks.length > 1) {
    const sameCurrency = uniqueBanks.every((bank) => bank.currency === uniqueBanks[0].currency)
    if (sameCurrency) {
      options.unshift({
        value: 'all',
        label: i18n.t('STATS_PAGE.ALL_ACCOUNTS'),
      })
    }
  }

  return options
}
