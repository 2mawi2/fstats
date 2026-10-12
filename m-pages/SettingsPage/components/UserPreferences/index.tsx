'use client'

import { Box, ButtonBase, Card, Typography } from '@mui/material'

import type { OptionSwitcherTriggerProps } from '@/components'
import { DateFormatSwitcher, LanguageSwitcher, ThemeSwitcher } from '@/components'
import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

type PreferenceTileProps = OptionSwitcherTriggerProps & {
  title: string
}

const PreferenceTile = ({ title, icon, label, onOpen }: PreferenceTileProps) => {
  const sx = ui()

  return (
    <ButtonBase onClick={onOpen} sx={sx.tile}>
      <Box sx={sx.tileHeader}>
        {icon}
        <Typography variant="caption" component="p" sx={sx.tileTitle}>
          {title}
        </Typography>
      </Box>
      <Typography sx={sx.value}>{label}</Typography>
    </ButtonBase>
  )
}

const Component = () => {
  const sx = ui()
  const { t } = useTranslation()

  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        {t('SETTINGS_PAGE.PREFERENCES.TITLE')}
      </Typography>

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
    </Card>
  )
}

export default Component
