import { AccountType, Country, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const lloyds = defineBank({
  id: 'lloyds',
  name: 'Lloyds',
  url: 'https://www.lloydsbank.com/',
  country: Country.GB,
  currency: Currency.GBP,
  formats: [
    {
      id: 'current',
      accountType: AccountType.CURRENT,
      accountName: 'Current Account',
      dateFormat: 'dd/MM/yyyy',
      numberFormat: 'en',
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
        amount: {
          type: 'inOut',
          in: 'Credit Amount',
          out: 'Debit Amount',
        },
      },
      extraColumns: {
        balance: 'Balance',
        reference: null,
        transactionType: 'Transaction Type',
        category: null,
        parentCategory: null,
      },
    },
  ],
})
