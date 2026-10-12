'use client'

import { Typography } from '@mui/material'

import { useTranslation } from '@/lib/i18n'

import { useWorkspaceFiles } from '../../context'
import FileDetails from '../FileDetails'
import StatsCard from '../StatsCard'
import StatsSkeleton from '../StatsSkeleton'
import TransactionsSummary from '../TransactionsSummary'
import { ui } from './styled'

type FileSidebarProps = {
  includeDuplicates: boolean
}

/**
 * Summary of the checked files and the details per file.
 */
const Component = ({ includeDuplicates }: FileSidebarProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const { checkedFiles, selectedFiles: checkedParsedFiles } = useWorkspaceFiles()

  if (!checkedFiles.length) {
    return <StatsSkeleton />
  }

  return (
    <>
      {checkedParsedFiles.length ? (
        <>
          <StatsCard>
            <TransactionsSummary files={checkedParsedFiles} includeDuplicates={includeDuplicates} />
          </StatsCard>
          <Typography component="h2" sx={sx.subheader}>
            {t('STATS_PAGE.SIDEBAR.FILE_DETAILS')}
          </Typography>
        </>
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
