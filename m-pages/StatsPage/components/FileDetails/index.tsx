'use client'

import { AccountBalanceOutlined, CreditCardOutlined } from '@mui/icons-material'
import { Box, Chip } from '@mui/material'

import type { StatsFile } from '@/types'
import { MISC } from '@/common'
import { getFileCurrency, getFileTransactions, isParsed } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { toDisplayDate } from '@/utils/Date'
import { formatFileSize } from '@/utils/File'

import { getFileAccount, getFileFormat, getFileNameColor } from '../../actions'
import StatsRow from '../StatsRow'
import { ui } from './styled'

type FileDetailsProps = {
  file: StatsFile
  /**
   * Transactions on days deselected in the date explorer, `file` is without them.
   */
  dateExcludedCount: number
}

const Component = ({ file, dateExcludedCount }: FileDetailsProps) => {
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

  return (
    <StatsRow
      title={file.file.name}
      titleColor={getFileNameColor(file)}
      stats={isParsed(file) ? { transactions: getFileTransactions(file), currency: getFileCurrency(file) } : null}
      dateExcludedCount={dateExcludedCount}
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
