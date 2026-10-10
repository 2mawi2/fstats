'use client'

import { DeleteOutlined, ErrorOutlined, WarningOutlined } from '@mui/icons-material'
import { Box, Checkbox, CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useLocalStorage } from 'usehooks-ts'

import type { StatsFile } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { MISC } from '@/common'
import { isError, isUnknown, useMutateRemoveFile } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { toDisplayDate } from '@/utils/Date'
import { formatFileSize } from '@/utils/File'

import { BankChip } from './components'
import { ui } from './styled'

type DetailsRowProps = {
  file: StatsFile
}

const Component = ({ file }: DetailsRowProps) => {
  const sx = ui()
  const { locale } = useUserPreferences()
  const { mutate: removeFile } = useMutateRemoveFile()
  const [selectedFileIds, setSelectedFileIds] = useLocalStorage<string[]>(MISC.LS_SELECTED_FILE_IDS_KEY, [])
  const isSelected = selectedFileIds.includes(file.id)
  const isErrorFile = isError(file)
  const isUnknownFile = isUnknown(file)

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  return (
    <Box
      key={file.id}
      sx={sx.fileCard(isErrorFile, isUnknownFile, file.status === StatsFileStatus.PARSING)}
      onClick={isErrorFile || isUnknownFile ? undefined : () => toggleFileSelection(file.id)}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {isErrorFile ? (
          <Box sx={{ width: 28, display: 'flex', justifyContent: 'center' }}>
            <ErrorOutlined sx={{ color: 'error.main', fontSize: 18 }} />
          </Box>
        ) : isUnknownFile ? (
          <Box sx={{ width: 28, display: 'flex', justifyContent: 'center' }}>
            <WarningOutlined sx={{ color: 'warning.main', fontSize: 18 }} />
          </Box>
        ) : (
          <Checkbox
            checked={isSelected}
            onChange={() => toggleFileSelection(file.id)}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{ p: 0.5 }}
          />
        )}

        <Box sx={sx.fileContentBox}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography
              variant="body2"
              color={isErrorFile ? 'error' : isUnknownFile ? 'warning' : 'text.primary'}
              sx={sx.fileName}
            >
              {file.file.name}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(file.file.size)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Uploaded {toDisplayDate(new Date(file.created), locale, { formatTo: 'd MMM yyyy, HH:mm:ss' })}
            </Typography>

            {isErrorFile ? (
              <>
                <Typography variant="caption" color="text.secondary">
                  {MISC.CENTER_DOT}
                </Typography>
                <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
                  {file.error}
                </Typography>
              </>
            ) : null}
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {file.status === StatsFileStatus.PARSING ? <CircularProgress size={14} /> : <BankChip file={file} />}

          <Tooltip title="Remove file">
            <IconButton
              color={isErrorFile ? 'error' : isUnknownFile ? 'warning' : 'secondary'}
              onClick={(event) => {
                event.stopPropagation()
                removeFile(file.id)
              }}
            >
              <DeleteOutlined sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
    </Box>
  )
}

export default Component
