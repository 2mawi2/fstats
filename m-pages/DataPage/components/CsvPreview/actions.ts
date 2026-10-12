export const getColumnCount = (header: string[] | null, rows: string[][]) => {
  return header ? header.length : rows.reduce((max, row) => Math.max(max, row.length), 0)
}
