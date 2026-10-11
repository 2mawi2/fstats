// Estimate only, rows are measured once rendered
export const ROW_HEIGHT = 25 // px

export const COLUMN_WIDTH = 100 // px

// Rows rendered above and below the visible area
export const OVERSCAN = 20

export const getColumnCount = (header: string[] | null, rows: string[][]) => {
  return header ? header.length : rows.reduce((max, row) => Math.max(max, row.length), 0)
}
