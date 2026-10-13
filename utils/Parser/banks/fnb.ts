import { AccountType, Country, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const fnb = defineBank({
  id: 'fnb',
  name: 'FNB',
  country: Country.ZA,
  currency: Currency.ZAR,
  formats: [
    {
      accountType: AccountType.CREDIT_CARD,
      accountName: 'Credit Card',
      variant: 'default',
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
