'use client'

import { DeleteOutlined, FolderOutlined, StorageRounded } from '@mui/icons-material'
import { Box, Button, Card, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { useFiles, useMutateRemoveAllFiles } from '@/m-stats-file/service'
import { formatFileSize } from '@/utils/File'
import { useTranslation } from '@/lib/i18n'

import { calculateStorageSize } from './actions'
import { ui } from './styled'

const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  const { data: files = [], isLoading: isLoadingFiles } = useFiles()
  const { mutate: removeAllFiles, isPending: isRemovingFiles } = useMutateRemoveAllFiles()
  const [storageSize, setStorageSize] = useState<string>(formatFileSize(0))
  const [isCalculating, setIsCalculating] = useState(true)

  useEffect(() => {
    const calculateInfo = async () => {
      setIsCalculating(true)
      try {
        const size = await calculateStorageSize()
        setStorageSize(formatFileSize(size))
      } catch {
        setStorageSize(t('SETTINGS_PAGE.STORAGE.FAILED_TO_CALCULATE'))
      } finally {
        setIsCalculating(false)
      }
    }

    calculateInfo()
  }, [files.length, t])

  const fileCount = files.length
  const hasFiles = fileCount > 0

  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        {t('SETTINGS_PAGE.STORAGE.TITLE')}
      </Typography>

      <Box sx={sx.statsContainer}>
        <Box sx={sx.statItem}>
          <FolderOutlined sx={sx.statIcon} />
          <Box>
            <Typography sx={sx.statValue(isLoadingFiles)}>{fileCount}</Typography>
            <Typography variant="caption" sx={sx.statLabel}>
              {t('SETTINGS_PAGE.STORAGE.FILES', { count: fileCount })}
            </Typography>
          </Box>
        </Box>

        <Box sx={sx.statItem}>
          <StorageRounded sx={sx.statIcon} />
          <Box>
            <Typography sx={sx.statValue(isLoadingFiles || isCalculating)}>{storageSize}</Typography>
            <Typography variant="caption" sx={sx.statLabel}>
              {t('SETTINGS_PAGE.STORAGE.STORAGE_USED')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        color="error"
        variant="outlined"
        startIcon={<DeleteOutlined />}
        onClick={() => {
          if (confirm(t('SETTINGS_PAGE.STORAGE.CONFIRM_CLEAR'))) {
            removeAllFiles()
          }
        }}
        disabled={!hasFiles}
        loading={isRemovingFiles}
      >
        {t('SETTINGS_PAGE.STORAGE.CLEAR_ALL_DATA')}
      </Button>
    </Card>
  )
}

export default Component
