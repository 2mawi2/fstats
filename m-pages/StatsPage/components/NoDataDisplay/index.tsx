'use client'

import { InsertChartOutlined } from '@mui/icons-material'

import { DropZoneDisplay } from '@/m-pages/DataPage/components'
import { useTranslation } from '@/lib/i18n'

type NoDataDisplayProps = {
  onAddFiles: () => void
  onAddFolder: () => void
}

/**
 * Shown in place of the stats when there are no files, like the drop zone of the data page.
 */
const Component = ({ onAddFiles, onAddFolder }: NoDataDisplayProps) => {
  const { t } = useTranslation()

  return (
    <DropZoneDisplay
      icon={InsertChartOutlined}
      title={t('STATS_PAGE.NO_DATA')}
      subtitleKey="STATS_PAGE.NO_DATA_SELECT"
      onAddFiles={onAddFiles}
      onAddFolder={onAddFolder}
    />
  )
}

export default Component
