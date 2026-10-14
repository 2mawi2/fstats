import { AccountType, Country, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const n26 = defineBank({
  id: 'n26',
  name: 'N26',
  url: 'https://n26.com/',
  country: Country.DE,
  currency: Currency.EUR,
  formats: [
    {
      id: 'current',
      accountType: AccountType.CURRENT,
      accountName: 'Current Account',
      dateFormat: 'yyyy-MM-dd',
      numberFormat: 'en',
      headers: [
        'Booking Date',
        'Value Date',
        'Partner Name',
        'Partner Iban',
        'Type',
        'Payment Reference',
        'Account Name',
        'Amount (EUR)',
        'Original Amount',
        'Original Currency',
        'Exchange Rate',
      ],
      columns: {
        date: 'Booking Date',
        description: 'Partner Name',
        amount: {
          type: 'signed',
          header: 'Amount (EUR)',
        },
      },
      extraColumns: {
        balance: null,
        reference: 'Payment Reference',
        transactionType: 'Type',
        category: null,
        parentCategory: null,
      },
    },
  ],
})
