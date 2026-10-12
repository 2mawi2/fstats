'use client'

import { InfoOutlined } from '@mui/icons-material'
import { Box, Card, FormControlLabel, Switch, Typography } from '@mui/material'
import type { ChangeEvent } from 'react'

import { useIsMobile, useUserPreferences } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

const Component = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { persistData, setPersistData } = useUserPreferences()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPersistData(event.target.checked)
  }

  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        {t('SETTINGS_PAGE.DEVICE.TITLE')}
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 0.5, alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch checked={persistData} onChange={onChange} />}
          label={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0 }}>
                {t('SETTINGS_PAGE.DEVICE.PERSIST_DATA')}
              </Typography>
            </Box>
          }
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1.25 : 0.5 }}>
        <InfoOutlined color={persistData ? 'warning' : 'secondary'} sx={{ fontSize: 16 }} />
        <Typography variant="caption" color={persistData ? 'warning' : 'text.secondary'}>
          {persistData ? t('SETTINGS_PAGE.DEVICE.PERSIST_ON') : t('SETTINGS_PAGE.DEVICE.PERSIST_OFF')}
        </Typography>
      </Box>
    </Card>
  )
}

export default Component
