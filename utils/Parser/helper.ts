import { formatISO, parseISO } from 'date-fns'

import type { BankDef, DetectResult, ExtraField, FormatDef, Parser, RowData, Transaction } from '@/types'
import { SortOrder } from '@/types-enums'
import { getUniqueTimestamps, toDate } from '@/utils/Date'
import { CYRB53 } from '@/utils/Encryption'
import { logger } from '@/utils/Logger'
import { parseGermanNumber } from '@/utils/Number'
import { getCategoryCode } from '@/utils/TransactionParser'
import { Big } from '@/lib/w-big'

import { getDescriptionHeaders, getFormatHeaders, toAccountId, toParserId } from './definition'
import type { BankAccountId, ParserId } from './registry'

// How many rows from the top are searched for the header row (skips bank preambles)
const HEADER_SEARCH_LIMIT = 30

const NUMERIC_EXTRA_FIELDS: ExtraField[] = ['balance']

type Row = {
  has: (header: string) => boolean
  get: (header: string) => string
}

type LocatedRows =
  | { header: RowData; rawRows: RowData[]; rows: Row[]; unexpectedHeaders: string[] }
  | Extract<DetectResult, { match: false }>

/**
 * Turns a declarative bank format into a parser.
 */
export const createParser = (bank: BankDef, format: FormatDef): Parser => {
  const { columns, extraColumns, dateFormat, numberFormat = 'en' } = format
  const { amount } = columns
  const descriptionHeaders = getDescriptionHeaders(columns.description)
  const { headers, required } = getFormatHeaders(format)

  const toNumber = (value: string) => (numberFormat === 'de' ? parseGermanNumber(value) : value)

  const isValidDate = (value: string) => {
    try {
      toDate(value, { formatFrom: dateFormat })
      return true
    } catch {
      return false
    }
  }

  const getValue = (row: Row): string => {
    switch (amount.type) {
      case 'signed':
        return toNumber(row.get(amount.header))
      case 'inOut': {
        const moneyIn = row.get(amount.in)
        const moneyOut = row.get(amount.out)
        // Banks differ on whether "out" values are already negative
        return moneyIn ? toNumber(moneyIn) : moneyOut ? Big(toNumber(moneyOut)).abs().times(-1).toString() : ''
      }
      case 'firstOf':
        return toNumber(amount.headers.map(row.get).find(Boolean) ?? '')
    }
  }

  const getExtra = (row: Row): Transaction['extra'] => {
    if (!extraColumns) {
      return null
    }

    const fields = (Object.entries(extraColumns) as [ExtraField, string][])
      .filter(([, header]) => row.has(header))
      .map(([field, header]) => {
        const value = row.get(header)
        return [field, NUMERIC_EXTRA_FIELDS.includes(field) ? toNumber(value) || '0' : value]
      })

    return buildExtra(Object.fromEntries(fields))
  }

  const locateRows = (data: RowData[]): LocatedRows => {
    // Find the row containing the most required headers
    let best = { index: -1, headers: [] as string[], missing: required }

    for (let index = 0; index < Math.min(data.length, HEADER_SEARCH_LIMIT); index += 1) {
      const rowHeaders = data[index].map(normalizeHeader)
      const missing = required.filter((header) => !rowHeaders.includes(normalizeHeader(header)))

      if (missing.length < best.missing.length) {
        best = { index, headers: rowHeaders, missing }
      }

      if (!missing.length) {
        break
      }
    }

    if (best.missing.length) {
      return {
        match: false,
        reason: `Missing columns: ${best.missing.map((header) => `"${header}"`).join(', ')}`,
        closeness: 1 - best.missing.length / required.length,
      }
    }

    const indexes = new Map(headers.map((header) => [header, best.headers.indexOf(normalizeHeader(header))]))

    const toRow = (row: RowData): Row => ({
      has: (header) => (indexes.get(header) ?? -1) !== -1,
      get: (header) => row[indexes.get(header) ?? -1]?.trim() ?? '',
    })

    const rawRows = data
      .slice(best.index + 1)
      // Rows with a different column count are preambles, footers or other sections
      .filter((row) => row.length === best.headers.length)
      .filter((row) => isValidDate(toRow(row).get(columns.date)))
    const rows = rawRows.map(toRow)

    if (!rows.length) {
      return {
        match: false,
        reason: `Header found in row ${best.index + 1}, but no rows with ${best.headers.length} columns and a "${dateFormat}" date`,
        closeness: 1,
      }
    }

    // Unlisted headers still match, but the definition may need updating
    const knownHeaders = headers.map(normalizeHeader)
    const unexpectedHeaders = data[best.index]
      .map((header) => header.trim())
      .filter((header) => header && !knownHeaders.includes(normalizeHeader(header)))

    return { header: data[best.index], rawRows, rows, unexpectedHeaders }
  }

  return {
    id: toParserId(bank, format) as ParserId,
    bankAccountId: toAccountId(bank, format) as BankAccountId,
    bankName: bank.name,
    accountType: format.accountType,
    accountName: format.accountName,
    currency: bank.currency,
    dateFormat,

    detect: (rows) => {
      const located = locateRows(rows)
      return 'rows' in located ? { match: true } : located
    },

    extractRows: (rows) => {
      const located = locateRows(rows)
      return 'rows' in located ? { header: located.header, rows: located.rawRows } : null
    },

    parse: (rows) => {
      const located = locateRows(rows)

      if (!('rows' in located)) {
        throw new Error(located.reason)
      }

      if (located.unexpectedHeaders.length) {
        logger('warn', 'Parser', `Unexpected headers for ${toParserId(bank, format)}:`, located.unexpectedHeaders)
      }

      const parsedRows: Omit<Transaction, 'id'>[] = located.rows.map((row) => ({
        date: formatISO(toDate(row.get(columns.date), { formatFrom: dateFormat })),
        description: descriptionHeaders.map(row.get).filter(Boolean).join(' '),
        value: getValue(row) || '0',
        category: null,
        currency: bank.currency,
        extra: getExtra(row),
      }))

      const dates = parsedRows.map((row) => parseISO(row.date))
      const uniqueTimestamps = getUniqueTimestamps({ dates, dateFormat, sortOrder: getCsvSortOrder(dates) })
      const getId = createTransactionIdGenerator()

      return parsedRows.map((row, index) => {
        const date = formatISO(uniqueTimestamps[index])
        const transaction: Transaction = { ...row, id: getId({ ...row, date }), date }
        return { ...transaction, category: getCategoryCode(transaction) }
      })
    },
  }
}

/**
 * IDs are a hash of the transaction content (excluding the derived `category`), so they are stable across
 * re-parses. Identical transactions within a file (only possible with second precision dates) get a counter suffix.
 */
export const createTransactionIdGenerator = () => {
  const seen = new Map<string, number>()

  return ({ date, description, value, currency, extra }: Omit<Transaction, 'id' | 'category'>): string => {
    const sortedExtra = extra ? Object.entries(extra).sort(([a], [b]) => a.localeCompare(b)) : null
    const id = CYRB53.encrypt(JSON.stringify([date, description, value, currency, sortedExtra]))
    const count = (seen.get(id) ?? 0) + 1
    seen.set(id, count)
    return count === 1 ? id : `${id}-${count}`
  }
}

// Strips empty fields from object
export const buildExtra = (fields: Record<string, string>): Transaction['extra'] => {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value)) as Transaction['extra']
}

/**
 * Makes header comparison tolerant to case, whitespace, BOM, quotes and encoding:
 * non-ASCII chars (incl. "�" from mis-decoded files) collapse to "?", so "Empfänger" === "Empf�nger".
 */
export const normalizeHeader = (value: string) => {
  return value
    .replace(/^﻿/, '')
    .replace(/"/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\x20-\x7E]/g, '?')
}

export const getCsvSortOrder = (dates: Date[]): SortOrder => {
  let asc = 0
  let desc = 0

  for (let index = 1; index < dates.length; index += 1) {
    const previous = dates[index - 1].getTime()
    const current = dates[index].getTime()

    if (current > previous) {
      asc += 1
      continue
    }

    if (current < previous) {
      desc += 1
    }
  }

  return desc > asc ? SortOrder.DESC : SortOrder.ASC
}
