import { z } from 'zod'

// -------------------------------------------------------

export const ColorMode = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark',
} as const

export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode]

// -------------------------------------------------------

/**
 * The user's chosen locale, under the hood determines the language across the app.
 */
export const UserLocale = {
  EN: 'en',
  DE: 'de',
} as const

export const zUserLocale = z.enum([UserLocale.EN, UserLocale.DE] as const)

export type UserLocale = z.infer<typeof zUserLocale>

// -------------------------------------------------------

/**
 * The status of a file, usually goes directly to "parsing" and when parsed to "parsed".
 */
export const StatsFileStatus = {
  PARSING: 'parsing',
  PARSED: 'parsed',
  ERROR: 'error',
} as const

export type StatsFileStatus = (typeof StatsFileStatus)[keyof typeof StatsFileStatus]

// -------------------------------------------------------

/**
 * Why a file has the "error" status.
 */
export const StatsFileErrorCode = {
  REJECTED: 'rejected', // Wrong file type or too large
  DUPLICATE: 'duplicate', // Same content as an existing file
  UNREADABLE: 'unreadable', // CSV could not be read
  UNSUPPORTED_FORMAT: 'unsupported_format', // No parser matched
  INVALID_DATA: 'invalid_data', // Parser matched, but parsing or validation failed
} as const

export const zStatsFileErrorCode = z.enum([
  StatsFileErrorCode.REJECTED,
  StatsFileErrorCode.DUPLICATE,
  StatsFileErrorCode.UNREADABLE,
  StatsFileErrorCode.UNSUPPORTED_FORMAT,
  StatsFileErrorCode.INVALID_DATA,
] as const)

export type StatsFileErrorCode = z.infer<typeof zStatsFileErrorCode>

// -------------------------------------------------------

export const DateFormat = {
  DMY_LONG: 'd MMMM yyyy',
  DMY_SHORT: 'd MMM yyyy',
  MDY_LONG: 'MMMM d, yyyy',
  MDY_SHORT: 'MMM d, yyyy',
  DMY_SLASH: 'dd/MM/yyyy',
  DMY_DOT: 'dd.MM.yyyy',
  DMY_DASH: 'dd-MM-yyyy',
  YMD_SLASH: 'yyyy/MM/dd',
  YMD_DOT: 'yyyy.MM.dd',
  YMD_DASH: 'yyyy-MM-dd',
  YMD: 'yyyyMMdd',
} as const

export const zDateFormat = z.enum([
  DateFormat.DMY_LONG,
  DateFormat.DMY_SHORT,
  DateFormat.MDY_LONG,
  DateFormat.MDY_SHORT,
  DateFormat.DMY_SLASH,
  DateFormat.DMY_DOT,
  DateFormat.DMY_DASH,
  DateFormat.YMD_SLASH,
  DateFormat.YMD_DOT,
  DateFormat.YMD_DASH,
  DateFormat.YMD,
] as const)

export type DateFormat = z.infer<typeof zDateFormat>

// -------------------------------------------------------

export const Currency = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CHF: 'CHF',
  SEK: 'SEK',
  BTC: 'BTC',
  CNY: 'CNY',
  RUB: 'RUB',
  JPY: 'JPY',
  INR: 'INR',
  ZAR: 'ZAR',
} as const

export const zCurrency = z.enum([
  Currency.USD,
  Currency.EUR,
  Currency.GBP,
  Currency.CHF,
  Currency.SEK,
  Currency.BTC,
  Currency.CNY,
  Currency.RUB,
  Currency.JPY,
  Currency.INR,
  Currency.ZAR,
] as const)

export type Currency = z.infer<typeof zCurrency>

// -------------------------------------------------------

/**
 * Country of a bank, ISO 3166-1 alpha-2.
 */
export const Country = {
  DE: 'DE',
  GB: 'GB',
  ZA: 'ZA',
} as const

export type Country = (typeof Country)[keyof typeof Country]

// -------------------------------------------------------

/**
 * Part of the persisted parser and bank account IDs.
 */
export const AccountType = {
  CURRENT: 'current',
  SAVINGS: 'savings',
  CREDIT_CARD: 'credit_card',
} as const

export type AccountType = (typeof AccountType)[keyof typeof AccountType]

// -------------------------------------------------------

export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

// -------------------------------------------------------
