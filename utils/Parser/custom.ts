import { isValid, parse } from 'date-fns'
import { countBy, maxBy } from 'lodash'

import type { BankDef, CustomFormat, FormatDef, Parser, RowData } from '@/types'
import { AccountType } from '@/types-enums'

import { normalizeHeader } from './create-parser'
import { getFormatHeaders } from './definition'
import { getParsers } from './lookup'
import type { CustomId, ParserId } from './registry'
import { BANKS, CUSTOM_ID_PREFIX } from './registry'

/**
 * Date formats offered for custom formats, the first one matching the most rows is detected.
 */
export const CUSTOM_DATE_FORMATS = [
  'yyyy-MM-dd',
  'yyyy-MM-dd HH:mm',
  'yyyy-MM-dd HH:mm:ss',
  'yyyy/MM/dd',
  'dd.MM.yyyy',
  'dd.MM.yy',
  'dd/MM/yyyy',
  'dd/MM/yy',
  'MM/dd/yyyy',
  'dd-MM-yyyy',
  'd MMM yyyy',
  'yyyyMMdd',
]

export const toCustomId = (): CustomId => {
  return `${CUSTOM_ID_PREFIX}${crypto.randomUUID()}`
}

export const isCustomParserId = (parserId: ParserId) => {
  return parserId.startsWith(CUSTOM_ID_PREFIX)
}

export const isParserOfCustomFormat = (parserId: ParserId, format: CustomFormat) => {
  return parserId.startsWith(`${format.id}__`)
}

export const toCustomBank = (format: CustomFormat): BankDef => {
  const formatDef: FormatDef = {
    accountType: AccountType.CURRENT,
    accountName: 'Custom',
    version: '1',
    dateFormat: format.dateFormat,
    numberFormat: format.numberFormat,
    headers: format.headers,
    columns: format.columns,
    extraColumns: format.extraColumns,
  }

  return { id: format.id, name: format.bankName, currency: format.currency, formats: [formatDef] }
}

/**
 * Parsers that could match files of `parser` or vice versa, i.e. whose required headers are a subset of the other's
 * headers. A file must match exactly one parser.
 */
export const getOverlappingParsers = (parser: Parser): Parser[] => {
  const isSubset = (a: string[], b: string[]) => {
    const normalizedB = b.map(normalizeHeader)
    return a.every((header) => normalizedB.includes(normalizeHeader(header)))
  }

  return getParsers().filter((other) => {
    return (
      other.id !== parser.id &&
      (isSubset(parser.requiredHeaders, other.headers) || isSubset(other.requiredHeaders, parser.headers))
    )
  })
}

/**
 * Index of the first row with the most common column count and no empty cells (skips preambles like "Account: 123").
 */
export const detectHeaderRow = (rows: RowData[]) => {
  const counts = countBy(rows, (row) => row.length)
  const columnCount = Number(maxBy(Object.keys(counts), (count) => counts[count]))
  const index = rows.findIndex((row) => row.length === columnCount && row.every((cell) => cell.trim()))
  return index === -1 ? 0 : index
}

export const detectDateFormat = (values: string[]) => {
  const scores = CUSTOM_DATE_FORMATS.map((dateFormat) => ({
    dateFormat,
    score: values.filter((value) => isValid(parse(value.trim(), dateFormat, new Date()))).length,
  }))
  const best = maxBy(scores, 'score')
  return best?.score ? best.dateFormat : null
}

/**
 * 'de' if more values end with a decimal comma ("1.234,56") than a decimal point.
 */
export const detectNumberFormat = (values: string[]): CustomFormat['numberFormat'] => {
  const decimalCommas = values.filter((value) => /\d,\d{1,2}$/.test(value.trim())).length
  const decimalPoints = values.filter((value) => /\d\.\d{1,2}$/.test(value.trim())).length
  return decimalCommas > decimalPoints ? 'de' : 'en'
}

const getEditDistance = (a: string, b: string) => {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index)

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i]
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    previous = current
  }

  return previous[b.length]
}

/**
 * 1 for equal headers (see `normalizeHeader`), 0 for completely different ones. Tolerates typos, e.g. "Betrag" vs
 * "Betarg".
 */
export const getHeaderSimilarity = (a: string, b: string) => {
  const normalizedA = normalizeHeader(a)
  const normalizedB = normalizeHeader(b)
  const length = Math.max(normalizedA.length, normalizedB.length)
  return length ? 1 - getEditDistance(normalizedA, normalizedB) / length : 0
}

/**
 * Index of the most similar header in `headers`, if similar enough.
 */
export const findSimilarHeader = (header: string, headers: string[], minSimilarity = 0.6) => {
  const scores = headers.map((other, index) => ({ index, similarity: getHeaderSimilarity(header, other) }))
  const best = maxBy(scores, 'similarity')
  return best && best.similarity >= minSimilarity ? best.index : -1
}

export type FormatSuggestion = {
  bank: BankDef
  format: FormatDef
  /**
   * 0 - 1, how similar the headers are in both directions.
   */
  score: number
}

/**
 * Built-in formats with headers similar to `headers`, best first. For files that weren't detected, e.g. due to a
 * renamed column.
 */
export const getFormatSuggestions = (headers: string[], minScore = 0.6): FormatSuggestion[] => {
  const getCoverage = (from: string[], to: string[]) => {
    const similarities = from.map((header) => Math.max(...to.map((other) => getHeaderSimilarity(header, other))))
    return similarities.reduce((sum, similarity) => sum + similarity, 0) / (from.length || 1)
  }

  return BANKS.flatMap((bank) =>
    bank.formats.map((format) => {
      const formatHeaders = getFormatHeaders(format).headers
      const score = (getCoverage(formatHeaders, headers) + getCoverage(headers, formatHeaders)) / 2
      return { bank, format, score }
    }),
  )
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => b.score - a.score)
}
