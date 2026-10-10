import type { RowData, StatsFile, StatsFileState, Transaction } from '@/types'
import { zStatsFileState } from '@/types'
import { DateFormat, StatsFileErrorCode, StatsFileStatus, UserLocale } from '@/types-enums'

import { getErrorMessage, getMatchingParser, readCsvRows } from './helper'

export const parseFiles = async (
  files: StatsFile[],
  locale: UserLocale,
  dateFormat: DateFormat,
): Promise<{ id: string; state: StatsFileState }[]> => {
  return Promise.all(
    files.map(async (file) => ({ id: file.id, state: await parseFile(file.file, locale, dateFormat) })),
  )
}

export const parseFile = async (file: File, locale: UserLocale, dateFormat: DateFormat): Promise<StatsFileState> => {
  // 1. Read the CSV rows
  let rows: RowData[]
  try {
    rows = await readCsvRows(file)
  } catch (err) {
    return _toError(StatsFileErrorCode.UNREADABLE, `Reading CSV failed: ${getErrorMessage(err)}`)
  }

  // 2. Find a matching parser
  const { parser, error } = getMatchingParser(rows)
  if (!parser) {
    return _toError(StatsFileErrorCode.UNSUPPORTED_FORMAT, error)
  }

  // 3. Transform rows to transactions
  let transactions: Transaction[]
  try {
    transactions = parser.parse(rows, locale, dateFormat)
  } catch (err) {
    console.error(`Parsing failed with ${parser.id}:`, getErrorMessage(err))
    return _toError(StatsFileErrorCode.INVALID_DATA, `Parsing "${parser.id}" failed: ${getErrorMessage(err)}`)
  }

  // 4. Validate so consumers are working with valid data
  const res = zStatsFileState.safeParse({ status: StatsFileStatus.PARSED, parserId: parser.id, transactions })

  if (!res.success) {
    const errors = res.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
    console.error(`Validation failed for parser "${parser.id}":`, errors)
    return _toError(StatsFileErrorCode.INVALID_DATA, `Validating "${parser.id}" failed: ${errors}`)
  }

  return res.data
}

const _toError = (code: StatsFileErrorCode, message: string): StatsFileState => {
  return { status: StatsFileStatus.ERROR, error: { code, message } }
}
