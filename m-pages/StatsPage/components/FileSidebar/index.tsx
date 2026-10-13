'use client'

import { Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { useTranslation } from '@/lib/i18n'

import { filterFiles } from '../../actions'
import { useShownFiles, useWorkspaceFiles } from '../../context'
import { getView, WorkspaceView } from '../../params'
import { useTransactionFilter } from '../../useTransactionFilter'
import FileDetails from '../FileDetails'
import StatsCard from '../StatsCard'
import StatsSkeleton from '../StatsSkeleton'
import TransactionsSummary from '../TransactionsSummary'
import { ui } from './styled'

/**
 * Summary of the checked files and the details per file.
 */
const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  // Before the date explorer, the counts include those on deselected days. Filtered by category below.
  const { checkedFiles } = useWorkspaceFiles()
  const { parsedFiles: checkedParsedFiles, allParsedFiles, deselectedDays } = useShownFiles()
  // The summary is only a placeholder, the filters don't apply to the CSV view
  const isCsv = getView(useSearchParams()) === WorkspaceView.CSV
  const csvTitle = t('STATS_PAGE.CSV_DISABLED')
  // The stats show money in and out side by side, so only the category filter applies
  const { categoryFilter } = useTransactionFilter()
  const summaryFiles = useMemo(() => filterFiles(allParsedFiles, categoryFilter), [allParsedFiles, categoryFilter])
  const detailFiles = useMemo(() => filterFiles(checkedFiles, categoryFilter), [checkedFiles, categoryFilter])

  if (!checkedFiles.length) {
    return <StatsSkeleton title={t('STATS_PAGE.NO_SELECTION.TITLE')} />
  }

  return (
    <>
      {checkedParsedFiles.length ? (
        <>
          {isCsv ? (
            <StatsSkeleton title={csvTitle} />
          ) : (
            <StatsCard>
              <TransactionsSummary files={summaryFiles} deselectedDays={deselectedDays} />
            </StatsCard>
          )}
          <Typography component="h2" sx={sx.subheader}>
            {t('STATS_PAGE.SIDEBAR.FILE_DETAILS')}
          </Typography>
        </>
      ) : null}
      <StatsCard>
        {detailFiles.map((file) => (
          <FileDetails key={file.id} file={file} deselectedDays={deselectedDays} />
        ))}
      </StatsCard>
    </>
  )
}

export default Component
