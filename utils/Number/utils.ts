import type { FixedLocaleAmountOptions, FixedLocaleOptions, NumberString } from '@/types'
import { Currency, UserLocale } from '@/types-enums'
import { getCurrencySymbol, getMaxDecimalsForCurrency } from '@/utils/Currency'
import { Big } from '@/lib/w-big'

const getDecimals = (value: NumberString): number => {
  return value.includes('.') ? value.split('.')[1].length : 0
}

const getRoundedValue = (value: NumberString | '', round: number): NumberString => {
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
 * Rounded to `round` decimals. `trimTrailingZeros` turns e.g. "7.00" into "7".
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
 * Like `toFixedLocale`, rounded to the currency's decimals, e.g. "-1.00"
 *
 * @param options.showPlusSign - Whether to prefix positive values with "+", e.g. "+1.00"
 */
export const toFixedLocaleAmount = (
  value: NumberString,
  currency: Currency,
  locale: UserLocale,
  { showPlusSign = false, ...options }: FixedLocaleAmountOptions = {},
): string => {
  const formatted = toFixedLocale(value, getMaxDecimalsForCurrency(currency), locale, options)

  return showPlusSign && Big(value).gt(0) ? `+${formatted}` : formatted
}

/**
 * Like `toFixedLocaleAmount`, prefixed with the currency symbol, e.g. "-€1.00"
 */
export const toFixedLocaleCurrency = (
  value: NumberString,
  currency: Currency,
  locale: UserLocale,
  options: FixedLocaleAmountOptions = {},
): string => {
  const formatted = toFixedLocaleAmount(value, currency, locale, options)
  const sign = formatted.startsWith('-') || formatted.startsWith('+') ? formatted[0] : ''
  const symbol = getCurrencySymbol(currency)

  return `${sign}${symbol}${formatted.slice(sign.length)}`
}
