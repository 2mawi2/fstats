import { describe, expect, expectTypeOf, it } from 'vitest'

import { AccountType, Currency } from '@/types-enums'
import type { BankAccountId, ParserId } from '@/utils/Parser'
import {
  AVAILABLE_PARSERS,
  BANKS,
  createParser,
  defineBank,
  getFormatHeaders,
  getReferencedHeaders,
  normalizeHeader,
  PARSER_IDS,
  toParserId,
} from '@/utils/Parser'

describe('registry', () => {
  it('should derive literal ID types', () => {
    expectTypeOf<ParserId>().toEqualTypeOf<
      | 'capitec__savings__1'
      | 'capitec__savings__2'
      | 'comdirect__current__1'
      | 'comdirect__credit_card__1'
      | 'fnb__credit_card__1'
      | 'ing__current__1'
      | 'lloyds__current__1'
    >()
    expectTypeOf<BankAccountId>().toEqualTypeOf<
      | 'capitec__savings'
      | 'comdirect__current'
      | 'comdirect__credit_card'
      | 'fnb__credit_card'
      | 'ing__current'
      | 'lloyds__current'
    >()
  })

  it('should have unique parser IDs', () => {
    expect(new Set(PARSER_IDS).size).toBe(PARSER_IDS.length)
  })

  it('should expose all parsers where parser ID matches the registry key', () => {
    Object.entries(AVAILABLE_PARSERS).forEach(([key, parser]) => {
      expect(parser.id).toBe(key)
    })
  })

  it('should not have formats which could match files of another format', () => {
    const formats = BANKS.flatMap((bank) =>
      bank.formats.map((format) => {
        const { headers, required } = getFormatHeaders(format)
        return {
          id: toParserId(bank, format),
          headers: headers.map(normalizeHeader),
          required: required.map(normalizeHeader),
        }
      }),
    )

    const overlaps = formats.flatMap((a) =>
      formats
        .filter((b) => a.id !== b.id && a.required.every((header) => b.headers.includes(header)))
        .map((b) => `${a.id} matches ${b.id} files`),
    )

    expect(overlaps).toEqual([])
  })

  it('should only read headers listed in the format headers', () => {
    const unlisted = BANKS.flatMap((bank) =>
      bank.formats.flatMap((format) => {
        const { headers } = getFormatHeaders(format)
        return getReferencedHeaders(format)
          .filter((header) => !headers.includes(header))
          .map((header) => `${toParserId(bank, format)}: "${header}"`)
      }),
    )

    expect(unlisted).toEqual([])
  })
})

describe('createParser', () => {
  const bank = defineBank({
    id: 'test',
    name: 'Test',
    currency: Currency.EUR,
    formats: [
      {
        accountType: AccountType.CURRENT,
        accountName: 'Giro',
        version: '1',
        dateFormat: 'dd.MM.yyyy',
        numberFormat: 'de',
        headers: ['Datum', 'Text', 'Betrag', 'Saldo', 'Referenz'],
        columns: { date: 'Datum', description: 'Text', amount: { type: 'signed', header: 'Betrag' } },
        extraColumns: { balance: 'Saldo', reference: 'Referenz' },
      },
    ],
  })
  const parser = createParser(bank, bank.formats[0])
  const header = ['Datum', 'Text', 'Betrag', 'Saldo', 'Referenz']

  it('should omit empty extra cells and use null when all are empty', () => {
    const transactions = parser.parse([
      header,
      ['01.01.2024', 'A', '-1,50', '1.234,56', 'Ref'],
      ['02.01.2024', 'B', '2,00', '', 'Ref'],
      ['03.01.2024', 'C', '3,00', '', ''],
    ])

    expect(transactions.map((transaction) => transaction.extra)).toEqual([
      { balance: '1234.56', reference: 'Ref' },
      { reference: 'Ref' },
      null,
    ])
  })
})
