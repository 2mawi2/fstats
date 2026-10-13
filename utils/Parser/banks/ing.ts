import { AccountType, Country, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const ing = defineBank({
  id: 'ing',
  name: 'ING',
  url: 'https://www.ing.de/',
  country: Country.DE,
  currency: Currency.EUR,
  formats: [
    {
      accountType: AccountType.CURRENT,
      accountName: 'Giro',
      variant: 'default',
      dateFormat: 'dd.MM.yyyy',
      numberFormat: 'de',
      headers: [
        'Buchung',
        'Wertstellungsdatum',
        'Auftraggeber/Empfänger',
        'Buchungstext',
        'Verwendungszweck',
        { header: 'Saldo', optional: true },
        'Währung',
        'Betrag',
      ],
      columns: {
        date: 'Wertstellungsdatum',
        description: 'Auftraggeber/Empfänger',
        amount: { type: 'signed', header: 'Betrag' },
      },
      extraColumns: {
        balance: 'Saldo',
        reference: 'Verwendungszweck',
        transactionType: 'Buchungstext',
        category: null,
        parentCategory: null,
      },
    },
  ],
})
