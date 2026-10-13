'use client'

import { Box } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { CSSProperties, ReactNode } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'

import { getColWidths, OVERSCAN, ROW_HEIGHT, splitMatches } from './actions'
import { ui } from './styled'

export type VirtualTableColumn = {
  label: string
  /**
   * Relative width, all columns always fit the table width.
   */
  width?: number
  /**
   * Width in px, overrides `width`. Use for icons. The widest relative column then takes the remaining space.
   */
  fixedWidth?: number
  /**
   * Only shown as the header's tooltip, e.g. for narrow columns.
   */
  hideLabel?: boolean
  align?: 'left' | 'center' | 'right'
  /**
   * Cell style, by value.
   */
  getStyle?: (value: string) => CSSProperties | undefined
  /**
   * Cell content, by value. Replaces the value and its tooltip.
   */
  renderCell?: (value: string, rowIndex: number) => ReactNode
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
  getRowStyle?: (index: number) => CSSProperties | undefined
  /**
   * Keeps the header row at this offset (px) from the top of the scroll element's content while scrolling.
   */
  stickyHeaderTop?: number
  /**
   * Minimum width in px of each column. If the columns don't fit, the table scrolls horizontally. Not compatible with
   * `stickyHeaderTop`, the horizontal scroll container would break the sticky header.
   */
  minColumnWidth?: number
  /**
   * The scrolling ancestor, can be shared by multiple tables.
   */
  scrollElement: HTMLElement | null
  /**
   * Search query, highlighted in the cells (case-insensitive). Not in cells with `renderCell`.
   */
  highlight?: string
}

const highlightMatches = (text: string, query: string) => {
  // eslint-disable-next-line react/no-array-index-key
  return splitMatches(text, query).map((part, index) => (index % 2 ? <mark key={index}>{part}</mark> : part))
}

const Component = ({
  columns,
  columnCount,
  rowCount,
  getCells,
  getRowStyle,
  stickyHeaderTop,
  minColumnWidth,
  scrollElement,
  highlight = '',
}: VirtualTableProps) => {
  const sx = ui()
  const tbodyRef = useRef<HTMLTableSectionElement>(null)
  const [scrollMargin, setScrollMargin] = useState(0)
  const colWidths = getColWidths(columns, columnCount)

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
    <Box
      sx={{
        ...sx.wrapper,
        ...(stickyHeaderTop === undefined ? null : sx.stickyWrapper),
        ...(minColumnWidth === undefined ? null : sx.scrollWrapper),
      }}
    >
      <Box
        component="table"
        sx={sx.table}
        style={minColumnWidth === undefined ? undefined : { minWidth: columnCount * minColumnWidth }}
      >
        <colgroup>
          {colWidths.map((width, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        {columns ? (
          <thead>
            <tr>
              {/* Index keys, CSV headers aren't necessarily unique */}
              {columns.map((column, index) => (
                <th
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  title={column.label}
                  className={stickyHeaderTop === undefined ? undefined : 'sticky'}
                  style={{ textAlign: column.align, top: stickyHeaderTop }}
                >
                  {column.hideLabel ? null : column.label}
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
            <tr
              key={item.key}
              data-index={item.index}
              ref={virtualizer.measureElement}
              style={getRowStyle?.(item.index)}
            >
              {getCells(item.index).map((cell, cellIndex) => {
                const column = columns?.[cellIndex]

                return (
                  <td
                    // eslint-disable-next-line react/no-array-index-key
                    key={cellIndex}
                    title={column?.renderCell ? undefined : cell}
                    style={{ textAlign: column?.align, ...column?.getStyle?.(cell) }}
                  >
                    {column?.renderCell ? column.renderCell(cell, item.index) : highlightMatches(cell, highlight)}
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
