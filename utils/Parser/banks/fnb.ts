import { AccountType, Country, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const fnb = defineBank({
  id: 'fnb',
  name: 'FNB',
  url: 'https://www.fnb.co.za/',
  country: Country.ZA,
  currency: Currency.ZAR,
  formats: [
    {
      accountType: AccountType.CREDIT_CARD,
      accountName: 'Credit Card',
      variant: 'default',
      dateFormat: 'yyyy/MM/dd',
      numberFormat: 'en',
      headers: ['Date', 'Amount', 'Balance', 'Description'],
      columns: {
        date: 'Date',
        description: 'Description',
        amount: {
          type: 'signed',
          header: 'Amount',
        },
      },
      extraColumns: {
        balance: 'Balance',
        reference: null,
        transactionType: null,
        category: null,
        parentCategory: null,
      },
    },
  ],
})
