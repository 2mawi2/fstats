import { eachDayOfInterval, format, isValid, parse, parseISO, startOfDay } from 'date-fns'
import { de, enGB } from 'date-fns/locale'

import type { DateFnsLocale, DateRange, SelectOptionWithType, Transaction } from '@/types'
import { DateFormat, SortOrder, UserLocale } from '@/types-enums'

/**
 * Date strings are parsed with `options.formatFrom`, ISO by default.
 */
export const toDisplayDate = (
  date: Date | string,
  locale: UserLocale,
  options: {
    formatTo: string
    formatFrom?: string
  },
): string => {
  if (!date) {
    throw new Error('Must be Date or string')
  }

  const dateObject =
    date instanceof Date ? date : options?.formatFrom ? parse(date, options.formatFrom, new Date()) : parseISO(date)

  if (!isValid(dateObject)) {
    throw new Error('Invalid date')
  }

  return format(dateObject, options.formatTo, { locale: getDateFnsLocale(locale) })
}

/**
 * Parsed with `options.formatFrom`, ISO by default.
 */
export const toDate = (date: string, options?: { formatFrom?: string }): Date => {
  const dateObject = options?.formatFrom ? parse(date, options.formatFrom, new Date()) : parseISO(date)

  if (!isValid(dateObject)) {
    throw new Error('Invalid date')
  }

  return dateObject
}

export const getDateFormatSelectOptions = (locale: UserLocale): SelectOptionWithType<DateFormat>[] => {
  return Object.entries(DateFormat).map(([, value]) => {
    return {
      value,
      label: toDisplayDate(new Date(), locale, { formatTo: value }),
    }
  })
}

const getDateFnsLocale = (locale: UserLocale): DateFnsLocale => {
  switch (locale) {
    // @locale-updates
    case UserLocale.EN:
      return enGB
    case UserLocale.DE:
      return de
    default:
      throw new Error(`Unsupported locale: ${locale}`)
  }
}

/**
 * This method will take an array of dates and ensure that none of them have exactly the same timestamp.
 */
export const getUniqueTimestamps = ({
  dates,
  dateFormat,
  sortOrder,
}: {
  dates: Date[]
  dateFormat: string
  sortOrder: SortOrder
}): Date[] => {
  const { hasTime, hasSeconds } = getDateFormatPrecision(dateFormat)

  if (hasTime && hasSeconds) {
    return dates
  }

  if (!hasTime) {
    return attachUniqueSecondsToDates({
      dates,
      sortOrder,
      getGroupKey: (date) => startOfDay(date).getTime(),
      getBaseTimestamp: (date) => startOfDay(date).getTime(),
    })
  }

  return attachUniqueSecondsToDates({
    dates,
    sortOrder,
    getGroupKey: (date) => date.getTime(),
    getBaseTimestamp: (date) => date.getTime(),
  })
}

// FIXME: Ensure error handling for invalid date ranges, e.g. picking start date after end date and vice versa
export const getDaysInRange = ({ start, end }: DateRange): Date[] => {
  const interval = { start, end }
  return eachDayOfInterval(interval)
}

const attachUniqueSecondsToDates = ({
  dates,
  sortOrder,
  getGroupKey,
  getBaseTimestamp,
}: {
  dates: Date[]
  sortOrder: SortOrder
  getGroupKey: (date: Date) => number
  getBaseTimestamp: (date: Date) => number
}): Date[] => {
  const totalByGroup = new Map<number, number>()
  const seenByGroup = new Map<number, number>()

  dates.forEach((date) => {
    const groupKey = getGroupKey(date)
    totalByGroup.set(groupKey, (totalByGroup.get(groupKey) ?? 0) + 1)
  })

  return dates.map((date) => {
    const groupKey = getGroupKey(date)
    const seen = seenByGroup.get(groupKey) ?? 0
    const total = totalByGroup.get(groupKey) ?? 1
    const secondOffset = sortOrder === 'asc' ? seen : total - seen - 1

    seenByGroup.set(groupKey, seen + 1)

    return new Date(getBaseTimestamp(date) + secondOffset * 1000)
  })
}

const getDateFormatPrecision = (
  dateFormat: string,
): {
  hasTime: boolean
  hasSeconds: boolean
} => {
  const hasHours = /[HhKk]/.test(dateFormat)
  const hasMinutes = /m/.test(dateFormat)
  const hasSeconds = /s/.test(dateFormat)

  return {
    hasTime: hasHours || hasMinutes || hasSeconds,
    hasSeconds,
  }
}

/**
 * Day (`yyyy-MM-dd`) of a transaction as it was parsed, ignoring time zones.
 */
export const getTransactionDay = (transaction: Pick<Transaction, 'date'>) => {
  return transaction.date.split('T')[0]
}

/**
 * Day (`yyyy-MM-dd`) of a date, same format as `getTransactionDay`.
 */
export const toDayKey = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}
