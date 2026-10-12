import { afterEach, describe, expect, it } from 'vitest'

import type { CustomFormat } from '@/types'
import { Currency } from '@/types-enums'
import {
  createParser,
  detectDateFormat,
  detectHeaderRow,
  detectNumberFormat,
  findSections,
  findSimilarHeader,
  getFormatSuggestions,
  getHeaderSimilarity,
  getOverlappingParsers,
  setCustomBanks,
  toCustomBank,
} from '@/utils/Parser'

const customFormat: CustomFormat = {
  id: 'custom_test',
  created: '2024-01-01T00:00:00+00:00',
  bankName: 'My Bank',
  currency: Currency.EUR,
  dateFormat: 'dd.MM.yyyy',
  numberFormat: 'de',
  headers: ['Datum', 'Text', 'Betrag'],
  columns: { date: 'Datum', description: ['Text'], amount: { type: 'signed', header: 'Betrag' } },
  extraColumns: {},
}

describe('custom formats', () => {
  afterEach(() => {
    setCustomBanks([])
  })

  it('should find sections of registered custom formats', () => {
    const rows = [
      ['Datum', 'Text', 'Betrag'],
      ['01.01.2024', 'A', '-1,50'],
    ]

    expect(findSections(rows).sections).toEqual([])

    setCustomBanks([toCustomBank(customFormat)])

    const { sections } = findSections(rows)
    expect(sections.map(({ parser }) => parser.id)).toEqual(['custom_test__current__1'])
    expect(sections[0].parser.parse(sections[0].rows).map(({ value }) => value)).toEqual(['-1.50'])
  })

  it('should find overlapping parsers', () => {
    const bank = toCustomBank({ ...customFormat, id: 'custom_other', headers: ['Datum', 'Text', 'Betrag', 'Saldo'] })
    const parser = createParser(bank, bank.formats[0])

    expect(getOverlappingParsers(parser)).toEqual([])

    setCustomBanks([toCustomBank(customFormat)])

    expect(getOverlappingParsers(parser).map(({ id }) => id)).toEqual(['custom_test__current__1'])
  })
})

describe('format suggestions', () => {
  it('should tolerate typos in headers', () => {
    expect(getHeaderSimilarity('Betrag', 'betrag ')).toBe(1)
    expect(getHeaderSimilarity('Betrag', 'Betarg')).toBeGreaterThan(0.6)
    expect(findSimilarHeader('Betrag', ['Datum', 'Betarg'])).toBe(1)
    expect(findSimilarHeader('Betrag', ['Datum', 'Text'])).toBe(-1)
  })

  it('should suggest built-in formats with similar headers first', () => {
    const headers = [
      'Buchung',
      'Wertstellung',
      'Auftraggeber/Empfaenger',
      'Buchungstext',
      'Verwendungszweck',
      'Saldo',
      'Währung',
      'Betrag',
    ]

    expect(getFormatSuggestions(headers)[0]?.bank.id).toBe('ing')
    expect(getFormatSuggestions(['Foo', 'Bar'])).toEqual([])
  })
})

describe('detection', () => {
  it('should skip preamble rows to find the header row', () => {
    const rows = [
      ['Account', '123'],
      ['Datum', 'Text', 'Betrag'],
      ['01.01.2024', 'A', '1,00'],
      ['02.01.2024', '', '2,00'],
    ]

    expect(detectHeaderRow(rows)).toBe(1)
  })

  it('should detect the date format matching the most values', () => {
    expect(detectDateFormat(['31.01.2024', '01.02.2024', 'Total'])).toBe('dd.MM.yyyy')
    expect(detectDateFormat(['2024-01-31'])).toBe('yyyy-MM-dd')
    expect(detectDateFormat(['foo'])).toBeNull()
  })

  it('should detect the number format', () => {
    expect(detectNumberFormat(['-1.234,56', '2,00'])).toBe('de')
    expect(detectNumberFormat(['-1,234.56', '2.00', '3'])).toBe('en')
  })
})
