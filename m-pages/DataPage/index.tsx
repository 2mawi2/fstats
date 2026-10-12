'use client'

import { CloudUploadOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import type { PointerEvent, ReactNode } from 'react'
import { Fragment, useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLocalStorage } from 'usehooks-ts'

import type { NewStatsFile, RDZFileRejection, RDZFileWithPath } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { MISC } from '@/common'
import { isParsed, useMutateAddFiles, useMutateUpdateFiles } from '@/m-stats-file/service'
import { useDataLayout, useFileHelper, useUserPreferences } from '@/hooks'
import { parseFiles } from '@/utils/FileParser'

import { AMOUNT_FILTER_OPTIONS, AmountFilter, resizeColumns, TABLE_VIEW_OPTIONS, TableView } from './actions'
import {
  CsvPreview,
  DropZoneDisplay,
  FileDetails,
  FileExplorer,
  SegmentedToggle,
  TransactionsPreview,
} from './components'
import { ui } from './styled'

const Component = () => {
  const sx = ui()
  const containerRef = useRef<HTMLDivElement>(null)
  // State rather than a ref, so the previews re-render once the scroll element exists
  const [middleColumn, setMiddleColumn] = useState<HTMLDivElement | null>(null)
  const [tableView, setTableView] = useLocalStorage<TableView>(MISC.LS_DATA_TABLE_VIEW_KEY, TableView.RAW, {
    initializeWithValue: false,
  })
  const [amountFilter, setAmountFilter] = useState<AmountFilter>(AmountFilter.ALL)

  const changeTableView = (view: TableView) => {
    setTableView(view)
    // Always start with all amounts when switching views
    setAmountFilter(AmountFilter.ALL)
  }
  const { columnWidths: widths, setColumnWidths: setWidths } = useDataLayout()
  const { mutateAsync: addFiles } = useMutateAddFiles()
  const { mutateAsync: updateFiles } = useMutateUpdateFiles()
  const { files, selectedFileIds, setSelectedFileIds } = useFileHelper()
  const checkedFiles = files.filter((file) => selectedFileIds.includes(file.id))
  const { locale, dateFormat } = useUserPreferences()

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: RDZFileRejection[]) => {
      const newFiles: NewStatsFile[] = [
        ...acceptedFiles.map((file) => ({ file: file as RDZFileWithPath })),
        ...fileRejections.map(({ file, errors }) => ({ file, rejection: errors.map((e) => e.message).join(', ') })),
      ]

      const addedFiles = await addFiles(newFiles)
      const parseResults = await parseFiles(
        addedFiles.filter((file) => file.status === StatsFileStatus.PARSING),
        locale,
        dateFormat,
      )
      const updatedFiles = await updateFiles(parseResults)
      setSelectedFileIds((prev) => [...prev, ...updatedFiles.filter(isParsed).map((file) => file.id)])
    },
    [addFiles, updateFiles, setSelectedFileIds, locale, dateFormat],
  )

  const dropzone = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxSize: MISC.MAX_UPLOAD_FILE_SIZE,
    multiple: true,
    noClick: true,
    noKeyboard: true,
  })

  const onPointerDown = (index: number) => (event: PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current

    if (!container) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    const startX = event.clientX
    const startWidths = widths
    const containerWidth = container.getBoundingClientRect().width

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      const delta = ((moveEvent.clientX - startX) / containerWidth) * 100
      setWidths(resizeColumns(startWidths, index, delta))
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const columns: {
    id: string
    sx?: SxProps<Theme>
    ref?: (element: HTMLDivElement | null) => void
    content: ReactNode
  }[] = [
    {
      id: 'left',
      sx: { ...sx.stickyColumn, ...sx.leftColumn },
      content: <FileExplorer onAddFiles={dropzone.open} />,
    },
    {
      id: 'middle',
      sx: sx.stickyColumn,
      ref: setMiddleColumn,
      content: (
        <div>
          {!files.length ? (
            <DropZoneDisplay isDragActive={dropzone.isDragActive} onAddFiles={dropzone.open} />
          ) : checkedFiles.length ? (
            <>
              <Box sx={sx.middleToolbar}>
                <SegmentedToggle value={tableView} options={TABLE_VIEW_OPTIONS} onChange={changeTableView} />
                {tableView === TableView.TRANSACTIONS ? (
                  <SegmentedToggle value={amountFilter} options={AMOUNT_FILTER_OPTIONS} onChange={setAmountFilter} />
                ) : null}
              </Box>
              {checkedFiles.map((file) =>
                tableView === TableView.TRANSACTIONS ? (
                  <TransactionsPreview
                    key={file.id}
                    file={file}
                    amountFilter={amountFilter}
                    scrollElement={middleColumn}
                  />
                ) : (
                  <CsvPreview key={file.id} file={file} scrollElement={middleColumn} />
                ),
              )}
            </>
          ) : (
            <p>Check a file to see its data.</p>
          )}
        </div>
      ),
    },
    {
      id: 'right',
      sx: sx.stickyColumn,
      content: checkedFiles.length ? (
        checkedFiles.map((file) => <FileDetails key={file.id} file={file} />)
      ) : files.length ? (
        <Typography variant="body2" color="text.secondary">
          Check a file to see its details.
        </Typography>
      ) : null,
    },
  ]

  return (
    <Box {...dropzone.getRootProps()} sx={sx.dropzone}>
      <input id="dropzone-file-input" {...dropzone.getInputProps()} />
      <Box ref={containerRef} sx={sx.container}>
        {columns.map((column, index) => (
          <Fragment key={column.id}>
            {index > 0 ? <Box sx={sx.divider} onPointerDown={onPointerDown(index - 1)} /> : null}
            <Box ref={column.ref} sx={{ ...sx.column, ...column.sx, flexBasis: `${widths[index]}%` }}>
              {column.content}
            </Box>
          </Fragment>
        ))}
      </Box>
      {dropzone.isDragActive && files.length ? (
        <Box sx={sx.dropOverlay}>
          <CloudUploadOutlined sx={{ fontSize: 48 }} />
          <Typography variant="h5">Drop your files here</Typography>
        </Box>
      ) : null}
    </Box>
  )
}

export default Component
