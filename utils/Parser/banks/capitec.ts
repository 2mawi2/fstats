import { AccountType, Country, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const capitec = defineBank({
  id: 'capitec',
  name: 'Capitec',
  url: 'https://www.capitecbank.co.za/',
  country: Country.ZA,
  currency: Currency.ZAR,
  formats: [
    {
      accountType: AccountType.SAVINGS,
      accountName: 'Savings',
      variant: 'default',
      dateFormat: 'yyyy-MM-dd HH:mm',
      numberFormat: 'en',
      headers: [
        'Nr',
        'Account',
        'Posting Date',
        'Transaction Date',
        'Description',
        'Original Description',
        'Parent Category',
        'Category',
        'Money In',
        'Money Out',
        'Fee',
        'Balance',
      ],
      columns: {
        date: 'Transaction Date',
        description: 'Description',
        amount: { type: 'firstOf', headers: ['Money In', 'Money Out', 'Fee'] },
      },
      extraColumns: {
        balance: 'Balance',
        reference: null,
        transactionType: null,
        category: 'Category',
        parentCategory: 'Parent Category',
      },
    },
    {
      accountType: AccountType.SAVINGS,
      accountName: 'Savings',
      variant: 'legacy',
      dateFormat: 'dd/MM/yyyy',
      numberFormat: 'en',
      headers: [
        'Sequence Number',
        'Account',
        'Posting Date',
        'Transaction Date',
        'Statement Description',
        'Long Description',
        'Parent Category',
        'Sub-category',
        'Debit Amount',
        'Credit Amount',
        'Balance',
      ],
      columns: {
        date: 'Transaction Date',
        description: 'Statement Description',
        amount: { type: 'inOut', in: 'Credit Amount', out: 'Debit Amount' },
      },
      extraColumns: {
        balance: 'Balance',
        reference: null,
        transactionType: null,
        category: 'Sub-category',
        parentCategory: 'Parent Category',
      },
    },
  ],
})
