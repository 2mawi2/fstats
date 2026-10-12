import { AccountType, Currency } from '@/types-enums'
import type { BankAccountId, ParserId } from '@/utils/Parser/registry'

import type { RowData } from './services/stats-file'
import type { Transaction } from './services/transaction'

export type DetectResult =
  | { match: true }
  | {
      match: false
      reason: string
      /**
       * 0..1 share of required headers found. 1 = header matched but no valid rows.
       */
      closeness: number
    }

export type Parser = {
  id: ParserId
  bankAccountId: BankAccountId
  bankName: string
  accountName: string
  currency: Currency
  detect: (rows: RowData[]) => DetectResult
  /**
   * The header row and transaction rows as is, without preambles, footers or other sections.
   */
  extractRows: (rows: RowData[]) => { header: RowData; rows: RowData[] } | null
  parse: (rows: RowData[]) => Transaction[]
}

// Bank definitions

export type ExtraField = keyof NonNullable<Transaction['extra']>

/**
 * A CSV header of the file. Optional headers aren't always present and aren't required for detection.
 */
export type HeaderDef<H extends string = string> = H | { readonly header: H; readonly optional: true }

/**
 * - `signed`: one signed column
 * - `inOut`: money in / money out columns, out is always negative
 * - `firstOf`: first non-empty signed column
 */
export type AmountColumnDef<H extends string = string> =
  | { readonly type: 'signed'; readonly header: H }
  | { readonly type: 'inOut'; readonly in: H; readonly out: H }
  | { readonly type: 'firstOf'; readonly headers: readonly H[] }

/**
 * Multiple headers are joined (empty values are skipped).
 */
export type DescriptionColumnDef<H extends string = string> = H | readonly H[]

export type FormatDef<H extends string = string> = {
  /**
   * Part of the persisted IDs.
   * Parser ID: `${bank.id}__${accountType}__${version}`, bank account ID: `${bank.id}__${accountType}`.
   */
  accountType: AccountType
  /**
   * Display name, e.g. "Giro" or "Current Account".
   */
  accountName: string
  /**
   * Part of the parser ID. "1" for the first CSV format of an account, then "2", "3", etc.
   */
  version: string
  dateFormat: string
  /**
   * 'de' = "1.234,56". 'en' = "1,234.56". Defaults to 'en'.
   */
  numberFormat?: 'en' | 'de'
  /**
   * All CSV headers of the file, used for detection. A file matches if all non-optional headers are present (any
   * order), unlisted headers are logged but still match.
   */
  headers: readonly HeaderDef<H>[]
  /**
   * Core transaction fields, headers must be listed in `headers`.
   */
  columns: { date: H; description: DescriptionColumnDef<H>; amount: AmountColumnDef<H> }
  /**
   * Stored in `Transaction['extra']`, headers must be listed in `headers`.
   */
  extraColumns?: Partial<Record<ExtraField, H>>
}

export type BankDef = {
  /**
   * Part of the persisted IDs.
   */
  id: string
  name: string
  currency: Currency
  formats: readonly FormatDef[]
}

type HeaderNames<F> = F extends { headers: readonly (infer D)[] }
  ? D extends string
    ? D
    : D extends { header: infer H extends string }
      ? H
      : never
  : never

/**
 * Checks that `columns` and `extraColumns` only reference headers listed in `headers`.
 */
export type ValidFormats<F extends readonly FormatDef[]> = { [K in keyof F]: FormatDef<HeaderNames<F[K]>> }

type ParserIdOf<BankId extends string, F> = F extends {
  accountType: infer A extends string
  version: infer V extends string
}
  ? `${BankId}__${A}__${V}`
  : never

type AccountIdOf<BankId extends string, F> = F extends { accountType: infer A extends string }
  ? `${BankId}__${A}`
  : never

export type ParserIds<B> = B extends { id: infer BankId extends string; formats: readonly (infer F)[] }
  ? ParserIdOf<BankId, F>
  : never

export type AccountIds<B> = B extends { id: infer BankId extends string; formats: readonly (infer F)[] }
  ? AccountIdOf<BankId, F>
  : never
