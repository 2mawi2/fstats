'use client'

import { Box } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { Fragment, useRef } from 'react'

import { getEndDemoHref, getView, isDemo, WorkspaceView } from '@/common'
import { PageWrapper } from '@/components'
import { useFileHelper, useResizeHandle, useStatsLayout } from '@/hooks'

import { resizeColumns } from './actions'
import { DataView, DemoBanner, DropOverlay, FileExplorer, FileSidebar, ProfitLossView, StatsView } from './components'
import { WorkspaceContext } from './context'
import { ui } from './styled'
import { useDayFilter } from './useDayFilter'
import { useFileDropzone } from './useFileDropzone'

/**
 * Workspace of the stats page: file explorer, the transactions, stats, breakdown or CSV view (`view` param) in the middle column, and the file
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
  const dayFilter = useDayFilter({ isDemoMode, isDisabled: view === WorkspaceView.CSV })
  const { columnWidths: widths, setColumnWidths: setWidths } = useStatsLayout()
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
    content: ReactNode
  }[] = [
    {
      id: 'left',
      content: <FileExplorer />,
    },
    {
      id: 'middle',
      content:
        view === WorkspaceView.STATS ? (
          <StatsView />
        ) : view === WorkspaceView.BREAKDOWN ? (
          <ProfitLossView />
        ) : (
          <DataView />
        ),
    },
    {
      id: 'right',
      content: <FileSidebar />,
    },
  ]

  return (
    <WorkspaceContext.Provider value={{ isDemoMode, onAddFiles: dropzone.open, onAddFolder: addFolder, dayFilter }}>
      <Box {...dropzone.getRootProps()} sx={sx.dropzone}>
        <input {...dropzone.getInputProps()} />
        {/* Above all columns, all of them show demo data in demo mode */}
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
              <Box sx={{ ...sx.column, flexBasis: `${widths[index]}%` }}>{column.content}</Box>
            </Fragment>
          ))}
        </Box>
        {dropzone.isDragActive ? <DropOverlay /> : null}
      </Box>
    </WorkspaceContext.Provider>
  )
}

export default Component
