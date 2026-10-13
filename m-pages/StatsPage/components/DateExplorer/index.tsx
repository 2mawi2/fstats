'use client'

import { ChevronRight, ExpandMore } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemo, useState } from 'react'

import { getFileTransactions } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { getTransactionDay, toDisplayDate } from '@/utils/Date'
import { useTranslation } from '@/lib/i18n'

import { useWorkspaceDayFilter, useWorkspaceFiles } from '../../context'
import DateSkeleton from '../DateSkeleton'
import OutlineCheckbox from '../OutlineCheckbox'
import type { DateRow } from './actions'
import {
  getCheckState,
  getDateTree,
  getDefaultExpanded,
  getDeselectedCounts,
  getRowHeight,
  getVisibleRows,
  OVERSCAN,
  ROW_INDENT,
  toggleDays,
  toggleExpanded,
} from './actions'
import { ui } from './styled'

/**
 * Years, months and days with transactions of the checked files, (de)selected to filter the transactions and stats views.
 */
const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  const { locale, dateFormat } = useUserPreferences()
  const { selectedFiles } = useWorkspaceFiles()
  const { deselectedDays, setDeselectedDays } = useWorkspaceDayFilter()
  // `null` until the user expands or collapses a row, so the default follows the files
  const [expandedKeys, setExpandedKeys] = useState<Set<string> | null>(null)
  // State rather than a ref, so the list re-renders once the scroll element exists
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null)
  const tree = useMemo(
    () => getDateTree(selectedFiles.flatMap(getFileTransactions).map(getTransactionDay)),
    [selectedFiles],
  )
  // Memoized, the virtualizer re-renders on scroll
  const defaultExpanded = useMemo(() => getDefaultExpanded(tree), [tree])
  const expanded = expandedKeys ?? defaultExpanded
  const rows = useMemo(() => getVisibleRows(tree, expanded), [tree, expanded])
  const deselectedCounts = useMemo(() => getDeselectedCounts(tree, deselectedDays), [tree, deselectedDays])

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: (index) => getRowHeight(rows[index]),
    getItemKey: (index) => rows[index].key,
    overscan: OVERSCAN,
  })

  const getLabel = (row: DateRow) => {
    switch (row.type) {
      case 'year':
        return row.key
      case 'month':
        return toDisplayDate(`${row.key}-01`, locale, { formatTo: 'MMMM' })
      default:
        return toDisplayDate(row.key, locale, { formatTo: dateFormat })
    }
  }

  const toggleRow = (row: DateRow) => {
    setDeselectedDays(toggleDays(row.days, deselectedDays))
  }

  const toggleRowExpanded = (row: DateRow) => {
    setExpandedKeys(toggleExpanded(row.key, expanded))
  }

  // Only an indicator, the whole row expands
  const renderExpandIcon = (row: DateRow, isExpanded: boolean) => {
    const Icon = row.type === 'year' ? ExpandMore : ChevronRight

    return (
      <Box component="span" sx={{ ...sx.expandIcon, ...(row.type === 'year' ? sx.expandIconEnd : null) }}>
        <Icon style={{ transform: isExpanded ? `rotate(${row.type === 'year' ? 180 : 90}deg)` : undefined }} />
      </Box>
    )
  }

  // No files, or none checked
  if (!tree.length) {
    return <DateSkeleton title={t('STATS_PAGE.NO_SELECTION.TITLE')} />
  }

  return (
    <Box ref={setScrollElement} sx={sx.scroll}>
      <Box sx={sx.rows} style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((item) => {
          const row = rows[item.index]
          const isExpandable = row.type !== 'day'
          const isExpanded = expanded.has(row.key)
          const checkState = getCheckState(row, deselectedCounts)
          const isDeselected = !checkState.checked && !checkState.indeterminate

          return (
            <Box
              key={row.key}
              // Years and months expand like a tree, days toggle like the file rows
              onClick={() => (isExpandable ? toggleRowExpanded(row) : toggleRow(row))}
              role="button"
              tabIndex={0}
              aria-expanded={isExpandable ? isExpanded : undefined}
              onKeyDown={(event) => {
                if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault()
                  event.currentTarget.click()
                }
              }}
              sx={sx.row}
              style={{
                transform: `translateY(${item.start}px)`,
                height: item.size,
                paddingLeft: ROW_INDENT[row.type],
              }}
            >
              {row.type === 'month' ? renderExpandIcon(row, isExpanded) : null}
              {row.type === 'day' ? <Box sx={sx.expandSpacer} /> : null}
              <OutlineCheckbox
                {...checkState}
                onClick={(event) => event.stopPropagation()}
                onChange={() => toggleRow(row)}
              />
              <Typography
                sx={{
                  ...sx.label,
                  ...(row.type === 'year' ? sx.yearLabel : null),
                  color: isDeselected ? 'text.disabled' : 'text.primary',
                }}
                // Deselected months aren't emphasized, like deselected files
                style={{ fontWeight: row.type === 'month' && !isDeselected ? 600 : 400 }}
              >
                {getLabel(row)}
              </Typography>
              {row.type === 'day' ? (
                <Box component="span" sx={{ ...sx.weekday, ...(checkState.checked ? null : sx.weekdayDeselected) }}>
                  {toDisplayDate(row.key, locale, { formatTo: 'EEE' })}
                </Box>
              ) : null}
              {/* Years expand on the right, like a section header */}
              {row.type === 'year' ? renderExpandIcon(row, isExpanded) : null}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default Component
