import { uniqBy } from 'lodash'

import type { ParsedStatsFile, StatsFile, Transaction } from '@/types'
import { StatsFileErrorCode, StatsFileStatus } from '@/types-enums'
import { parseFiles } from '@/utils/FileParser'
import { getParserCurrency, PARSER_VERSION } from '@/utils/Parser'

import { getFiles, updateFiles } from '../api'

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

/**
 * IDs are content hashes, so this removes identical transactions (e.g. from overlapping statements). Keeps the first.
 */
export const getUniqueTransactions = <T extends Transaction>(transactions: T[]) => {
  return uniqBy(transactions, 'id')
}

/**
 * Re-parses stored files that were parsed with an older parser version, e.g. to update their transaction IDs.
 */
export const reparseOutdatedFiles = async () => {
  const files = await getFiles()
  const outdatedFiles = files.filter((file) => isParsed(file) && file.parserVersion !== PARSER_VERSION)

  if (outdatedFiles.length) {
    await updateFiles(await parseFiles(outdatedFiles))
  }
}
