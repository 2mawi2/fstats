import { AccountType, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const comdirect = defineBank({
  id: 'comdirect',
  name: 'Comdirect',
  currency: Currency.EUR,
  formats: [
    {
      accountType: AccountType.CURRENT,
      accountName: 'Giro',
      version: '1',
      dateFormat: 'dd.MM.yyyy',
      numberFormat: 'de',
      headers: ['Buchungstag', 'Wertstellung (Valuta)', 'Vorgang', 'Buchungstext', 'Umsatz in EUR'],
      columns: {
        date: 'Wertstellung (Valuta)',
        description: 'Buchungstext',
        amount: { type: 'signed', header: 'Umsatz in EUR' },
      },
      extraColumns: {
        transactionType: 'Vorgang',
      },
    },
    {
      accountType: AccountType.CREDIT_CARD,
      accountName: 'Visa',
      version: '1',
      dateFormat: 'dd.MM.yyyy',
      numberFormat: 'de',
      headers: ['Buchungstag', 'Umsatztag', 'Vorgang', 'Referenz', 'Buchungstext', 'Umsatz in EUR'],
      columns: {
        date: 'Umsatztag',
        description: 'Buchungstext',
        amount: { type: 'signed', header: 'Umsatz in EUR' },
      },
      extraColumns: {
        transactionType: 'Vorgang',
        reference: 'Referenz',
      },
    },
  ],
})
