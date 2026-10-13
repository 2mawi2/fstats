'use client'

import { Close } from '@mui/icons-material'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'

import { getEndDemoHref } from '@/common'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { useWorkspace } from '../../context'
import { ui } from './styled'

const Component = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const sx = ui(isMobile)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { onAddFiles } = useWorkspace()

  return (
    <Box sx={sx.banner}>
      <Typography variant="body2" sx={sx.text}>
        {t('STATS_PAGE.DEMO.BANNER')}
      </Typography>
      <Box sx={sx.actions}>
        <Button onClick={onAddFiles} variant="outlined" size="small" sx={sx.uploadButton}>
          {t('STATS_PAGE.DEMO.UPLOAD_YOUR_DATA')}
        </Button>
        <Tooltip title={t('STATS_PAGE.DEMO.END')}>
          <IconButton
            edge="end"
            aria-label={t('STATS_PAGE.DEMO.END')}
            onClick={() => router.replace(getEndDemoHref(searchParams))}
            sx={sx.closeButton}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default Component
