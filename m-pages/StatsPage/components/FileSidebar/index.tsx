'use client'

import { Typography } from '@mui/material'

import { useTranslation } from '@/lib/i18n'

import { useWorkspaceFiles } from '../../context'
import FileDetails from '../FileDetails'
import StatsCard from '../StatsCard'
import StatsSkeleton from '../StatsSkeleton'
import TransactionsSummary from '../TransactionsSummary'
import { ui } from './styled'

// The date filter doesn't apply to the CSV view
const NO_DAYS = new Set<string>()

type FileSidebarProps = {
  includeDuplicates: boolean
  /**
   * Days deselected in the date explorer.
   */
  deselectedDays: Set<string>
  /**
   * The summary is only a placeholder, the filters don't apply to the CSV view.
   */
  isCsv: boolean
}

/**
 * Summary of the checked files and the details per file.
 */
const Component = ({ includeDuplicates, deselectedDays, isCsv }: FileSidebarProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const { checkedFiles, selectedFiles: checkedParsedFiles } = useWorkspaceFiles()

  const csvTitle = t('STATS_PAGE.DATA_VIEW.AMOUNT_FILTER.CSV_DISABLED')

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
          <FileDetails key={file.id} file={file} deselectedDays={isCsv ? NO_DAYS : deselectedDays} />
        ))}
      </StatsCard>
    </>
  )
}

export default Component
