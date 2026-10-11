'use client'

import { Box, Typography } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { StatsFile } from '@/types'
import { useFileRows } from '@/m-stats-file/service'

import { COLUMN_WIDTH, getColumnCount, OVERSCAN, ROW_HEIGHT } from './actions'
import { ui } from './styled'

type CsvPreviewProps = {
  file: StatsFile
  /**
   * The scrolling ancestor, shared by all previews.
   */
  scrollElement: HTMLElement | null
}

const Component = ({ file, scrollElement }: CsvPreviewProps) => {
  const sx = ui()
  const tbodyRef = useRef<HTMLTableSectionElement>(null)
  const [scrollMargin, setScrollMargin] = useState(0)
  const { data, isLoading, error } = useFileRows(file)
  const header = data?.header ?? null
  const rows = useMemo(() => data?.rows ?? [], [data])
  const columnCount = useMemo(() => getColumnCount(header, rows), [header, rows])

  // Offset of the rows within the scroll element, changes when content above (e.g. other previews) resizes
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
  }, [scrollElement, data])

  // Not compatible with React Compiler memoization, the compiler skips this component
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    scrollMargin,
  })

  const items = virtualizer.getVirtualItems()
  const paddingTop = items.length ? items[0].start - scrollMargin : 0
  const paddingBottom = items.length ? virtualizer.getTotalSize() - (items[items.length - 1].end - scrollMargin) : 0

  return (
    <Box component="section" sx={sx.section}>
      <Typography variant="body2" sx={sx.title}>
        {file.file.name}
        {data ? (
          <Box component="span" sx={sx.rowCount}>
            {rows.length} rows
          </Box>
        ) : null}
      </Typography>
      {isLoading ? (
        <Typography variant="body2" color="text.secondary">
          Loading…
        </Typography>
      ) : error ? (
        <Typography variant="body2" color="error">
          Failed to read file: {error.message}
        </Typography>
      ) : data ? (
        <Box sx={sx.tableWrapper}>
          <Box component="table" sx={{ ...sx.table, width: `max(100%, ${columnCount * COLUMN_WIDTH}px)` }}>
            {header ? (
              <thead>
                <tr>
                  {header.map((cell, cellIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <th key={cellIndex} title={cell}>
                      {cell}
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
                  {rows[item.index].map((cell, cellIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <td key={cellIndex} title={cell}>
                      {cell}
                    </td>
                  ))}
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
      ) : null}
    </Box>
  )
}

export default Component
