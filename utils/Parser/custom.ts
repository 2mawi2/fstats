import type { CustomParser, CustomParserMapping, FormatDef, Parser } from '@/types'
import { AccountType } from '@/types-enums'

import { createParser } from './create-parser'
import type { CustomBankId } from './registry'

/**
 * Part of the persisted parser and bank account IDs, so never change it.
 */
export const toCustomBankId = (id: string): CustomBankId => {
  return `custom_${id.replace(/-/g, '').toLowerCase()}`
}

/**
 * The format of a mapping, its parser ID is `${toCustomBankId(id)}__current__default`.
 */
export const toCustomFormat = (mapping: CustomParserMapping): FormatDef => {
  return {
    accountType: AccountType.CURRENT,
    accountName: mapping.accountName,
    variant: 'default',
    dateFormat: mapping.dateFormat,
    numberFormat: mapping.numberFormat,
    headers: mapping.headers,
    columns: mapping.columns,
    extraColumns: mapping.extraColumns,
  }
}

/**
 * Parser of a mapping, e.g. to preview it before it's saved.
 */
export const createMappingParser = (id: string, mapping: CustomParserMapping): Parser => {
  return createParser(
    { id: toCustomBankId(id), name: mapping.bankName, currency: mapping.currency },
    toCustomFormat(mapping),
  )
}

let customParsers: Parser[] = []

/**
 * Registers the user's custom parsers, so files are matched against them (after the built-in ones) and their parser
 * IDs can be looked up. Synchronous lookups need them in memory, so this is called whenever they change.
 */
export const setCustomParsers = (parsers: CustomParser[]) => {
  customParsers = parsers.map((parser) => createMappingParser(parser.id, parser))
}

export const getCustomParsers = () => {
  return customParsers
}
