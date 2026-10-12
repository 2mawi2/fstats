'use client'

import { Typography } from '@mui/material'

import { useFileHelper } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import FileDetails from '../FileDetails'
import StatsCard from '../StatsCard'
import StatsSkeleton from '../StatsSkeleton'
import TransactionsSummary from '../TransactionsSummary'
import { ui } from './styled'

type FileSidebarProps = {
  includeDuplicates: boolean
  isDemoMode?: boolean
}

/**
 * Summary of the checked files and the details per file.
 */
const Component = ({ includeDuplicates, isDemoMode = false }: FileSidebarProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const { checkedFiles, selectedFiles: checkedParsedFiles } = useFileHelper({ isDemoMode })

  if (!checkedFiles.length) {
    return <StatsSkeleton />
  }

  return (
    <>
      {checkedParsedFiles.length ? (
        <StatsCard>
          <TransactionsSummary files={checkedParsedFiles} includeDuplicates={includeDuplicates} />
        </StatsCard>
      ) : null}
      {checkedParsedFiles.length ? (
        <Typography component="h2" sx={sx.subheader}>
          {t('DATA_PAGE.FILE_DETAILS')}
        </Typography>
      ) : null}
      <StatsCard>
        {checkedFiles.map((file) => (
          <FileDetails key={file.id} file={file} />
        ))}
      </StatsCard>
    </>
  )
}

export default Component
