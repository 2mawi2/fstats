import type { ParsedStatsFile, StatsFile } from '@/types'
import { StatsFileErrorCode, StatsFileStatus } from '@/types-enums'
import { getParserCurrency } from '@/utils/Parser'

export const isParsed = (file: StatsFile): file is ParsedStatsFile => {
  return file.status === StatsFileStatus.PARSED
}

/**
 * Files which are broken, as opposed to `isUnknown()` files which are valid CSVs from an unsupported bank.
 */
export const isError = (file: StatsFile) => {
  return file.status === StatsFileStatus.ERROR && file.error.code !== StatsFileErrorCode.UNSUPPORTED_FORMAT
}

export const isUnknown = (file: StatsFile) => {
  return file.status === StatsFileStatus.ERROR && file.error.code === StatsFileErrorCode.UNSUPPORTED_FORMAT
}

export const getFileTransactions = (file: ParsedStatsFile) => {
  return file.sections.flatMap((section) => section.transactions)
}

/**
 * All sections of a file are from the same bank, so they share the currency.
 */
export const getFileCurrency = (file: ParsedStatsFile) => {
  return getParserCurrency(file.sections[0].parserId)
}
