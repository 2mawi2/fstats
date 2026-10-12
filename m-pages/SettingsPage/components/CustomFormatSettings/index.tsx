'use client'

import { DeleteOutlined } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'

import { MISC } from '@/common'
import { useCustomFormats, useMutateDeleteCustomFormat } from '@/m-custom-format/service'
import { useTranslation } from '@/lib/i18n'

import SettingsCard from '../SettingsCard'

const Component = () => {
  const { t } = useTranslation()
  const { data: formats = [] } = useCustomFormats()
  const { mutate: deleteFormat, isPending, variables } = useMutateDeleteCustomFormat()

  return (
    <SettingsCard title={t('SETTINGS_PAGE.CUSTOM_FORMATS.TITLE')}>
      {formats.length ? (
        <List disablePadding>
          {formats.map((format) => (
            <ListItem
              key={format.id}
              disableGutters
              divider
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label={t('SETTINGS_PAGE.CUSTOM_FORMATS.DELETE')}
                  title={t('SETTINGS_PAGE.CUSTOM_FORMATS.DELETE')}
                  onClick={() => {
                    if (confirm(t('SETTINGS_PAGE.CUSTOM_FORMATS.CONFIRM_DELETE', { name: format.bankName }))) {
                      deleteFormat(format)
                    }
                  }}
                  disabled={isPending && variables?.id === format.id}
                >
                  <DeleteOutlined />
                </IconButton>
              }
            >
              <ListItemText
                primary={format.bankName}
                secondary={`${t('SETTINGS_PAGE.CUSTOM_FORMATS.COLUMNS', { count: format.headers.length })} ${MISC.CENTER_DOT} ${format.currency} ${MISC.CENTER_DOT} ${format.dateFormat}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('SETTINGS_PAGE.CUSTOM_FORMATS.EMPTY')}
        </Typography>
      )}
    </SettingsCard>
  )
}

export default Component
