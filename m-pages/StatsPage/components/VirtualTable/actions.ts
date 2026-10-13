import { escapeRegExp } from 'lodash'

import type { VirtualTableColumn } from '.'

// Estimate only, rows are measured once rendered
export const ROW_HEIGHT = 25 // px

// Relative, columns without a width get an equal share
export const DEFAULT_COLUMN_WIDTH = 100

export const OVERSCAN = 20

/**
 * CSS widths of the columns. Relative widths become percentages. With fixed px columns, the percentages would add up
 * to more than the table width, so the widest relative column is left `auto` to take the remaining space instead.
 */
export const getColWidths = (columns: VirtualTableColumn[] | null, columnCount: number) => {
  const relativeWidths = Array.from({ length: columnCount }, (_, index) =>
    columns?.[index]?.fixedWidth === undefined ? (columns?.[index]?.width ?? DEFAULT_COLUMN_WIDTH) : 0,
  )
  const totalWidth = relativeWidths.reduce((sum, width) => sum + width, 0)
  const hasFixed = columns?.some((column) => column.fixedWidth !== undefined) ?? false
  const autoIndex = hasFixed ? relativeWidths.indexOf(Math.max(...relativeWidths)) : -1

  return relativeWidths.map((width, index) => {
    const fixedWidth = columns?.[index]?.fixedWidth

    if (fixedWidth !== undefined) {
      return `${fixedWidth}px`
    }

    return index === autoIndex ? 'auto' : `${(width / totalWidth) * 100}%`
  })
}

/**
 * Lowercase query of the search field, empty when there is nothing to search for.
 */
export const toSearchQuery = (search: string) => {
  return search.trim().toLowerCase()
}

/**
 * Lowercase text of the cells to search in, separated so matches don't span cells.
 */
export const toSearchText = (cells: string[]) => {
  return cells.join('\n').toLowerCase()
}

/**
 * The rows whose search text (see `toSearchText`, by row index) contains the query, all rows without a query.
 */
export const filterBySearch = <T>(rows: T[], searchTexts: string[], query: string) => {
  return query ? rows.filter((_, index) => searchTexts[index].includes(query)) : rows
}

/**
 * Splits the text into parts, the odd ones match the query (case-insensitive).
 */
export const splitMatches = (text: string, query: string) => {
  return query ? text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi')) : [text]
}
