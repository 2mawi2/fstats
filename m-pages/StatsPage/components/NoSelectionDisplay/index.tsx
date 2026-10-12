'use client'

import { ChecklistOutlined } from '@mui/icons-material'

import { useTranslation } from '@/lib/i18n'

import EmptyDisplay from '../EmptyDisplay'

/**
 * Shown in place of the data when there are files, but none are checked.
 */
const Component = () => {
  const { t } = useTranslation()

  return (
    <EmptyDisplay
      icon={ChecklistOutlined}
      title={t('STATS_PAGE.NO_SELECTION.TITLE')}
      subtitle={t('STATS_PAGE.NO_SELECTION.SUBTITLE')}
    />
  )
}

export default Component
