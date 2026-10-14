'use client'

import type { RowData } from '@/types'

import { getColumnCount, getMinColumnWidth } from '../../../CsvPreview/actions'
import VirtualTable from '../../../VirtualTable'
import { getCsvRows } from '../../actions'

type CsvRowsProps = {
  rows: RowData[]
  scrollElement: HTMLElement | null
}

/**
 * The first rows of the file as is (like the CSV view of unsupported files), to compare with the preview.
 */
const Component = ({ rows, scrollElement }: CsvRowsProps) => {
  const shownRows = getCsvRows(rows)
  const columnCount = getColumnCount(null, shownRows)

  return (
    <VirtualTable
      columns={null}
      columnCount={columnCount}
      minColumnWidth={getMinColumnWidth(columnCount)}
      rowCount={shownRows.length}
      getCells={(index) => shownRows[index]}
      scrollElement={scrollElement}
    />
  )
}

export default Component
