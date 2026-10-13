'use client'

import type { SvgIconComponent } from '@mui/icons-material'
import { ChecklistOutlined, DescriptionOutlined, EventBusyOutlined, FilterAltOffOutlined } from '@mui/icons-material'

import { useTranslation } from '@/lib/i18n'

import { EMPTY_REASON_TITLE_KEYS, EmptyReason } from '../../actions'
import DropZoneDisplay from '../DropZoneDisplay'
import EmptyDisplay from '../EmptyDisplay'

const ICONS: Record<Exclude<EmptyReason, typeof EmptyReason.NO_FILES>, SvgIconComponent> = {
  [EmptyReason.NO_SELECTION]: ChecklistOutlined,
  [EmptyReason.NO_TRANSACTIONS]: DescriptionOutlined,
  [EmptyReason.NO_DATES]: EventBusyOutlined,
  [EmptyReason.NO_MATCHES]: FilterAltOffOutlined,
}

const SUBTITLE_KEYS: Record<Exclude<EmptyReason, typeof EmptyReason.NO_FILES>, string> = {
  [EmptyReason.NO_SELECTION]: 'STATS_PAGE.NO_SELECTION.SUBTITLE',
  [EmptyReason.NO_TRANSACTIONS]: 'STATS_PAGE.NO_TRANSACTIONS.EMPTY_SUBTITLE',
  [EmptyReason.NO_DATES]: 'STATS_PAGE.NO_TRANSACTIONS.NO_DATES_SUBTITLE',
  [EmptyReason.NO_MATCHES]: 'STATS_PAGE.NO_TRANSACTIONS.NO_MATCHES_SUBTITLE',
}

type ViewEmptyStateProps = {
  reason: EmptyReason
  /**
   * Of the drop zone shown without files, see `DropZoneDisplay`.
   */
  dropZone?: { icon: SvgIconComponent; title: string; subtitleKey: string }
}

/**
 * Shown in place of the middle column's view, see `getEmptyReason`.
 */
const Component = ({ reason, dropZone }: ViewEmptyStateProps) => {
  const { t } = useTranslation()

  if (reason === EmptyReason.NO_FILES) {
    return <DropZoneDisplay {...dropZone} />
  }

  return (
    <EmptyDisplay icon={ICONS[reason]} title={t(EMPTY_REASON_TITLE_KEYS[reason])} subtitle={t(SUBTITLE_KEYS[reason])} />
  )
}

export default Component
