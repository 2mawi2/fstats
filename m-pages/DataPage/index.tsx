'use client'

import { CloudUploadOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import type { ReactNode } from 'react'
import { Fragment, useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useLocalStorage } from 'usehooks-ts'

import type { NewStatsFile, RDZFileRejection, RDZFileWithPath } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { MISC } from '@/common'
import { isParsed, useMutateAddFiles, useMutateUpdateFiles } from '@/m-stats-file/service'
import { useDataLayout, useFileHelper, useResizeHandle } from '@/hooks'
import { parseFiles } from '@/utils/FileParser'
import { useTranslation } from '@/lib/i18n'

import {
  AmountFilter,
  getAmountFilterOptions,
  getTableViewOptions,
  openFolderPicker,
  resizeColumns,
  setInputFiles,
  TableView,
} from './actions'
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
  const { t } = useTranslation()
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

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: RDZFileRejection[]) => {
      const newFiles: NewStatsFile[] = [
        ...acceptedFiles.map((file) => ({ file: file as RDZFileWithPath })),
        ...fileRejections.map(({ file, errors }) => ({ file, rejection: errors.map((e) => e.message).join(', ') })),
      ]

      const addedFiles = await addFiles(newFiles)
      const parseResults = await parseFiles(addedFiles.filter((file) => file.status === StatsFileStatus.PARSING))
      const updatedFiles = await updateFiles(parseResults)
      setSelectedFileIds((prev) => [...prev, ...updatedFiles.filter(isParsed).map((file) => file.id)])
    },
    [addFiles, updateFiles, setSelectedFileIds],
  )

  const dropzone = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxSize: MISC.MAX_UPLOAD_FILE_SIZE,
    multiple: true,
    noClick: true,
    noKeyboard: true,
  })

  // Run picked folders through the dropzone input, so they are validated like dropped files
  const addFolder = async () => {
    const pickedFiles = await openFolderPicker()

    if (pickedFiles && dropzone.inputRef.current) {
      setInputFiles(dropzone.inputRef.current, pickedFiles)
    }
  }

  const startResize = useResizeHandle(containerRef, 'x')

  const columns: {
    id: string
    sx?: SxProps<Theme>
    ref?: (element: HTMLDivElement | null) => void
    content: ReactNode
  }[] = [
    {
      id: 'left',
      sx: { ...sx.stickyColumn, ...sx.leftColumn },
      content: <FileExplorer onAddFiles={dropzone.open} onAddFolder={addFolder} />,
    },
    {
      id: 'middle',
      sx: sx.stickyColumn,
      ref: setMiddleColumn,
      content: (
        <div>
          {!files.length ? (
            <DropZoneDisplay isDragActive={dropzone.isDragActive} onAddFiles={dropzone.open} onAddFolder={addFolder} />
          ) : checkedFiles.length ? (
            <>
              <Box sx={sx.middleToolbar}>
                <SegmentedToggle value={tableView} options={getTableViewOptions()} onChange={changeTableView} />
                {tableView === TableView.TRANSACTIONS ? (
                  <SegmentedToggle value={amountFilter} options={getAmountFilterOptions()} onChange={setAmountFilter} />
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
            <p>{t('DATA_PAGE.CHECK_FILE_FOR_DATA')}</p>
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
          {t('DATA_PAGE.CHECK_FILE_FOR_DETAILS')}
        </Typography>
      ) : null,
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
            <Box ref={column.ref} sx={{ ...sx.column, ...column.sx, flexBasis: `${widths[index]}%` }}>
              {column.content}
            </Box>
          </Fragment>
        ))}
      </Box>
      {dropzone.isDragActive && files.length ? (
        <Box sx={sx.dropOverlay}>
          <CloudUploadOutlined sx={{ fontSize: 48 }} />
          <Typography variant="h5">{t('DATA_PAGE.DROP_FILES_HERE')}</Typography>
        </Box>
      ) : null}
    </Box>
  )
}

export default Component
