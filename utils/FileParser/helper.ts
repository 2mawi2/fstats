import { parse } from 'papaparse'

import type { Parser, PPRowData, RowData } from '@/types'
import { AVAILABLE_PARSERS } from '@/utils/Parser'

// Many bank exports (e.g. ING) are Windows-1252, so fall back when the file isn't valid UTF-8
export const readFileText = async (file: Blob): Promise<string> => {
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
