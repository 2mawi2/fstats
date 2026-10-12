'use client'

import { Box, List, Skeleton, Typography } from '@mui/material'
import type { PointerEvent } from 'react'
import { useRef } from 'react'

import { useDataLayout, useFileHelper } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import FileRow from '../FileRow'
import FileToolbar from '../FileToolbar'
import { clampSplit } from './actions'
import { ui } from './styled'

type FileExplorerProps = {
  onAddFiles: () => void
}

const Component = ({ onAddFiles }: FileExplorerProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const { files, selectedFileIds, setSelectedFileIds } = useFileHelper()
  const panesRef = useRef<HTMLDivElement>(null)
  const { explorerSplit: split, setExplorerSplit: setSplit } = useDataLayout()

  const toggleFile = (fileId: string) => {
    setSelectedFileIds((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const panes = panesRef.current

    if (!panes) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    const startY = event.clientY
    const startSplit = split
    const panesHeight = panes.getBoundingClientRect().height

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      setSplit(clampSplit(startSplit + ((moveEvent.clientY - startY) / panesHeight) * 100))
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <Box sx={sx.explorer}>
      <Box ref={panesRef} sx={sx.panes}>
        <Box sx={{ ...sx.pane, ...sx.filesPane, flexBasis: `${split}%` }}>
          <FileToolbar onAddFiles={onAddFiles} />
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

        <Box sx={sx.splitDivider} onPointerDown={onPointerDown} />

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
