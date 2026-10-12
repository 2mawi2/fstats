import { formatISO } from 'date-fns'
import { omit, uniq } from 'lodash'

import type { CustomFormat, FormatDef, RowData } from '@/types'
import { Currency } from '@/types-enums'
import { MISC } from '@/common'
import { getErrorMessage } from '@/utils/FileParser'
import type { FormatSuggestion } from '@/utils/Parser'
import {
  createParser,
  CUSTOM_DATE_FORMATS,
  findSimilarHeader,
  getDescriptionHeaders,
  getOverlappingParsers,
  normalizeHeader,
  toCustomBank,
  toCustomId,
} from '@/utils/Parser'
import { i18n } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

export const Field = {
  IGNORE: 'ignore',
  DATE: 'date',
  DESCRIPTION: 'description',
  AMOUNT: 'amount',
  IN: 'in',
  OUT: 'out',
  BALANCE: 'balance',
  REFERENCE: 'reference',
} as const

export type Field = (typeof Field)[keyof typeof Field]

/**
 * Multiple columns can only be mapped to the description (joined).
 */
const SINGLE_FIELDS: Field[] = [Field.DATE, Field.AMOUNT, Field.IN, Field.OUT, Field.BALANCE, Field.REFERENCE]

export type Draft = {
  /**
   * Field per column index, unmapped columns are ignored.
   */
  mapping: Record<number, Field>
  dateFormat: string
  numberFormat: CustomFormat['numberFormat']
  currency: Currency
  bankName: string
}

export const getFieldOptions = () => {
  return [
    { value: Field.IGNORE, label: i18n.t('DATA_PAGE.FORMAT_WIZARD.FIELDS.IGNORE') },
    { value: Field.DATE, label: i18n.t('DATA_PAGE.FORMAT_WIZARD.FIELDS.DATE') },
    { value: Field.DESCRIPTION, label: i18n.t('DATA_PAGE.FORMAT_WIZARD.FIELDS.DESCRIPTION') },
    { value: Field.AMOUNT, label: i18n.t('DATA_PAGE.FORMAT_WIZARD.FIELDS.AMOUNT') },
    { value: Field.IN, label: i18n.t('DATA_PAGE.FORMAT_WIZARD.FIELDS.IN') },
    { value: Field.OUT, label: i18n.t('DATA_PAGE.FORMAT_WIZARD.FIELDS.OUT') },
    { value: Field.BALANCE, label: i18n.t('DATA_PAGE.FORMAT_WIZARD.FIELDS.BALANCE') },
    { value: Field.REFERENCE, label: i18n.t('DATA_PAGE.FORMAT_WIZARD.FIELDS.REFERENCE') },
  ]
}

export const NUMBER_FORMAT_OPTIONS = [
  { value: 'en', label: '1,234.56' },
  { value: 'de', label: '1.234,56' },
] as const

export const CURRENCY_OPTIONS = Object.values(Currency)

export const getDateFormatOptions = (dateFormat: string) => {
  return uniq([...CUSTOM_DATE_FORMATS, dateFormat])
}

export const getInitialDraft = (): Draft => ({
  mapping: {},
  dateFormat: CUSTOM_DATE_FORMATS[0],
  numberFormat: 'en',
  currency: MISC.DEFAULT_CURRENCY,
  bankName: '',
})

/**
 * Maps `field` to the column, single fields are unmapped from their previous column.
 */
export const setField = (mapping: Draft['mapping'], index: number, field: Field): Draft['mapping'] => {
  const isSingle = SINGLE_FIELDS.includes(field)
  return Object.fromEntries(
    Object.entries({ ...mapping, [index]: field }).filter(
      ([key, value]) => Number(key) === index || !isSingle || value !== field,
    ),
  )
}

/**
 * Header without BOM and surrounding whitespace.
 */
export const cleanHeader = (header: string) => {
  return header.replace(/^﻿/, '').trim()
}

/**
 * Values of a column of the transaction rows (same column count as the header).
 */
export const getColumnValues = ([header = [], ...rows]: RowData[], index: number) => {
  return rows.filter((row) => row.length === header.length).map((row) => row[index] ?? '')
}

const getFieldHeaders = ({
  columns,
  extraColumns = {},
}: Pick<FormatDef, 'columns' | 'extraColumns'>): [Field, string][] => {
  const { amount } = columns
  const amountHeaders: [Field, string][] =
    amount.type === 'signed'
      ? [[Field.AMOUNT, amount.header]]
      : amount.type === 'inOut'
        ? [
            [Field.IN, amount.in],
            [Field.OUT, amount.out],
          ]
        : // Multiple signed columns can't be mapped
          []

  return [
    [Field.DATE, columns.date],
    ...getDescriptionHeaders(columns.description).map((header): [Field, string] => [Field.DESCRIPTION, header]),
    ...amountHeaders,
    ...(extraColumns.balance ? [[Field.BALANCE, extraColumns.balance] as [Field, string]] : []),
    ...(extraColumns.reference ? [[Field.REFERENCE, extraColumns.reference] as [Field, string]] : []),
  ]
}

const toMapping = (pairs: [Field, string][], findIndex: (header: string) => number) => {
  const mapping: Draft['mapping'] = {}

  pairs.forEach(([field, header]) => {
    const index = findIndex(header)
    if (index !== -1 && !mapping[index]) {
      mapping[index] = field
    }
  })

  return mapping
}

/**
 * Draft of a saved format, to show it read-only.
 */
export const toDraft = (format: CustomFormat): Draft => ({
  mapping: toMapping(getFieldHeaders(format), (header) => format.headers.indexOf(header)),
  dateFormat: format.dateFormat,
  numberFormat: format.numberFormat,
  currency: format.currency,
  bankName: format.bankName,
})

/**
 * Draft from a built-in format, its columns are mapped to the most similar headers.
 */
export const fromSuggestion = (headers: string[], { bank, format }: FormatSuggestion): Draft => ({
  mapping: toMapping(getFieldHeaders(format), (header) => findSimilarHeader(header, headers)),
  dateFormat: format.dateFormat,
  numberFormat: format.numberFormat ?? 'en',
  currency: bank.currency,
  bankName: bank.name,
})

type BuildResult = { format: CustomFormat; error: null } | { format: null; error: string }

/**
 * Validates the draft against the file, `section` starts with the header row.
 */
export const buildCustomFormat = (section: RowData[], draft: Draft): BuildResult => {
  const toError = (key: string, options?: Record<string, string>): BuildResult => ({
    format: null,
    error: i18n.t(`DATA_PAGE.FORMAT_WIZARD.ERRORS.${key}`, options),
  })

  const headers = (section[0] ?? []).map(cleanHeader)
  const pick = (field: Field) => headers.filter((header, index) => header && draft.mapping[index] === field)
  const [date] = pick(Field.DATE)
  const description = pick(Field.DESCRIPTION)
  const [amount] = pick(Field.AMOUNT)
  const [moneyIn] = pick(Field.IN)
  const [moneyOut] = pick(Field.OUT)
  const [balance] = pick(Field.BALANCE)
  const [reference] = pick(Field.REFERENCE)
  const bankName = draft.bankName.trim()

  if (!date) {
    return toError('DATE_REQUIRED')
  }

  if (!description.length) {
    return toError('DESCRIPTION_REQUIRED')
  }

  const amountDef: CustomFormat['columns']['amount'] | null =
    amount && !moneyIn && !moneyOut
      ? { type: 'signed', header: amount }
      : !amount && moneyIn && moneyOut
        ? { type: 'inOut', in: moneyIn, out: moneyOut }
        : null

  if (!amountDef) {
    return toError('AMOUNT_REQUIRED')
  }

  if (!bankName) {
    return toError('BANK_NAME_REQUIRED')
  }

  // Columns are read by header name, so the first one would be read
  const duplicate = [date, ...description, amount, moneyIn, moneyOut, balance, reference]
    .filter(Boolean)
    .find((header) => headers.filter((other) => normalizeHeader(other) === normalizeHeader(header)).length > 1)

  if (duplicate) {
    return toError('DUPLICATE_HEADER', { header: duplicate })
  }

  const format: CustomFormat = {
    id: toCustomId(),
    created: formatISO(new Date()),
    bankName,
    currency: draft.currency,
    dateFormat: draft.dateFormat,
    numberFormat: draft.numberFormat,
    headers: uniq(headers.filter(Boolean)),
    columns: { date, description, amount: amountDef },
    extraColumns: { ...(balance ? { balance } : {}), ...(reference ? { reference } : {}) },
  }

  const bank = toCustomBank(format)
  const parser = createParser(bank, bank.formats[0])

  try {
    const transactions = parser.parse(section)

    if (!transactions.length) {
      return toError('NO_TRANSACTIONS')
    }

    const invalid = transactions.find(({ value }) => {
      try {
        Big(value)
        return false
      } catch {
        return true
      }
    })

    if (invalid) {
      return toError('INVALID_AMOUNT', { value: invalid.value })
    }
  } catch (err) {
    return toError('INVALID_DATA', { message: getErrorMessage(err) })
  }

  const [overlap] = getOverlappingParsers(parser)

  if (overlap) {
    return toError('OVERLAP', { name: `${overlap.bankName} ${overlap.accountName}` })
  }

  return { format, error: null }
}

/**
 * New GitHub issue with the format, without any transactions.
 */
export const getSubmitUrl = (format: CustomFormat) => {
  const definition = JSON.stringify(omit(format, ['id', 'created']), null, 2)
  const body = ['Please add support for this bank format.', '', '```json', definition, '```'].join('\n')
  const params = new URLSearchParams({ title: `New bank format: ${format.bankName}`, body })
  return `${MISC.GITHUB_URL}/issues/new?${params}`
}
