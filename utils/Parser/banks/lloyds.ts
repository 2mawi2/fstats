import { AccountType, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const lloyds = defineBank({
  id: 'lloyds',
  name: 'Lloyds',
  currency: Currency.GBP,
  formats: [
    {
      accountType: AccountType.CURRENT,
      accountName: 'Current Account',
      version: '1',
      dateFormat: 'dd/MM/yyyy',
      headers: [
        'Transaction Date',
        'Transaction Type',
        'Sort Code',
        'Account Number',
        'Transaction Description',
        'Debit Amount',
        'Credit Amount',
        'Balance',
      ],
      columns: {
        date: 'Transaction Date',
        description: 'Transaction Description',
        amount: { type: 'inOut', in: 'Credit Amount', out: 'Debit Amount' },
      },
      extraColumns: {
        balance: 'Balance',
        transactionType: 'Transaction Type',
      },
    },
  ],
})
