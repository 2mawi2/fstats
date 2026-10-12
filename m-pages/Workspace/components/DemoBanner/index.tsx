import { Close } from '@mui/icons-material'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'

import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

type DemoBannerProps = {
  onAddFiles: () => void
}

const Component = ({ onAddFiles }: DemoBannerProps) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        // Edge to edge below the toolbar, aligned with its content
        flexShrink: 0,
        py: 0.5,
        px: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1.5 : 0,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0 }}>
        {t('STATS_PAGE.DEMO_BANNER')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          onClick={onAddFiles}
          variant="outlined"
          size="small"
          sx={{
            color: '#fff',
            borderColor: '#fff',
            '&:hover': {
              borderColor: '#fff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {t('STATS_PAGE.UPLOAD_YOUR_DATA')}
        </Button>
        {/* Same page without the demo query */}
        <Tooltip title={t('STATS_PAGE.END_DEMO')}>
          <IconButton
            edge="end"
            aria-label={t('STATS_PAGE.END_DEMO')}
            onClick={() => router.replace(pathname)}
            sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default Component
