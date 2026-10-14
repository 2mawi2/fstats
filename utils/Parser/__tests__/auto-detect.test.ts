import { afterEach, describe, expect, it } from 'vitest'

import type { CustomParser } from '@/types'
import {
  canConvert,
  createMappingParser,
  detectHeaderIndex,
  detectMapping,
  findSections,
  getHeaderCandidates,
  getHeaderNames,
  getMatchingDateFormats,
  getMatchingNumberFormats,
  looksLikeHeader,
  setCustomParsers,
} from '@/utils/Parser'

const ukHeader = [
  'Transaction Date',
  'Transaction Type',
  'Sort Code',
  'Account Number',
  'Description',
  'Paid Out',
  'Paid In',
  'Balance',
]
const ukFile = [
  ['Statement for account 12345678'],
  ukHeader,
  ['15/01/2026', 'DEB', "'30-00-00", '12345678', 'TESCO STORES', '12.50', '', '1,234.56'],
  ['16/01/2026', 'FPI', "'30-00-00", '12345678', 'SALARY', '', '2,000.00', '3,234.56'],
  ['17/01/2026', 'DD', "'30-00-00", '12345678', 'COUNCIL TAX', '150.00', '', '3,084.56'],
]

const deHeader = [
  'Buchung',
  'Valuta',
  'Auftraggeber/Empfänger',
  'Verwendungszweck',
  'Saldo',
  'Währung',
  'Betrag',
  'Währung',
]
const deFile = [
  ['Umsatzanzeige', ''],
  ['Kunde', 'Max Mustermann'],
  [''],
  deHeader,
  ['15.01.2026', '15.01.2026', 'REWE', 'Einkauf', '1.234,56', 'EUR', '-23,45', 'EUR'],
  ['31.01.2026', '31.01.2026', 'Arbeitgeber GmbH', 'Gehalt Januar', '4.234,56', 'EUR', '3.000,00', 'EUR'],
]

describe('detectHeaderIndex', () => {
  it('should skip preamble rows', () => {
    expect(detectHeaderIndex(ukFile)).toBe(1)
    expect(detectHeaderIndex(deFile)).toBe(3)
  })
})

describe('getHeaderNames', () => {
  it('should drop empty and repeated names', () => {
    expect(getHeaderNames(['Date', ' ', 'Amount', 'amount ', ''])).toEqual(['Date', 'Amount'])
  })
})

describe('detectMapping', () => {
  it('should detect money in and out columns', () => {
    expect(detectMapping(ukFile)).toEqual({
      headerIndex: 1,
      dateFormat: 'dd/MM/yyyy',
      numberFormat: 'en',
      currency: null,
      columns: {
        date: 'Transaction Date',
        description: 'Description',
        amount: { type: 'inOut', in: 'Paid In', out: 'Paid Out' },
      },
      extraColumns: {
        balance: 'Balance',
        reference: null,
        transactionType: 'Transaction Type',
        category: null,
        parentCategory: null,
      },
    })
  })

  it('should detect a signed amount, German numbers and the currency', () => {
    expect(detectMapping(deFile)).toEqual({
      headerIndex: 3,
      dateFormat: 'dd.MM.yyyy',
      numberFormat: 'de',
      currency: 'EUR',
      columns: {
        date: 'Buchung',
        description: 'Verwendungszweck',
        amount: { type: 'signed', header: 'Betrag' },
      },
      extraColumns: { balance: 'Saldo', reference: null, transactionType: null, category: null, parentCategory: null },
    })
  })

  it('should fall back to the values without known header names', () => {
    const mapping = detectMapping([
      ['When', 'What', 'How much'],
      ['2026-01-15', 'Coffee shop', '-3.50'],
      ['2026-01-16', 'Refund', '10.00'],
    ])

    expect(mapping.columns).toEqual({
      date: 'When',
      description: 'What',
      amount: { type: 'signed', header: 'How much' },
    })
    expect(mapping.dateFormat).toBe('yyyy-MM-dd')
  })

  it("should detect the bank's categories, the parent first", () => {
    const { extraColumns, columns } = detectMapping([
      ['Date', 'Description', 'Amount', 'Parent Category', 'Category'],
      ['2026-01-15', 'Coffee shop', '-3.50', 'Food', 'Coffee'],
    ])

    expect(columns.description).toBe('Description')
    expect(extraColumns).toMatchObject({ category: 'Category', parentCategory: 'Parent Category' })
  })

  it('should ignore repeated header rows when checking the values of columns', () => {
    const header = ['Date', 'Details', 'Money In', 'Money Out', 'Balance']
    const mapping = detectMapping([
      header,
      ['15/01/2026', 'Coffee', '', '-3.50', '96.50'],
      header,
      ['16/01/2026', 'Refund', '10.00', '', '106.50'],
    ])

    expect(mapping.columns.amount).toEqual({ type: 'inOut', in: 'Money In', out: 'Money Out' })
    expect(mapping.extraColumns.balance).toBe('Balance')
  })

  it('should read ambiguous dates day first, unless a day is in the second position', () => {
    const toFile = (dates: string[]) => [['Date', 'Amount'], ...dates.map((date) => [date, '1.00'])]

    expect(detectMapping(toFile(['01/02/2026', '03/04/2026'])).dateFormat).toBe('dd/MM/yyyy')
    expect(detectMapping(toFile(['01/02/2026', '03/24/2026'])).dateFormat).toBe('MM/dd/yyyy')
  })
})

describe('canConvert', () => {
  it('should only be true if transactions can be read with the detected mapping', () => {
    expect(canConvert(ukFile)).toBe(true)
    expect(canConvert(deFile)).toBe(true)
    expect(
      canConvert([
        ['Name', 'Notes'],
        ['Alice', 'Hello'],
      ]),
    ).toBe(false)
  })
})

describe('custom parsers', () => {
  const toCustomParser = (id: string): CustomParser => {
    const { columns, extraColumns, dateFormat, headerIndex } = detectMapping(ukFile)

    return {
      id,
      created: '2026-01-01T00:00:00Z',
      modified: '2026-01-01T00:00:00Z',
      bankName: 'My Bank',
      accountName: 'Current',
      currency: 'GBP',
      dateFormat: dateFormat!,
      numberFormat: 'en',
      headers: getHeaderNames(ukFile[headerIndex]),
      columns: { date: columns.date!, description: columns.description!, amount: columns.amount! },
      extraColumns,
    }
  }

  afterEach(() => setCustomParsers([]))

  it('should parse with the detected mapping', () => {
    const parser = createMappingParser('00000000-0000-0000-0000-000000000001', toCustomParser('a'))
    const transactions = parser.parse(ukFile.slice(1))

    expect(parser.id).toBe('custom_00000000000000000000000000000001__current__default')
    expect(transactions.map(({ value, extra }) => [value, extra?.balance])).toEqual([
      ['-12.5', '1234.56'],
      ['2000.00', '3234.56'],
      ['-150', '3084.56'],
    ])
  })

  it('should only be matched once registered', () => {
    expect(findSections(ukFile).sections).toEqual([])

    setCustomParsers([toCustomParser('00000000-0000-0000-0000-000000000001')])

    expect(findSections(ukFile).sections.map(({ parser }) => parser.bankName)).toEqual(['My Bank'])
  })
})

describe('getMatchingDateFormats', () => {
  it('should ignore values that are no dates, and match none without dates', () => {
    expect(getMatchingDateFormats(['15.01.2026', 'Total'])).toEqual(['dd.MM.yyyy'])
    expect(getMatchingDateFormats(['Coffee'])).toEqual([])
  })
})

describe('getMatchingNumberFormats', () => {
  it('should match both formats if the amounts do not tell, none if they are no numbers', () => {
    expect(getMatchingNumberFormats(['1,234', '0,50'])).toEqual(['de'])
    expect(getMatchingNumberFormats(['3', '1,234'])).toEqual(['en', 'de'])
    expect(getMatchingNumberFormats(['Fees'])).toEqual([])
  })
})

describe('looksLikeHeader', () => {
  it('should tell column names from data', () => {
    expect(looksLikeHeader(['Nr', 'Account', 'Posting Date'])).toBe(true)
    expect(looksLikeHeader(['2', '1258819269', '2026-01-02', 'Debit Order'])).toBe(false)
    expect(looksLikeHeader(['Yo bru'])).toBe(false)
  })
})

describe('getHeaderCandidates', () => {
  it('should find a header row per table', () => {
    const header = ['Date', 'Details', 'Amount']
    const row = ['15/01/2026', 'Coffee', '-3.50']

    expect(getHeaderCandidates([['Account', 'Giro'], header, row, row, header, row])).toEqual([
      { index: 1, score: 3 },
      { index: 4, score: 1 },
    ])
  })
})
