'use client'

import { Box, List, Skeleton, Typography } from '@mui/material'
import { useRef } from 'react'

import { useDataLayout, useFileHelper, useResizeHandle } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import FileRow from '../FileRow'
import FileToolbar from '../FileToolbar'
import { clampSplit } from './actions'
import { ui } from './styled'

type FileExplorerProps = {
  onAddFiles: () => void
  onAddFolder: () => void
}

const Component = ({ onAddFiles, onAddFolder }: FileExplorerProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const { files, selectedFileIds, setSelectedFileIds } = useFileHelper()
  const panesRef = useRef<HTMLDivElement>(null)
  const { explorerSplit: split, setExplorerSplit: setSplit } = useDataLayout()
  const startResize = useResizeHandle(panesRef, 'y')

  const toggleFile = (fileId: string) => {
    setSelectedFileIds((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  return (
    <Box sx={sx.explorer}>
      <Box ref={panesRef} sx={sx.panes}>
        <Box sx={{ ...sx.pane, ...sx.filesPane, flexBasis: `${split}%` }}>
          <FileToolbar onAddFiles={onAddFiles} onAddFolder={onAddFolder} />
          <List disablePadding>
            {files.map((file) => (
              <FileRow key={file.id} file={file} isChecked={selectedFileIds.includes(file.id)} onToggle={toggleFile} />
            ))}
          </List>
          {files.length ? (
            <Typography variant="caption" color="text.secondary" sx={sx.dropTip}>
              {t('DATA_PAGE.DROP_TIP')}
            </Typography>
          ) : null}
        </Box>

        <Box sx={sx.splitDivider} onPointerDown={startResize((delta) => setSplit(clampSplit(split + delta)))} />

        <Box sx={{ ...sx.pane, flexBasis: `${100 - split}%` }}>
          {files.length ? (
            <>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rectangular" height={120} sx={{ mt: 1 }} />
            </>
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}

export default Component
