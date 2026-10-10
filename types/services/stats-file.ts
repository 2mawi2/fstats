import { z } from 'zod'

import { StatsFileStatus, zStatsFileErrorCode } from '@/types-enums'
import { zParserId } from '@/utils/Parser/registry'

import { zDateTimeString, zIdString, zNonEmptyString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'
import type { RDZFileWithPath } from '../lib/react-dropzone'
import { zRDZFileWithPath } from '../lib/react-dropzone'
import { zTransaction, zTransactionAtRest } from './transaction'

export const zRowData = z.array(z.string())

export type RowData = z.infer<typeof zRowData>

export const zStatsFileError = z.object({
  code: zStatsFileErrorCode,
  message: z.string(),
})

export type StatsFileError = z.infer<typeof zStatsFileError>

const zStatsFileMeta = z.object({
  id: zIdString,
  created: zDateTimeString,
  modified: zDateTimeString,
  file: zRDZFileWithPath,
  /**
   * SHA-256 of the file content, used to detect duplicate uploads. `null` for rejected files.
   */
  hash: zNonEmptyString.nullable(),
})

const zStatsFileParsing = z.object({ status: z.literal(StatsFileStatus.PARSING) })
const zStatsFileErrorState = z.object({ status: z.literal(StatsFileStatus.ERROR), error: zStatsFileError })

/**
 * The status dependent part of a file, i.e. the result of parsing.
 */
export const zStatsFileState = z.discriminatedUnion('status', [
  zStatsFileParsing,
  z.object({ status: z.literal(StatsFileStatus.PARSED), parserId: zParserId, transactions: z.array(zTransaction) }),
  zStatsFileErrorState,
])

export type StatsFileState = z.infer<typeof zStatsFileState>

export const zStatsFile = z.intersection(zStatsFileMeta, zStatsFileState)

export type StatsFile = z.infer<typeof zStatsFile>

export type ParsedStatsFile = Extract<StatsFile, { status: typeof StatsFileStatus.PARSED }>

export type NewStatsFile = {
  file: RDZFileWithPath
  /**
   * Set if the file was rejected on upload (e.g. wrong type or too large).
   */
  rejection?: string
}

export const zStatsFileAtRest = z.intersection(
  zStatsFileMeta,
  z.discriminatedUnion('status', [
    zStatsFileParsing,
    z.object({
      status: z.literal(StatsFileStatus.PARSED),
      parserId: zParserId,
      transactions: z.array(zTransactionAtRest),
    }),
    zStatsFileErrorState,
  ]),
)

export type StatsFileAtRest = z.infer<typeof zStatsFileAtRest>

// Safety checks
const assertKeys: _KeysCheck<StatsFile, StatsFileAtRest> = true
_zKeysCheck(zStatsFile, zStatsFileAtRest, assertKeys)
