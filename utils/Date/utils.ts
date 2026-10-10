import { eachDayOfInterval, format, isAfter, isBefore, isSameDay, isValid, parse, parseISO, startOfDay } from 'date-fns'
import { de, enGB } from 'date-fns/locale'

import type { DateFnsLocale, DateRange, DateTimeString, SelectOptionWithType, SystemDateString } from '@/types'
import { DateFormat, SortOrder, UserLocale, WeekStartsOn, WeekStartsOnValue } from '@/types-enums'
import { MISC } from '@/common'
import { i18n } from '@/lib/i18n'

import { logger } from '../Logger'
import { attachUniqueSecondsToDates, getDateFormatPrecision } from './helper'

/**
 * Converts a date string or date object to "dd/MM/yyyy" or `options.formatTo` format
 *
 * @param date - Date string or date object to convert
 * @param options - Optional options
 * @param options_formatFrom - The format to convert from when supplying a date string - defaults to ISO date format
 * @param options_formatTo - The format to return
 *
 * @returns Date string in `displayDate` format or `formatTo` format.
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
 * Converts a date string to a JS Date object
 *
 * @param date - Date string or date object to convert
 * @param options - Optional options
 * @param options_formatFrom - The format to convert from when supplying a date string - defaults to ISO date format
 *
 * @returns Date string in `displayDate` format or `formatTo` format.
 */
export const toDate = (date: string, options?: { formatFrom?: string }): Date => {
  let dateObject

  try {
    dateObject = options?.formatFrom ? parse(date, options.formatFrom, new Date()) : parseISO(date)
  } catch (err) {
    console.error('Invalid date:', err)
    throw new Error('Invalid date')
  }

  if (!isValid(dateObject)) {
    throw new Error('Invalid date')
  }

  return dateObject
}

export const getWeekStartsOnValue = (weekStartsOn: WeekStartsOn): WeekStartsOnValue => {
  switch (weekStartsOn) {
    case WeekStartsOn.SUNDAY:
      return 0
    case WeekStartsOn.MONDAY:
      return 1
    default:
      logger('warn', 'getWeekStartsOnValue()', `No value exists for WeekStartsOn "${weekStartsOn}"`)
      return 1
  }
}

export const getDateFormatLabel = (dateFormat: DateFormat) => {
  switch (dateFormat) {
    case DateFormat.DMY_LONG:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.DMY_LONG')
    case DateFormat.DMY_SHORT:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.DMY_SHORT')
    case DateFormat.MDY_LONG:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.MDY_LONG')
    case DateFormat.MDY_SHORT:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.MDY_SHORT')
    case DateFormat.DMY_SLASH:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.DMY_SLASH')
    case DateFormat.DMY_DOT:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.DMY_DOT')
    case DateFormat.DMY_DASH:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.DMY_DASH')
    case DateFormat.YMD_SLASH:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.YMD_SLASH')
    case DateFormat.YMD_DOT:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.YMD_DOT')
    case DateFormat.YMD_DASH:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.YMD_DASH')
    case DateFormat.YMD:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.YMD')
    default:
      logger('warn', 'getDateFormatLabel()', `No translation exists for date format "${dateFormat}"`)
      return dateFormat
  }
}

export const getDateFormatSelectOptions = (locale: UserLocale): SelectOptionWithType<DateFormat>[] => {
  return Object.entries(DateFormat).map(([, value]) => {
    return {
      value,
      label: toDisplayDate(new Date(), locale, { formatTo: value }),
    }
  })
}

export const sortByDate = (dateA: SystemDateString, dateB: SystemDateString, orderBy: SortOrder): number => {
  const timeA = parse(dateA, MISC.SYSTEM_DATE_FORMAT, new Date()).getTime()
  const timeB = parse(dateB, MISC.SYSTEM_DATE_FORMAT, new Date()).getTime()
  return orderBy === 'asc' ? timeA - timeB : timeB - timeA
}

export const sortByDateIso = (dateA: DateTimeString, dateB: DateTimeString, orderBy: SortOrder): number => {
  const timeA = parseISO(dateA).getTime()
  const timeB = parseISO(dateB).getTime()
  return orderBy === 'asc' ? timeA - timeB : timeB - timeA
}

export const isInRange = (date: Date, { start, end }: DateRange): boolean => {
  if (end) {
    return isSameDay(date, start) || isSameDay(date, end) || (isAfter(date, start) && isBefore(date, end))
  }
  return isSameDay(date, start) || isAfter(date, start)
}

export const getDateFnsLocale = (locale: UserLocale): DateFnsLocale => {
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
