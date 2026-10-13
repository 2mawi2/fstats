'use client'

import { DateRangeOutlined } from '@mui/icons-material'
import type { ReactNode } from 'react'

import type { DateFormat } from '@/types-enums'
import type { OptionSwitcherTriggerProps } from '@/components'
import { OptionSwitcher } from '@/components'
import { useUserPreferences } from '@/m-user/service'
import { getDateFormatSelectOptions } from '@/utils/Date'
import { useTranslation } from '@/lib/i18n'

type DateFormatSwitcherProps = {
  renderTrigger?: (props: OptionSwitcherTriggerProps) => ReactNode
}

const Component = ({ renderTrigger }: DateFormatSwitcherProps) => {
  const { t } = useTranslation()
  const { locale, dateFormat, setDateFormat } = useUserPreferences()
  // Today's date in each format
  const options = getDateFormatSelectOptions(locale)

  return (
    <OptionSwitcher
      title={t('SETTINGS_PAGE.DATE_FORMAT_SWITCHER.CHANGE_DATE_FORMAT')}
      icon={<DateRangeOutlined color="secondary" sx={{ fontSize: 18 }} />}
      label={options.find((option) => option.value === dateFormat)?.label}
      renderTrigger={renderTrigger}
      fixedHeader
      options={options.map((option) => ({
        value: option.value,
        primary: option.label,
        checked: option.value === dateFormat,
      }))}
      onSelect={(value: DateFormat) => setDateFormat(value)}
    />
  )
}

export default Component
