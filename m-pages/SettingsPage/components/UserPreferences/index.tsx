'use client'

import { ChevronRight } from '@mui/icons-material'
import { Box, ButtonBase, Typography } from '@mui/material'

import type { OptionSwitcherTriggerProps } from '@/components'
import { DateFormatSwitcher, LanguageSwitcher, ThemeSwitcher } from '@/components'
import { useTranslation } from '@/lib/i18n'

import SettingsCard from '../SettingsCard'
import { ui } from './styled'

type PreferenceTileProps = OptionSwitcherTriggerProps & {
  title: string
}

const PreferenceTile = ({ title, icon, label, onOpen }: PreferenceTileProps) => {
  const sx = ui()

  return (
    <ButtonBase onClick={onOpen} sx={sx.tile}>
      <Box sx={sx.iconCircle}>{icon}</Box>
      <Box sx={sx.text}>
        <Typography variant="caption" component="p" sx={sx.tileTitle}>
          {title}
        </Typography>
        <Typography sx={sx.value}>{label}</Typography>
      </Box>
      <ChevronRight sx={sx.chevron} />
    </ButtonBase>
  )
}

const Component = () => {
  const sx = ui()
  const { t } = useTranslation()

  return (
    <SettingsCard title={t('SETTINGS_PAGE.PREFERENCES.TITLE')}>
      <Box sx={sx.tiles}>
        <ThemeSwitcher
          renderTrigger={(props) => <PreferenceTile title={t('COMPONENTS.THEME_SWITCHER.THEME')} {...props} />}
        />
        <LanguageSwitcher
          renderTrigger={(props) => <PreferenceTile title={t('COMPONENTS.LANGUAGE_SWITCHER.LANGUAGE')} {...props} />}
        />
        <DateFormatSwitcher
          renderTrigger={(props) => <PreferenceTile title={t('COMPONENTS.DATE_FORMAT_SWITCHER.TITLE')} {...props} />}
        />
      </Box>
    </SettingsCard>
  )
}

export default Component
