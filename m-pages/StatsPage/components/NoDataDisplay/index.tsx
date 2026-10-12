'use client'

import { InsertChartOutlined } from '@mui/icons-material'
import { Button } from '@mui/material'
import Link from 'next/link'

import { ROUTES } from '@/common'
import { EmptyDisplay } from '@/m-pages/DataPage/components'
import { useTranslation } from '@/lib/i18n'

type NoDataDisplayProps = {
  onAddFiles: () => void
}

/**
 * Shown in place of the stats when there are no files. The whole page is the drop zone.
 */
const Component = ({ onAddFiles }: NoDataDisplayProps) => {
  const { t } = useTranslation()

  return (
    <EmptyDisplay
      icon={InsertChartOutlined}
      title={t('STATS_PAGE.NO_DATA')}
      subtitle={t('STATS_PAGE.NO_DATA_BLURB')}
      actions={
        <>
          <Button variant="contained" onClick={onAddFiles}>
            {t('STATS_PAGE.UPLOAD_FILES')}
          </Button>
          <Button component={Link} href={`${ROUTES.STATS}?demo=true`} variant="outlined">
            {t('MISC.VIEW_DEMO')}
          </Button>
        </>
      }
    />
  )
}

export default Component
