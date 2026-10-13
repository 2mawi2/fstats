'use client'

import { DeleteOutlined, FolderOutlined, StorageRounded } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'

import { useFiles, useMutateRemoveAllFiles, useStorageSize } from '@/m-stats-file/service'
import { formatFileSize } from '@/utils/File'
import { useTranslation } from '@/lib/i18n'

import SettingsCard from '../SettingsCard'
import { ui } from './styled'

const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  const { data: files = [], isLoading: isLoadingFiles } = useFiles()
  const { mutate: removeAllFiles, isPending: isRemovingFiles } = useMutateRemoveAllFiles()
  const { data: size = 0, isLoading: isCalculating, isError } = useStorageSize()
  const storageSize = isError ? t('SETTINGS_PAGE.STORAGE.FAILED_TO_CALCULATE') : formatFileSize(size)

  const fileCount = files.length
  const hasFiles = fileCount > 0

  return (
    <SettingsCard title={t('SETTINGS_PAGE.STORAGE.TITLE')}>
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
    </SettingsCard>
  )
}

export default Component
