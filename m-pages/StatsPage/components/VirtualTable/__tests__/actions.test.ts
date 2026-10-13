import { describe, expect, it } from 'vitest'

import { filterBySearch, splitMatches, toSearchQuery, toSearchText } from '../actions'

describe('search', () => {
  const rows = [
    ['01.02.2024', 'Coffee Shop'],
    ['02.02.2024', 'Rent'],
  ]
  const searchTexts = rows.map(toSearchText)

  it('should filter rows case-insensitively', () => {
    expect(filterBySearch(rows, searchTexts, toSearchQuery(' COFFEE '))).toEqual([rows[0]])
  })

  it('should keep all rows without a query', () => {
    expect(filterBySearch(rows, searchTexts, toSearchQuery('  '))).toBe(rows)
  })

  it('should not match across cells', () => {
    expect(filterBySearch(rows, searchTexts, toSearchQuery('2024rent'))).toEqual([])
  })

  it('should split matches into odd parts', () => {
    expect(splitMatches('Coffee coffee', 'coffee')).toEqual(['', 'Coffee', ' ', 'coffee', ''])
    expect(splitMatches('a.b', '.')).toEqual(['a', '.', 'b'])
    expect(splitMatches('Rent', '')).toEqual(['Rent'])
  })

  it('should ignore accents and match ß as ss', () => {
    const names = [['Müller'], ['Straße'], ['Cafe']]
    const texts = names.map(toSearchText)

    expect(filterBySearch(names, texts, toSearchQuery('MULLER'))).toEqual([names[0]])
    expect(filterBySearch(names, texts, toSearchQuery('strasse'))).toEqual([names[1]])
    expect(filterBySearch(names, texts, toSearchQuery('café'))).toEqual([names[2]])
  })

  it('should highlight the original characters', () => {
    expect(splitMatches('Bäcker', toSearchQuery('a'))).toEqual(['B', 'ä', 'cker'])
    expect(splitMatches('Straße', toSearchQuery('ss'))).toEqual(['Stra', 'ß', 'e'])
    expect(splitMatches('Straße', toSearchQuery('s'))).toEqual(['', 'S', 'tra', 'ß', 'e'])
    expect(splitMatches('Cafe\u0301', toSearchQuery('cafe'))).toEqual(['', 'Cafe', '\u0301'])
  })
})
