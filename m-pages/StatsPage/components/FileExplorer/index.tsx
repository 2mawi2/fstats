'use client'

import { Box, List, Skeleton, Typography } from '@mui/material'
import { useRef } from 'react'

import { useDataLayout, useResizeHandle } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { useWorkspace, useWorkspaceFiles } from '../../context'
import FileRow from '../FileRow'
import FileToolbar from '../FileToolbar'
import { clampSplit } from './actions'
import { ui } from './styled'

const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  const { isDemoMode } = useWorkspace()
  const { files, isChecked, toggleFile } = useWorkspaceFiles()
  const panesRef = useRef<HTMLDivElement>(null)
  const { explorerSplit: split, setExplorerSplit: setSplit } = useDataLayout()
  const startResize = useResizeHandle(panesRef, 'y')

  return (
    <Box sx={sx.explorer}>
      <Box ref={panesRef} sx={sx.panes}>
        <Box sx={{ ...sx.pane, ...sx.filesPane, flexBasis: `${split}%` }}>
          <FileToolbar />
          <List disablePadding>
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                isChecked={isChecked(file.id)}
                onToggle={toggleFile}
                disabled={isDemoMode}
              />
            ))}
          </List>
          {files.length ? (
            <Typography variant="caption" color="text.secondary" sx={sx.dropTip}>
              {t('STATS_PAGE.DROP_ZONE.DROP_TIP')}
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
