'use client'

import { EventBusyOutlined, FilterAltOffOutlined } from '@mui/icons-material'

import { useTranslation } from '@/lib/i18n'

import { EmptyReason } from '../../actions'
import EmptyDisplay from '../EmptyDisplay'

type NoTransactionsDisplayProps = {
  reason: EmptyReason
}

/**
 * Shown in place of the data when files are checked, but the date explorer or amount filter leave no transactions.
 */
const Component = ({ reason }: NoTransactionsDisplayProps) => {
  const { t } = useTranslation()

  return reason === EmptyReason.NO_DATES ? (
    <EmptyDisplay
      icon={EventBusyOutlined}
      title={t('STATS_PAGE.NO_TRANSACTIONS.NO_DATES_TITLE')}
      subtitle={t('STATS_PAGE.NO_TRANSACTIONS.NO_DATES_SUBTITLE')}
    />
  ) : (
    <EmptyDisplay
      icon={FilterAltOffOutlined}
      title={t('STATS_PAGE.NO_TRANSACTIONS.NO_MATCHES_TITLE')}
      subtitle={t('STATS_PAGE.NO_TRANSACTIONS.NO_MATCHES_SUBTITLE')}
    />
  )
}

export default Component
