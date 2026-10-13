'use client'

import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { Fragment, useRef } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { PageWrapper } from '@/components'
import { useDataLayout, useFileHelper, useResizeHandle } from '@/hooks'

import { resizeColumns } from './actions'
import { DataView, DemoBanner, DropOverlay, FileExplorer, FileSidebar, StatsView } from './components'
import { WorkspaceContext } from './context'
import { getEndDemoHref, getView, isDemo, WorkspaceView } from './params'
import { ui } from './styled'
import { useDayFilter } from './useDayFilter'
import { useFileDropzone } from './useFileDropzone'

/**
 * Workspace of the stats page: file explorer, the transactions, stats or CSV view (`view` param) in the middle column, and the file
 * summary.
 */
const Component = () => {
  const sx = ui()
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = getView(searchParams)
  const isDemoMode = isDemo(searchParams)
  const { isLoadingFiles } = useFileHelper()
  const [includeDuplicates] = useLocalStorage(MISC.LS_DATA_INCLUDE_DUPLICATES_KEY, false, {
    initializeWithValue: false,
  })
  const dayFilter = useDayFilter({ isDemoMode })
  const { columnWidths: widths, setColumnWidths: setWidths } = useDataLayout()
  // Leave demo mode once real files are added, so they are shown
  const { dropzone, addFolder } = useFileDropzone({
    onAdded: isDemoMode ? () => router.replace(getEndDemoHref(searchParams)) : undefined,
  })
  const startResize = useResizeHandle(containerRef, 'x')

  if (isLoadingFiles) {
    return <PageWrapper />
  }

  const columns: {
    id: string
    sx?: SxProps<Theme>
    content: ReactNode
  }[] = [
    {
      id: 'left',
      sx: { ...sx.fullHeightColumn, ...sx.toolbarColumn },
      content: <FileExplorer />,
    },
    {
      id: 'middle',
      sx: { ...sx.fullHeightColumn, ...sx.toolbarColumn },
      content: view === WorkspaceView.STATS ? <StatsView /> : <DataView />,
    },
    {
      id: 'right',
      sx: { ...sx.fullHeightColumn, ...sx.toolbarColumn, ...sx.rightColumn },
      // Duplicates are always excluded from the stats, the date explorer is hidden in the CSV view
      content: (
        <FileSidebar
          includeDuplicates={view === WorkspaceView.TRANSACTIONS && includeDuplicates}
          deselectedDays={dayFilter.deselectedDays}
          isCsv={view === WorkspaceView.CSV}
        />
      ),
    },
  ]

  return (
    <WorkspaceContext.Provider value={{ isDemoMode, onAddFiles: dropzone.open, onAddFolder: addFolder, dayFilter }}>
      <Box {...dropzone.getRootProps()} sx={sx.dropzone}>
        <input {...dropzone.getInputProps()} />
        {/* Across all columns, only the middle column's content changes in demo mode */}
        {isDemoMode ? <DemoBanner /> : null}
        <Box ref={containerRef} sx={sx.container}>
          {columns.map((column, index) => (
            <Fragment key={column.id}>
              {index > 0 ? (
                <Box
                  sx={sx.divider}
                  onPointerDown={startResize((delta) => setWidths(resizeColumns(widths, index - 1, delta)))}
                />
              ) : null}
              <Box sx={{ ...sx.column, ...column.sx, flexBasis: `${widths[index]}%` }}>{column.content}</Box>
            </Fragment>
          ))}
        </Box>
        {dropzone.isDragActive ? <DropOverlay /> : null}
      </Box>
    </WorkspaceContext.Provider>
  )
}

export default Component
