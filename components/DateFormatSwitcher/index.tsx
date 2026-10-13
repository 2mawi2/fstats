'use client'

import { DateRangeOutlined } from '@mui/icons-material'
import type { ReactNode } from 'react'

import { DateFormat } from '@/types-enums'
import { useUserPreferences } from '@/hooks'
import { getDateFormatSelectOptions, toDisplayDate } from '@/utils/Date'
import { useTranslation } from '@/lib/i18n'

import OptionSwitcher from '../OptionSwitcher'
import type { OptionSwitcherTriggerProps } from '../OptionSwitcher'

type DateFormatSwitcherProps = {
  showLabel?: boolean
  renderTrigger?: (props: OptionSwitcherTriggerProps) => ReactNode
}

const Component = ({ showLabel = false, renderTrigger }: DateFormatSwitcherProps) => {
  const { t } = useTranslation()
  const { locale, dateFormat, setDateFormat } = useUserPreferences()

  return (
    <OptionSwitcher
      title={t('COMPONENTS.DATE_FORMAT_SWITCHER.CHANGE_DATE_FORMAT')}
      icon={<DateRangeOutlined color="secondary" sx={{ fontSize: 18 }} />}
      label={toDisplayDate(new Date(), locale, { formatTo: dateFormat })}
      showLabel={showLabel}
      renderTrigger={renderTrigger}
      fixedHeader
      options={getDateFormatSelectOptions(locale).map((option) => ({
        value: option.value,
        primary: toDisplayDate(new Date(), locale, { formatTo: option.value }),
        checked: option.value === dateFormat,
      }))}
      onSelect={(value: DateFormat) => setDateFormat(value)}
    />
  )
}

export default Component
