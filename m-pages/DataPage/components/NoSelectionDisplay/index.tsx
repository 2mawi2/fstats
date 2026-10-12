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
      title={t('DATA_PAGE.NO_FILE_SELECTED')}
      subtitle={t('DATA_PAGE.CHECK_FILE_FOR_DATA')}
    />
  )
}

export default Component
