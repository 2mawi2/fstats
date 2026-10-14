import { AccountType, Country, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const comdirect = defineBank({
  id: 'comdirect',
  name: 'Comdirect',
  url: 'https://www.comdirect.de/',
  country: Country.DE,
  currency: Currency.EUR,
  formats: [
    {
      id: 'giro',
      accountType: AccountType.CURRENT,
      accountName: 'Giro',
      dateFormat: 'dd.MM.yyyy',
      numberFormat: 'de',
      headers: ['Buchungstag', 'Wertstellung (Valuta)', 'Vorgang', 'Buchungstext', 'Umsatz in EUR'],
      columns: {
        date: 'Wertstellung (Valuta)',
        description: 'Buchungstext',
        amount: {
          type: 'signed',
          header: 'Umsatz in EUR',
        },
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
      id: 'visa',
      accountType: AccountType.CREDIT_CARD,
      accountName: 'Visa',
      dateFormat: 'dd.MM.yyyy',
      numberFormat: 'de',
      headers: ['Buchungstag', 'Umsatztag', 'Vorgang', 'Referenz', 'Buchungstext', 'Umsatz in EUR'],
      columns: {
        date: 'Umsatztag',
        description: 'Buchungstext',
        amount: {
          type: 'signed',
          header: 'Umsatz in EUR',
        },
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
