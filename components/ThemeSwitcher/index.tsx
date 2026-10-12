'use client'

import { useColorScheme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { useTranslation } from '@/lib/i18n'

import OptionSwitcher from '../OptionSwitcher'
import { getActiveIcon, getActiveLabel } from './actions'

const MODES = [ColorMode.SYSTEM, ColorMode.LIGHT, ColorMode.DARK]

type ThemeSwitcherProps = {
  showLabel?: boolean
}

const Component = ({ showLabel = false }: ThemeSwitcherProps) => {
  const { t } = useTranslation()
  const { mode, setMode } = useColorScheme()

  const onSelect = (value: ColorMode) => {
    setMode(value)
  }

  return (
    <OptionSwitcher
      title={t('COMPONENTS.THEME_SWITCHER.CHOOSE_THEME')}
      icon={getActiveIcon(mode, 'secondary')}
      label={getActiveLabel(mode)}
      showLabel={showLabel}
      listSx={{ pt: 0 }}
      options={MODES.map((value) => ({
        value,
        primary: t(`COMPONENTS.THEME_SWITCHER.THEME_${value.toUpperCase()}`),
        checked: mode === value,
      }))}
      onSelect={onSelect}
    />
  )
}

export default Component
