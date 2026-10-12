import type { ParsedStatsFile, StatsFile } from '@/types'
import { StatsFileErrorCode, StatsFileStatus } from '@/types-enums'

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
