import { uniq } from 'lodash'

import type { Parser, RowData } from '@/types'

import { AVAILABLE_PARSERS } from './lookup'

type Section = {
  parser: Parser
  /**
   * Header row followed by the rows up to the next section.
   */
  rows: RowData[]
}

const getParserName = ({ bankName, accountName }: Parser) => `${bankName} ${accountName}`

/**
 * Splits a file into sections, each starting at a header row of a known format. Most files have one section, some
 * have one per account (e.g. Comdirect Giro + Visa). The whole file is searched, as sections can start anywhere.
 * Sections without transactions are dropped.
 *
 * If there are no sections, `error` explains why the closest parser was rejected.
 */
export const findSections = (rows: RowData[]): { sections: Section[]; error: string } => {
  const parsers = Object.values(AVAILABLE_PARSERS)
  const starts: { index: number; parser: Parser }[] = []
  let closest: { parser: Parser; closeness: number; missing: string[] } | null = null

  for (const [index, row] of rows.entries()) {
    const matches: Parser[] = []

    for (const parser of parsers) {
      const missing = parser.getMissingHeaders(row)
      const closeness = 1 - missing.length / parser.requiredHeaders.length

      if (!missing.length) {
        matches.push(parser)
      } else if (!closest || closeness > closest.closeness) {
        closest = { parser, closeness, missing }
      }
    }

    // Multiple matches are an error rather than a guess
    if (matches.length > 1) {
      return { sections: [], error: `Ambiguous format, matches: ${matches.map(getParserName).join(', ')}` }
    }

    if (matches.length) {
      starts.push({ index, parser: matches[0] })
    }
  }

  if (!starts.length) {
    if (closest && closest.closeness >= 0.5) {
      const missing = closest.missing.map((header) => `"${header}"`).join(', ')
      return {
        sections: [],
        error: `No matching parser found. Closest: ${getParserName(closest.parser)} (Missing columns: ${missing})`,
      }
    }

    return { sections: [], error: 'No matching parser found!' }
  }

  const bankNames = uniq(starts.map(({ parser }) => parser.bankName))
  if (bankNames.length > 1) {
    return { sections: [], error: `Sections of different banks: ${bankNames.join(', ')}` }
  }

  const sections = starts
    .map(({ index, parser }, position) => ({ parser, rows: rows.slice(index, starts[position + 1]?.index) }))
    .filter((section) => section.parser.extractRows(section.rows).rows.length)

  if (!sections.length) {
    const { index, parser } = starts[0]
    return {
      sections: [],
      error: `No matching parser found. Closest: ${getParserName(parser)} (Header found in row ${index + 1}, but no transaction rows)`,
    }
  }

  return { sections, error: '' }
}

export type FileRows = {
  /**
   * Account name of the section, `null` for unknown files.
   */
  accountName: string | null
  header: RowData | null
  rows: RowData[]
}

/**
 * Header and transaction rows of a file as is, one entry per section. Unknown files have no known header, so all rows
 * are returned.
 */
export const extractFileRows = (rows: RowData[]): FileRows[] => {
  const { sections } = findSections(rows)

  if (!sections.length) {
    return [{ accountName: null, header: null, rows }]
  }

  return sections.map(({ parser, rows: sectionRows }) => ({
    accountName: parser.accountName,
    ...parser.extractRows(sectionRows),
  }))
}
