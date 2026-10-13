'use client'

import { AccountBalanceOutlined, CreditCardOutlined } from '@mui/icons-material'
import { Box, Chip } from '@mui/material'

import type { StatsFile } from '@/types'
import { MISC } from '@/common'
import { getFileCurrency, getFileTransactions, isParsed } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { toDisplayDate } from '@/utils/Date'
import { formatFileSize } from '@/utils/File'
import { useTranslation } from '@/lib/i18n'

import { filterDays, getFileAccount, getFileFormat, getFileNameColor } from '../../actions'
import StatsRow from '../StatsRow'
import { ui } from './styled'

type FileDetailsProps = {
  file: StatsFile
  /**
   * Days deselected in the date explorer.
   */
  deselectedDays: Set<string>
}

const Component = ({ file, deselectedDays }: FileDetailsProps) => {
  const { t } = useTranslation()
  const sx = ui()
  const { locale } = useUserPreferences()

  const renderAccount = () => {
    if (!isParsed(file)) {
      // Why the file wasn't parsed
      const format = getFileFormat(file)
      return (
        <Box sx={{ ...sx.status, color: format.color }} title={format.value}>
          {format.value}
        </Box>
      )
    }

    const { bankName, accountNames } = getFileAccount(file)

    return (
      <Box sx={sx.chips}>
        <Chip size="small" variant="outlined" icon={<AccountBalanceOutlined />} label={bankName} sx={sx.chip} />
        {accountNames.map((accountName) => (
          <Chip
            key={accountName}
            size="small"
            variant="outlined"
            icon={<CreditCardOutlined />}
            label={accountName}
            sx={sx.chip}
          />
        ))}
      </Box>
    )
  }

  const fileTransactions = isParsed(file) ? getFileTransactions(file) : []
  const transactions = filterDays(fileTransactions, deselectedDays)
  const dateExcludedCount = fileTransactions.length - transactions.length

  return (
    <StatsRow
      title={file.file.name}
      titleColor={getFileNameColor(file)}
      stats={isParsed(file) ? { transactions, currency: getFileCurrency(file) } : null}
      isDateFiltered={dateExcludedCount > 0}
      notes={dateExcludedCount ? [t('STATS_PAGE.SIDEBAR.DATE_EXCLUDED', { count: dateExcludedCount })] : []}
    >
      <Box sx={sx.info}>
        {renderAccount()}
        <Box sx={sx.meta}>
          {formatFileSize(file.file.size)} {MISC.CENTER_DOT}{' '}
          {toDisplayDate(new Date(file.created), locale, { formatTo: 'd MMM yyyy, HH:mm' })}
        </Box>
      </Box>
    </StatsRow>
  )
}

export default Component
