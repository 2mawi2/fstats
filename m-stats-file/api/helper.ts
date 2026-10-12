import type { StatsFile, StatsFileAtRest } from '@/types'
import { zStatsFile } from '@/types'
import { Currency, StatsFileStatus } from '@/types-enums'
import { SHA256 } from '@/utils/Encryption'
import { parseOrThrow } from '@/lib/zod'

export const syncStatsFile = (dataToSync: StatsFile): StatsFileAtRest => {
  return parseOrThrow(zStatsFile, dataToSync, 'Cannot sync StatsFile')
}

export const parseStatsFile = (dataToParse: StatsFileAtRest): StatsFile => {
  if (dataToParse.status !== StatsFileStatus.PARSED) {
    return dataToParse
  }

  return {
    ...dataToParse,
    sections: dataToParse.sections.map((section) => ({
      ...section,
      transactions: section.transactions.map((row) => ({
        ...row,
        currency: row.currency as Currency,
      })),
    })),
  }
}

export const getFileHash = async (file: Blob): Promise<string> => {
  return SHA256.encrypt(await file.arrayBuffer())
}
