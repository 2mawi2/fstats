'use client'

import { Box, Divider, Stack } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { Fragment, useRef } from 'react'

import { resizeColumns } from '@/m-pages/DataPage/actions'
import { DropOverlay, FileExplorer, FileSidebar, NoSelectionDisplay } from '@/m-pages/DataPage/components'
import { useFileDropzone } from '@/m-pages/DataPage/useFileDropzone'
import { useDataLayout, useFileHelper, useResizeHandle, useTransactionHelper, useUserPreferences } from '@/hooks'

import { getCurrency } from './actions'
import { CategoryBreakdown, DemoBanner, NoDataDisplay, SummaryChart, TransactionChart } from './components'
import { ui } from './styled'

const Component = () => {
  const sx = ui()
  const containerRef = useRef<HTMLDivElement>(null)
  const { locale, dateFormat } = useUserPreferences()
  const { files, selectedFiles } = useFileHelper()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get('demo') === 'true'
  const { transactions, transactionRangeItems } = useTransactionHelper({
    isDemoMode,
    files: selectedFiles,
    locale,
    dateFormat,
  })
  const currency = getCurrency(transactions)
  // Shares the column widths with the data page
  const { columnWidths: widths, setColumnWidths: setWidths } = useDataLayout()
  const { dropzone, addFolder } = useFileDropzone()
  const startResize = useResizeHandle(containerRef, 'x')

  const columns: {
    id: string
    sx?: SxProps<Theme>
    content: ReactNode
  }[] = [
    {
      id: 'left',
      sx: { ...sx.stickyColumn, ...sx.toolbarColumn },
      content: <FileExplorer onAddFiles={dropzone.open} onAddFolder={addFolder} />,
    },
    {
      id: 'middle',
      sx: { ...sx.stickyColumn, ...sx.middleColumn },
      content:
        !files.length && !isDemoMode ? (
          <NoDataDisplay onAddFiles={dropzone.open} />
        ) : !selectedFiles.length && !isDemoMode ? (
          <NoSelectionDisplay />
        ) : (
          <Stack divider={<Divider flexItem />}>
            {isDemoMode ? (
              <Box sx={sx.section}>
                <DemoBanner />
              </Box>
            ) : null}

            <Box sx={sx.section}>
              <SummaryChart transactionRangeItems={transactionRangeItems} />
            </Box>

            <Box sx={sx.section}>
              <CategoryBreakdown transactions={transactions} currency={currency} />
            </Box>

            <Box sx={sx.section}>
              <TransactionChart transactions={transactions} currency={currency} />
            </Box>
          </Stack>
        ),
    },
    {
      id: 'right',
      sx: { ...sx.stickyColumn, ...sx.toolbarColumn, ...sx.rightColumn },
      // Duplicates are excluded from the stats
      content: <FileSidebar includeDuplicates={false} />,
    },
  ]

  return (
    <Box {...dropzone.getRootProps()} sx={sx.dropzone}>
      <input {...dropzone.getInputProps()} />
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
  )
}

export default Component
