'use client'

import {
  CheckBoxOutlineBlankOutlined,
  CheckBoxOutlined,
  DeleteOutlined,
  ErrorOutlined,
  ExpandLess,
  ExpandMore,
  IndeterminateCheckBoxOutlined,
} from '@mui/icons-material'
import { Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

import { StatsFileStatus } from '@/types-enums'
import { useMutateRemoveAllFiles, useMutateRemoveFiles } from '@/m-stats-file/service'
import { useFileHelper, useIsDarkMode, useIsMobile } from '@/hooks'
import { getBankAccountName } from '@/utils/Parser'

import DetailsRow from '../DetailsRow'
import { ui } from './styled'

const Component = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const [expanded, setExpanded] = useState(false)
  const { mutate: removeAllFiles, isPending: isRemovingAllFiles } = useMutateRemoveAllFiles()
  const { mutate: removeFiles, isPending: isRemovingFiles } = useMutateRemoveFiles()
  const { files, isLoadingFiles, selectedFiles, selectableFiles, errorFiles, unknownFiles, setSelectedFileIds } =
    useFileHelper()
  const parserIds = Array.from(
    new Set(selectedFiles.filter((file) => file.status === StatsFileStatus.PARSED).map((file) => file.parserId)),
  )
  const typesFound = Array.from(
    new Set(parserIds.map((parserId) => getBankAccountName(parserId).short).sort((a, b) => a.localeCompare(b))),
  ).join(', ')
  const isParsing = files.some((file) => file.status === StatsFileStatus.PARSING)

  const toggleSelectAll = () => {
    if (selectedFiles.length === selectableFiles.length) {
      setSelectedFileIds([])
    } else {
      setSelectedFileIds(selectableFiles.map((file) => file.id))
    }
  }

  const removeInvalidFiles = () => {
    removeFiles(errorFiles.map((file) => file.id))
  }

  const removeUnknownFiles = () => {
    removeFiles(unknownFiles.map((file) => file.id))
  }

  if (!files.length) {
    return null
  }

  return (
    <>
      <Box sx={sx.summaryCard()} onClick={() => setExpanded(!expanded)}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </Typography>
            {
              <Typography variant="body2" color="text.secondary">
                {selectedFiles.length} selected
              </Typography>
            }
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', gap: 1 }}>
            {files.some((file) => file.status === StatsFileStatus.PARSED) ? (
              <Typography variant="body2" color="text.secondary">
                {typesFound}
              </Typography>
            ) : null}
            {isParsing ? <CircularProgress size={20} /> : null}

            {errorFiles.length ? (
              <Chip
                icon={<ErrorOutlined sx={{ fontSize: 16 }} />}
                label={`${errorFiles.length} Invalid file${errorFiles.length > 1 ? 's' : ''}`}
                size="small"
                color="error"
                variant="outlined"
              />
            ) : null}

            {unknownFiles.length ? (
              <Chip
                icon={<ErrorOutlined sx={{ fontSize: 16 }} />}
                label={`${unknownFiles.length} Unsupported format`}
                size="small"
                color="warning"
                variant="outlined"
              />
            ) : null}
            {expanded ? (
              <ExpandLess sx={{ color: 'text.secondary' }} />
            ) : (
              <ExpandMore sx={{ color: 'text.secondary' }} />
            )}
          </Stack>
        </Stack>
      </Box>

      {expanded ? (
        <Box sx={{ mt: 2 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Button
                size="small"
                startIcon={
                  selectableFiles.length && selectedFiles.length === selectableFiles.length ? (
                    <CheckBoxOutlined />
                  ) : !selectedFiles.length ? (
                    <CheckBoxOutlineBlankOutlined />
                  ) : (
                    <IndeterminateCheckBoxOutlined />
                  )
                }
                onClick={() => toggleSelectAll()}
                disabled={isLoadingFiles || isParsing || !selectableFiles.length}
              >
                {selectableFiles.length && selectedFiles.length === selectableFiles.length
                  ? 'Deselect all'
                  : 'Select all'}
              </Button>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {!isParsing && errorFiles.length && errorFiles.length !== files.length ? (
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlined />}
                    onClick={() => removeInvalidFiles()}
                    disabled={isLoadingFiles || isParsing || !errorFiles.length}
                    loading={isRemovingFiles}
                  >
                    Remove invalid
                  </Button>
                ) : null}

                {!isParsing && unknownFiles.length && unknownFiles.length !== files.length ? (
                  <Button
                    size="small"
                    color="warning"
                    startIcon={<DeleteOutlined />}
                    onClick={() => removeUnknownFiles()}
                    disabled={isLoadingFiles || isParsing || !unknownFiles.length}
                    loading={isRemovingFiles}
                  >
                    Remove unsupported
                  </Button>
                ) : null}

                <Button
                  size="small"
                  color="primary"
                  startIcon={<DeleteOutlined />}
                  onClick={() => removeAllFiles()}
                  disabled={isLoadingFiles || isParsing}
                  loading={isRemovingAllFiles}
                >
                  Remove all
                </Button>
              </Box>
            </Stack>

            {files.map((file) => (
              <DetailsRow key={file.id} file={file} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </>
  )
}

export default Component
