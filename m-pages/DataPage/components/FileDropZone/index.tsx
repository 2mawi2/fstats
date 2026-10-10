'use client'

import { CloudUploadOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import type { NewStatsFile, RDZFileRejection, RDZFileWithPath } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { MISC } from '@/common'
import { isParsed, useMutateAddFiles, useMutateUpdateFiles } from '@/m-stats-file/service'
import { useFileHelper, useIsDarkMode, useIsMobile, useUserPreferences } from '@/hooks'
import { parseFiles } from '@/utils/FileParser'

import { ui } from './styled'

const Component = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const { mutateAsync: addFiles } = useMutateAddFiles()
  const { mutateAsync: updateFiles } = useMutateUpdateFiles()
  const { setSelectedFileIds } = useFileHelper()
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
    accept: {
      'text/csv': ['.csv'],
      // 'application/pdf': ['.pdf'], // TODO: Support in future, perhaps use https://github.com/mehmet-kozan/pdf-parse
    },
    maxSize: MISC.MAX_UPLOAD_FILE_SIZE,
    multiple: true,
  })

  return (
    <Box {...dropzone.getRootProps()} sx={sx.dropZone(dropzone.isDragActive)}>
      <input id="dropzone-file-input" {...dropzone.getInputProps()} />
      <CloudUploadOutlined sx={sx.uploadIcon} />
      <Typography variant="h5">Drop your files here</Typography>
      <Typography variant="body2" color="text.secondary">
        or click to select files
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        CSV files only, max 5MB each
      </Typography>
    </Box>
  )
}

export default Component
