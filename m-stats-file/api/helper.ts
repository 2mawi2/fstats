import type { StatsFile, StatsFileAtRest } from '@/types'
import { zStatsFile } from '@/types'
import { Currency, StatsFileStatus } from '@/types-enums'
import { SHA256 } from '@/utils/Encryption'

export const syncStatsFile = (dataToSync: StatsFile): StatsFileAtRest => {
  const res = zStatsFile.safeParse(dataToSync)

  if (!res.success) {
    const errors = res.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
    throw new Error(`Cannot sync StatsFile: ${errors}`)
  }

  return res.data
}

export const parseStatsFile = (dataToParse: StatsFileAtRest): StatsFile => {
  if (dataToParse.status !== StatsFileStatus.PARSED) {
    return dataToParse
  }

  return {
    ...dataToParse,
    transactions: dataToParse.transactions.map((row) => ({
      ...row,
      currency: row.currency as Currency,
    })),
  }
}

export const getFileHash = async (file: Blob): Promise<string> => {
  return SHA256.encrypt(await file.arrayBuffer())
}
