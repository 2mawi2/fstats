import { Box, Typography } from '@mui/material'

import { MISC } from '@/common'
import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

type TransactionInfoProps = {
  total: number
  duplicates: number
}

const Component = ({ total, duplicates }: TransactionInfoProps) => {
  const sx = ui()
  const { t } = useTranslation()

  return (
    <Box sx={sx.container}>
      <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
        {t('STATS_PAGE.TRANSACTION_COUNT', { count: total - duplicates })}
      </Typography>
      {duplicates > 0 ? (
        <>
          <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>{` ${MISC.CENTER_DOT} `}</Typography>
          <Typography sx={{ fontSize: 15, color: 'info.light' }}>
            {t('STATS_PAGE.DUPLICATES_REMOVED', { count: duplicates })}
          </Typography>
        </>
      ) : null}
    </Box>
  )
}

export default Component
