'use client'

import { CloudUploadOutlined } from '@mui/icons-material'
import { Box, FormControlLabel, Switch, Typography } from '@mui/material'
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
  getDuplicateCount,
  getTableViewOptions,
  getTransactionsLayoutOptions,
  openFolderPicker,
  resizeColumns,
  setInputFiles,
  TableView,
  TransactionsLayout,
} from './actions'
import {
  CsvPreview,
  DropZoneDisplay,
  FileDetails,
  FileExplorer,
  NoSelectionDisplay,
  SegmentedToggle,
  StatsCard,
  StatsSkeleton,
  TransactionsPreview,
  TransactionsSummary,
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
  const [transactionsLayout, setTransactionsLayout] = useLocalStorage<TransactionsLayout>(
    MISC.LS_DATA_TRANSACTIONS_LAYOUT_KEY,
    TransactionsLayout.COMBINED,
    { initializeWithValue: false },
  )
  const [includeDuplicates, setIncludeDuplicates] = useLocalStorage(MISC.LS_DATA_INCLUDE_DUPLICATES_KEY, false, {
    initializeWithValue: false,
  })
  const [amountFilter, setAmountFilter] = useLocalStorage<AmountFilter>(
    MISC.LS_DATA_AMOUNT_FILTER_KEY,
    AmountFilter.ALL,
    {
      initializeWithValue: false,
    },
  )
  const { columnWidths: widths, setColumnWidths: setWidths } = useDataLayout()
  const { mutateAsync: addFiles } = useMutateAddFiles()
  const { mutateAsync: updateFiles } = useMutateUpdateFiles()
  const { files, checkedFiles, selectedFiles: checkedParsedFiles, setSelectedFileIds } = useFileHelper()
  // Multiple parsed files are shown as one, with combined stats above the stats per file
  const isCombined = checkedParsedFiles.length > 1
  const isTransactionsSplit = isCombined && transactionsLayout === TransactionsLayout.SPLIT
  // Only the combined table has duplicates
  const duplicateCount = isCombined && !isTransactionsSplit ? getDuplicateCount(checkedParsedFiles, amountFilter) : 0

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
    content: ReactNode
  }[] = [
    {
      id: 'left',
      sx: { ...sx.stickyColumn, ...sx.toolbarColumn },
      content: <FileExplorer onAddFiles={dropzone.open} onAddFolder={addFolder} />,
    },
    {
      id: 'middle',
      sx: { ...sx.stickyColumn, ...sx.toolbarColumn },
      content: (
        <>
          {/* Outside the scroll container, so it stays in place */}
          {!checkedFiles.length ? (
            <Box sx={sx.middleToolbar}>
              <SegmentedToggle value={tableView} options={getTableViewOptions()} onChange={setTableView} disabled />
            </Box>
          ) : (
            <Box sx={sx.middleToolbar}>
              <SegmentedToggle value={tableView} options={getTableViewOptions()} onChange={setTableView} />
              {tableView === TableView.TRANSACTIONS && isCombined ? (
                <SegmentedToggle
                  value={transactionsLayout}
                  options={getTransactionsLayoutOptions()}
                  onChange={setTransactionsLayout}
                />
              ) : null}
              {tableView === TableView.TRANSACTIONS ? (
                <SegmentedToggle value={amountFilter} options={getAmountFilterOptions()} onChange={setAmountFilter} />
              ) : null}
              {tableView === TableView.TRANSACTIONS && duplicateCount ? (
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={includeDuplicates}
                      onChange={(event) => setIncludeDuplicates(event.target.checked)}
                    />
                  }
                  label={t('DATA_PAGE.SHOW_DUPLICATES', { count: duplicateCount })}
                  slotProps={{ typography: { variant: 'caption', color: 'text.secondary' } }}
                  sx={sx.duplicatesSwitch}
                />
              ) : null}
            </Box>
          )}
          <Box ref={setMiddleColumn} sx={sx.middleScroll}>
            {/* Single child, observed by the tables for layout changes above them */}
            <div>
              {!files.length ? (
                <DropZoneDisplay onAddFiles={dropzone.open} onAddFolder={addFolder} />
              ) : !checkedFiles.length ? (
                <NoSelectionDisplay />
              ) : tableView === TableView.TRANSACTIONS ? (
                isTransactionsSplit ? (
                  checkedFiles.map((file) => (
                    <TransactionsPreview
                      key={file.id}
                      files={[file]}
                      amountFilter={amountFilter}
                      includeDuplicates={includeDuplicates}
                      scrollElement={middleColumn}
                    />
                  ))
                ) : (
                  <TransactionsPreview
                    files={checkedFiles}
                    amountFilter={amountFilter}
                    includeDuplicates={includeDuplicates}
                    scrollElement={middleColumn}
                  />
                )
              ) : (
                checkedFiles.map((file) => <CsvPreview key={file.id} file={file} scrollElement={middleColumn} />)
              )}
            </div>
          </Box>
        </>
      ),
    },
    {
      id: 'right',
      sx: { ...sx.stickyColumn, ...sx.toolbarColumn, ...sx.rightColumn },
      content: checkedFiles.length ? (
        <>
          {checkedParsedFiles.length ? (
            <StatsCard>
              <TransactionsSummary files={checkedParsedFiles} includeDuplicates={includeDuplicates} />
            </StatsCard>
          ) : null}
          {checkedParsedFiles.length ? (
            <Typography component="h2" sx={sx.rightSubheader}>
              {t('DATA_PAGE.FILE_DETAILS')}
            </Typography>
          ) : null}
          <StatsCard>
            {checkedFiles.map((file) => (
              <FileDetails key={file.id} file={file} />
            ))}
          </StatsCard>
        </>
      ) : (
        <StatsSkeleton />
      ),
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
      {dropzone.isDragActive ? (
        <Box sx={sx.dropOverlay}>
          <CloudUploadOutlined sx={{ fontSize: 48 }} />
          <Typography variant="h5">{t('DATA_PAGE.DROP_FILES_HERE')}</Typography>
        </Box>
      ) : null}
    </Box>
  )
}

export default Component
