'use client'

import { CloudUploadOutlined } from '@mui/icons-material'
import { Link } from '@mui/material'

import { MISC } from '@/common'
import { Trans, useTranslation } from '@/lib/i18n'

import EmptyDisplay from '../EmptyDisplay'

type DropZoneDisplayProps = {
  onAddFiles: () => void
  onAddFolder: () => void
}

/**
 * Shown in place of the data when there are no files. The whole page is the drop zone.
 */
const Component = ({ onAddFiles, onAddFolder }: DropZoneDisplayProps) => {
  const { t } = useTranslation()

  // Don't also trigger the click of the whole display
  const renderLink = (onClick: () => void) => (
    <Link
      component="button"
      variant="body2"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      sx={{ verticalAlign: 'baseline', mb: 0 }}
    />
  )

  return (
    <EmptyDisplay
      icon={CloudUploadOutlined}
      title={t('DATA_PAGE.DROP_FILES_ANYWHERE')}
      subtitle={
        <Trans
          i18nKey="DATA_PAGE.CLICK_TO_SELECT"
          values={{ dot: MISC.CENTER_DOT }}
          components={{ files: renderLink(onAddFiles), link: renderLink(onAddFolder) }}
        />
      }
      caption={t('DATA_PAGE.FILE_RESTRICTIONS')}
      onClick={onAddFiles}
    />
  )
}

export default Component
