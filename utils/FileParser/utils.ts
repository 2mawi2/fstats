import { parse } from 'papaparse'

import type { Parser, PPRowData, RowData, StatsFile, StatsFileState, Transaction } from '@/types'
import { zStatsFileState } from '@/types'
import { StatsFileErrorCode, StatsFileStatus } from '@/types-enums'
import { AVAILABLE_PARSERS } from '@/utils/Parser'

export const parseFiles = async (files: StatsFile[]): Promise<{ id: string; state: StatsFileState }[]> => {
  return Promise.all(files.map(async (file) => ({ id: file.id, state: await parseFile(file.file) })))
}

const parseFile = async (file: File): Promise<StatsFileState> => {
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
    transactions = parser.parse(rows)
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

// Many bank exports (e.g. ING) are Windows-1252, so fall back when the file isn't valid UTF-8
const readFileText = async (file: Blob): Promise<string> => {
  const buffer = await file.arrayBuffer()

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
  } catch {
    return new TextDecoder('windows-1252').decode(buffer)
  }
}

export const readCsvRows = async (file: Blob): Promise<RowData[]> => {
  const text = await readFileText(file)

  return new Promise((resolve, reject) => {
    parse<PPRowData>(text, {
      header: false,
      skipEmptyLines: 'greedy',
      worker: true,
      complete: (results) => {
        resolve(results.data)
      },
      error: (err: Error) => {
        reject(err)
      },
    })
  })
}

const getParserName = ({ bankName, accountName }: Parser) => `${bankName} ${accountName}`

/**
 * Exactly one parser must match, multiple matches are an error rather than a guess.
 * If none match, `error` explains why the closest parser was rejected.
 */
export const getMatchingParser = (rows: RowData[]): { parser: Parser | null; error: string } => {
  const matches: Parser[] = []
  let closest: { parser: Parser; closeness: number; reason: string } | null = null

  for (const parser of Object.values(AVAILABLE_PARSERS)) {
    try {
      const result = parser.detect(rows)

      if (result.match) {
        matches.push(parser)
      } else if (!closest || result.closeness > closest.closeness) {
        closest = { parser, closeness: result.closeness, reason: result.reason }
      }
    } catch (err) {
      console.error(`Error detecting with ${parser.id}:`, getErrorMessage(err))
    }
  }

  if (matches.length === 1) {
    return { parser: matches[0], error: '' }
  }

  if (matches.length > 1) {
    return { parser: null, error: `Ambiguous format, matches: ${matches.map(getParserName).join(', ')}` }
  }

  if (closest && closest.closeness >= 0.5) {
    return {
      parser: null,
      error: `No matching parser found. Closest: ${getParserName(closest.parser)} (${closest.reason})`,
    }
  }

  return { parser: null, error: 'No matching parser found!' }
}

export const getErrorMessage = (err: unknown) => {
  return err instanceof Error ? err.message : String(err)
}
