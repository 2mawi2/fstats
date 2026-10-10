import { AccountType, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const ing = defineBank({
  id: 'ing',
  name: 'ING',
  currency: Currency.EUR,
  formats: [
    {
      accountType: AccountType.CURRENT,
      accountName: 'Giro',
      version: '1',
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
      },
    },
  ],
})
