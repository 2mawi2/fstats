'use client'

import { Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation'

import { useTranslation } from '@/lib/i18n'

import { useWorkspaceDayFilter, useWorkspaceFiles } from '../../context'
import { getView, WorkspaceView } from '../../params'
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
  const { deselectedDays } = useWorkspaceDayFilter()
  // The summary is only a placeholder, the filters don't apply to the CSV view
  const isCsv = getView(useSearchParams()) === WorkspaceView.CSV
  const csvTitle = t('STATS_PAGE.CSV_DISABLED')

  if (!checkedFiles.length) {
    return <StatsSkeleton title={isCsv ? csvTitle : t('STATS_PAGE.NO_SELECTION.TITLE')} />
  }

  return (
    <>
      {checkedParsedFiles.length ? (
        <>
          {isCsv ? (
            <StatsSkeleton title={csvTitle} />
          ) : (
            <StatsCard>
              <TransactionsSummary
                files={checkedParsedFiles}
                includeDuplicates={includeDuplicates}
                deselectedDays={deselectedDays}
              />
            </StatsCard>
          )}
          <Typography component="h2" sx={sx.subheader}>
            {t('STATS_PAGE.SIDEBAR.FILE_DETAILS')}
          </Typography>
        </>
      ) : null}
      <StatsCard>
        {checkedFiles.map((file) => (
          <FileDetails key={file.id} file={file} deselectedDays={deselectedDays} />
        ))}
      </StatsCard>
    </>
  )
}

export default Component
