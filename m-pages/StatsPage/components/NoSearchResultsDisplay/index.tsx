'use client'

import { SearchOffOutlined } from '@mui/icons-material'
import { Button } from '@mui/material'

import { useTranslation } from '@/lib/i18n'

import EmptyDisplay from '../EmptyDisplay'

type NoSearchResultsDisplayProps = {
  search: string
  onClear: () => void
}

/**
 * Shown in place of the tables when no rows match the search.
 */
const Component = ({ search, onClear }: NoSearchResultsDisplayProps) => {
  const { t } = useTranslation()

  return (
    <EmptyDisplay
      icon={SearchOffOutlined}
      title={t('STATS_PAGE.DATA_VIEW.NO_SEARCH_RESULTS.TITLE')}
      subtitle={t('STATS_PAGE.DATA_VIEW.NO_SEARCH_RESULTS.SUBTITLE', { search })}
      actions={
        <Button variant="outlined" onClick={onClear}>
          {t('STATS_PAGE.DATA_VIEW.CLEAR_SEARCH')}
        </Button>
      }
    />
  )
}

export default Component
