import type { FixedLocaleOptions, NumberString } from '@/types'
import { Currency, UserLocale } from '@/types-enums'
import { getCurrencySymbol, getMaxDecimalsForCurrency } from '@/utils/Currency'
import { Big } from '@/lib/w-big'

export const getDecimals = (value: NumberString): number => {
  return value.includes('.') ? value.split('.')[1].length : 0
}

export const getRoundedValue = (value: NumberString | '', round: number): NumberString => {
  if (!value) {
    return '0'
  }
  if (round < 0 || !Number.isInteger(round)) {
    throw new Error(`Round "${round}" must be a positive integer!`)
  }
  return getDecimals(value) <= round ? value : Big(value).toFixed(round)
}

export const parseGermanNumber = (numberString: string): string => {
  return numberString.replace(/\./g, '').replace(/,/g, '.')
}

/**
 * Gets the thousands and decimal separators for a given locale
 *
 * @param locale - The locale to get separators for
 * @returns Object containing thousandsSeparator and decimalSeparator
 */
const getNumberSeparators = (locale: UserLocale): { thousandsSeparator: string; decimalSeparator: string } => {
  switch (locale) {
    // @locale-updates
    case UserLocale.DE:
      return {
        thousandsSeparator: '.',
        decimalSeparator: ',',
      }
    case UserLocale.EN:
    default:
      return {
        thousandsSeparator: ',',
        decimalSeparator: '.',
      }
  }
}

/**
 * Formats a number string with locale-specific separators
 *
 * @param value - The number to format
 * @param locale - The locale to use
 * @returns Formatted number string with locale-specific separators
 */
const toLocaleString = (value: NumberString, locale: UserLocale): string => {
  const { thousandsSeparator, decimalSeparator } = getNumberSeparators(locale)
  const isNegative = Big(value).lt(0)
  const unsignedValue = isNegative ? value.slice(1) : value
  const [integerPart, decimalPart = ''] = unsignedValue.split('.')
  const formattedInteger = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousandsSeparator}`)
  const formattedNumber = decimalPart ? `${formattedInteger}${decimalSeparator}${decimalPart}` : formattedInteger

  return isNegative ? `-${formattedNumber}` : formattedNumber
}

/**
 * Converts a number to a string with `round` and `locale`
 *
 * @param value - Number to format
 * @param round - Number of digits after the decimal point
 * @param locale - Locale to use for formatting (determines separator and decimal point formatting)
 * @param options - Optional options
 * @param options.trimTrailingZeros - Whether to trim trailing zeros, e.g. "7.00" to "7"
 */
export const toFixedLocale = (
  value: NumberString,
  round: number,
  locale: UserLocale,
  { trimTrailingZeros = false }: FixedLocaleOptions = {},
): string => {
  const roundedValue = getRoundedValue(value, round)
  let decimalPlaces = round

  if (trimTrailingZeros) {
    decimalPlaces = getDecimals(roundedValue)
    if (decimalPlaces > 0 && roundedValue.split('.')[1] === '0'.repeat(decimalPlaces)) {
      decimalPlaces = 0
    }
  }

  return toLocaleString(Big(roundedValue).toFixed(decimalPlaces), locale)
}

/**
 * Like `toFixedLocale`, rounded to the currency's decimals and prefixed with its symbol, e.g. "-€1.00"
 */
export const toFixedLocaleCurrency = (
  value: NumberString,
  currency: Currency,
  locale: UserLocale,
  options: FixedLocaleOptions = {},
): string => {
  const formatted = toFixedLocale(value, getMaxDecimalsForCurrency(currency), locale, options)
  const isNegative = formatted.startsWith('-')
  const symbol = getCurrencySymbol(currency)

  return isNegative ? `-${symbol}${formatted.slice(1)}` : `${symbol}${formatted}`
}
