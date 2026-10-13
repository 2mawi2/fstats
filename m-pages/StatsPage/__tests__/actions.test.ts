import { describe, expect, it } from 'vitest'

import type { ParsedStatsFile, StatsFile, Transaction } from '@/types'
import { StatsFileStatus } from '@/types-enums'

import {
  AmountFilter,
  EmptyReason,
  filterTransactions,
  getDuplicates,
  getEmptyReason,
  getShownFiles,
  getTransactionCounts,
  NO_CATEGORY,
} from '../actions'

const toTransaction = (date: string, value: string, category: string | null = null) =>
  ({ id: `${date}-${value}`, date, value, category }) as Transaction

const toFilter = (amount: AmountFilter, excludedCategories: string[] = []) => ({
  amount,
  excludedCategories: new Set(excludedCategories),
})

const toFile = (id: string, transactions: Transaction[]) =>
  ({ id, status: StatsFileStatus.PARSED, sections: [{ transactions }] }) as unknown as ParsedStatsFile

const fileA = toFile('a', [
  toTransaction('2026-01-01T00:00:00+00:00', '10'),
  toTransaction('2026-01-02T00:00:00+00:00', '-5'),
])
const fileB = toFile('b', [toTransaction('2026-01-02T00:00:00+00:00', '-3')])
const unparsed = { id: 'c', status: StatsFileStatus.ERROR } as unknown as StatsFile

describe('getShownFiles', () => {
  it('should remove the transactions on deselected days and count them', () => {
    const shown = getShownFiles([fileA, fileB, unparsed], new Set(['2026-01-02', '2025-12-31']))

    expect(shown.checkedFiles).toHaveLength(3)
    expect(shown.parsedFiles.map((file) => file.sections[0].transactions.length)).toEqual([1, 0])
    expect(shown.allParsedFiles).toEqual([fileA, fileB])
    // Only days of the files count, not stale ones
    expect(shown.excludedDayCount).toBe(1)
  })

  it('should keep the files as they are without deselected days', () => {
    const checkedFiles = [fileA, unparsed]
    expect(getShownFiles(checkedFiles, new Set()).checkedFiles).toBe(checkedFiles)
  })
})

describe('getTransactionCounts', () => {
  it('should count duplicates of earlier files in a later file', () => {
    const overlapping = toFile('d', [
      toTransaction('2026-01-02T00:00:00+00:00', '-5'),
      toTransaction('2026-01-03T00:00:00+00:00', '7'),
    ])
    const transactions = overlapping.sections[0].transactions
    const duplicates = getDuplicates([fileA, overlapping].flatMap((file) => file.sections[0].transactions))

    // On its own, the file has no duplicates
    expect(getTransactionCounts(transactions, new Set())).toEqual({ count: 2, dateExcludedCount: 0, duplicateCount: 0 })
    expect(getTransactionCounts(transactions, new Set(), duplicates)).toEqual({
      count: 1,
      dateExcludedCount: 0,
      duplicateCount: 1,
    })
    expect(getTransactionCounts(fileA.sections[0].transactions, new Set(), duplicates).duplicateCount).toBe(0)
  })
})

describe('getEmptyReason', () => {
  it('should tell deselected days from filters without matches', () => {
    const noDates = getShownFiles([fileB], new Set(['2026-01-02']))
    const all = getShownFiles([fileB], new Set())

    expect(getEmptyReason(noDates.allParsedFiles, noDates.parsedFiles, toFilter(AmountFilter.ALL))).toBe(
      EmptyReason.NO_DATES,
    )
    expect(getEmptyReason(all.allParsedFiles, all.parsedFiles, toFilter(AmountFilter.IN))).toBe(EmptyReason.NO_MATCHES)
    expect(getEmptyReason(all.allParsedFiles, all.parsedFiles, toFilter(AmountFilter.OUT))).toBeNull()
    expect(getEmptyReason(all.allParsedFiles, all.parsedFiles, toFilter(AmountFilter.OUT, [NO_CATEGORY]))).toBe(
      EmptyReason.NO_MATCHES,
    )
  })
})

describe('filterTransactions', () => {
  it('should filter by amount and excluded categories', () => {
    const transactions = [
      toTransaction('2026-01-01T00:00:00+00:00', '10', 'INC_01'),
      toTransaction('2026-01-02T00:00:00+00:00', '-5', 'HOU_01'),
      toTransaction('2026-01-03T00:00:00+00:00', '-3'),
    ]

    expect(filterTransactions(transactions, toFilter(AmountFilter.ALL, ['HOU_01']))).toEqual([
      transactions[0],
      transactions[2],
    ])
    expect(filterTransactions(transactions, toFilter(AmountFilter.OUT, [NO_CATEGORY]))).toEqual([transactions[1]])
  })
})
