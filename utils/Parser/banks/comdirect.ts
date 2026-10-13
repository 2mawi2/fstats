import { AccountType, Country, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const comdirect = defineBank({
  id: 'comdirect',
  name: 'Comdirect',
  country: Country.DE,
  currency: Currency.EUR,
  formats: [
    {
      accountType: AccountType.CURRENT,
      accountName: 'Giro',
      variant: 'default',
      dateFormat: 'dd.MM.yyyy',
      numberFormat: 'de',
      headers: ['Buchungstag', 'Wertstellung (Valuta)', 'Vorgang', 'Buchungstext', 'Umsatz in EUR'],
      columns: {
        date: 'Wertstellung (Valuta)',
        description: 'Buchungstext',
        amount: { type: 'signed', header: 'Umsatz in EUR' },
      },
      extraColumns: {
        balance: null,
        reference: null,
        transactionType: 'Vorgang',
        category: null,
        parentCategory: null,
      },
    },
    {
      accountType: AccountType.CREDIT_CARD,
      accountName: 'Visa',
      variant: 'default',
      dateFormat: 'dd.MM.yyyy',
      numberFormat: 'de',
      headers: ['Buchungstag', 'Umsatztag', 'Vorgang', 'Referenz', 'Buchungstext', 'Umsatz in EUR'],
      columns: {
        date: 'Umsatztag',
        description: 'Buchungstext',
        amount: { type: 'signed', header: 'Umsatz in EUR' },
      },
      extraColumns: {
        balance: null,
        reference: 'Referenz',
        transactionType: 'Vorgang',
        category: null,
        parentCategory: null,
      },
    },
  ],
})
