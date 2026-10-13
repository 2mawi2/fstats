import { AccountType, Country, Currency } from '@/types-enums'
import type { BankAccountId, ParserId } from '@/utils/Parser/registry'

import type { RowData } from './services/stats-file'
import type { Transaction } from './services/transaction'

export type Parser = {
  id: ParserId
  bankAccountId: BankAccountId
  bankName: string
  accountName: string
  currency: Currency
  /**
   * Headers that must be present in a header row of this format.
   */
  requiredHeaders: string[]
  /**
   * Required headers missing from `row`, empty if `row` is a header row of this format.
   */
  getMissingHeaders: (row: RowData) => string[]
  /**
   * The header row and transaction rows of a section (header in the first row) as is, without footers.
   */
  extractRows: (section: RowData[]) => { header: RowData; rows: RowData[] }
  parse: (section: RowData[]) => Transaction[]
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
   * Parser ID: `${bank.id}__${accountType}__${variant}`, bank account ID: `${bank.id}__${accountType}`.
   */
  accountType: AccountType
  /**
   * Display name, e.g. "Giro" or "Current Account".
   */
  accountName: string
  /**
   * Part of the parser ID, distinguishes multiple CSV formats of the same account ("default", "legacy", etc.).
   */
  variant: string
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
  /**
   * Shown on the home page.
   */
  country: Country
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
  variant: infer V extends string
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
