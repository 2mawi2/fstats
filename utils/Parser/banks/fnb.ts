import { AccountType, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const fnb = defineBank({
  id: 'fnb',
  name: 'FNB',
  currency: Currency.ZAR,
  formats: [
    {
      accountType: AccountType.CREDIT_CARD,
      accountName: 'Credit Card',
      version: '1',
      dateFormat: 'yyyy/MM/dd',
      headers: ['Date', 'Amount', 'Balance', 'Description'],
      columns: {
        date: 'Date',
        description: 'Description',
        amount: { type: 'signed', header: 'Amount' },
      },
      extraColumns: {
        balance: 'Balance',
      },
    },
  ],
})
