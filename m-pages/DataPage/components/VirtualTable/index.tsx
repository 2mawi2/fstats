'use client'

import { Box } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { CSSProperties } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'

import { DEFAULT_COLUMN_WIDTH, OVERSCAN, ROW_HEIGHT } from './actions'
import { ui } from './styled'

export type VirtualTableColumn = {
  label: string
  /**
   * Relative width, all columns always fit the table width.
   */
  width?: number
  align?: 'left' | 'right'
  /**
   * Cell style, by value.
   */
  getStyle?: (value: string) => CSSProperties | undefined
}

type VirtualTableProps = {
  /**
   * `null` renders no header row.
   */
  columns: VirtualTableColumn[] | null
  columnCount: number
  rowCount: number
  /**
   * Only called for rendered rows, so the cell values can be computed lazily.
   */
  getCells: (index: number) => string[]
  /**
   * The scrolling ancestor, can be shared by multiple tables.
   */
  scrollElement: HTMLElement | null
}

const Component = ({ columns, columnCount, rowCount, getCells, scrollElement }: VirtualTableProps) => {
  const sx = ui()
  const tbodyRef = useRef<HTMLTableSectionElement>(null)
  const [scrollMargin, setScrollMargin] = useState(0)
  const widths = Array.from({ length: columnCount }, (_, index) => columns?.[index]?.width ?? DEFAULT_COLUMN_WIDTH)
  const totalWidth = widths.reduce((sum, width) => sum + width, 0)

  // Offset of the rows within the scroll element, changes when content above (e.g. other tables) resizes
  useLayoutEffect(() => {
    const tbody = tbodyRef.current

    if (!tbody || !scrollElement) {
      return
    }

    const update = () => {
      const margin =
        tbody.getBoundingClientRect().top - scrollElement.getBoundingClientRect().top + scrollElement.scrollTop
      setScrollMargin((prev) => (prev === margin ? prev : margin))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(scrollElement.firstElementChild ?? scrollElement)
    return () => observer.disconnect()
  }, [scrollElement, rowCount])

  // Not compatible with React Compiler memoization, the compiler skips this component
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollElement,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    scrollMargin,
  })

  const items = virtualizer.getVirtualItems()
  const paddingTop = items.length ? items[0].start - scrollMargin : 0
  const paddingBottom = items.length ? virtualizer.getTotalSize() - (items[items.length - 1].end - scrollMargin) : 0

  return (
    <Box sx={sx.wrapper}>
      <Box component="table" sx={sx.table}>
        <colgroup>
          {widths.map((width, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <col key={index} style={{ width: `${(width / totalWidth) * 100}%` }} />
          ))}
        </colgroup>
        {columns ? (
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.label} title={column.label} style={{ textAlign: column.align }}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody ref={tbodyRef}>
          {paddingTop > 0 ? (
            <tr className="spacer" style={{ height: paddingTop }}>
              <td colSpan={columnCount} />
            </tr>
          ) : null}
          {items.map((item) => (
            <tr key={item.key} data-index={item.index} ref={virtualizer.measureElement}>
              {getCells(item.index).map((cell, cellIndex) => {
                const column = columns?.[cellIndex]

                return (
                  <td
                    // eslint-disable-next-line react/no-array-index-key
                    key={cellIndex}
                    title={cell}
                    style={{ textAlign: column?.align, ...column?.getStyle?.(cell) }}
                  >
                    {cell}
                  </td>
                )
              })}
            </tr>
          ))}
          {paddingBottom > 0 ? (
            <tr className="spacer" style={{ height: paddingBottom }}>
              <td colSpan={columnCount} />
            </tr>
          ) : null}
        </tbody>
      </Box>
    </Box>
  )
}

export default Component
