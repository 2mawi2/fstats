export const getColumnCount = (header: string[] | null, rows: string[][]) => {
  return header ? header.length : rows.reduce((max, row) => Math.max(max, row.length), 0)
}

// Files with more columns don't fit the width, so their columns keep a minimum width and the table scrolls horizontally
const MAX_FITTING_COLUMNS = 10

const MIN_COLUMN_WIDTH = 120 // px

export const getMinColumnWidth = (columnCount: number) => {
  return columnCount > MAX_FITTING_COLUMNS ? MIN_COLUMN_WIDTH : undefined
}
