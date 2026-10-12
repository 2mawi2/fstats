import { AccountType, Country, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const capitec = defineBank({
  id: 'capitec',
  name: 'Capitec',
  country: Country.ZA,
  currency: Currency.ZAR,
  formats: [
    {
      accountType: AccountType.SAVINGS,
      accountName: 'Savings',
      version: '1',
      dateFormat: 'yyyy-MM-dd HH:mm',
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
        parentCategory: 'Parent Category',
        category: 'Category',
        balance: 'Balance',
      },
    },
    {
      accountType: AccountType.SAVINGS,
      accountName: 'Savings',
      version: '2',
      dateFormat: 'dd/MM/yyyy',
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
        parentCategory: 'Parent Category',
        category: 'Sub-category',
        balance: 'Balance',
      },
    },
  ],
})
