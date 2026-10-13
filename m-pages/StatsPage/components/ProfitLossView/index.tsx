'use client'

import { ReceiptLongOutlined } from '@mui/icons-material'
import { Box, Divider, Stack } from '@mui/material'
import { groupBy, mapValues } from 'lodash'
import { useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { getFileTransactions } from '@/m-stats-file/service'
import { useTranslation } from '@/lib/i18n'

import { AmountFilter, getEmptyReason, getTransactionCounts, getTransactionCountText } from '../../actions'
import { useShownFiles, useWorkspaceFiles } from '../../context'
import CardTitle from '../CardTitle'
import DropZoneDisplay from '../DropZoneDisplay'
import NoSelectionDisplay from '../NoSelectionDisplay'
import NoTransactionsDisplay from '../NoTransactionsDisplay'
import SegmentedToggle from '../SegmentedToggle'
import ViewToolbar from '../ViewToolbar'
import { BreakdownPeriod, getBreakdownPeriodOptions, getProfitLoss } from './actions'
import { ProfitLossTable } from './components'
import { ui } from './styled'

/**
 * Profit and loss view of the workspace: income and expenses per category and period, one table per currency.
 */
const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  const { files } = useWorkspaceFiles()
  const { parsedFiles: selectedFiles, allParsedFiles, deselectedDays } = useShownFiles()
  const [period, setPeriod] = useLocalStorage<BreakdownPeriod>(
    MISC.LS_DATA_BREAKDOWN_PERIOD_KEY,
    BreakdownPeriod.MONTH,
    { initializeWithValue: false },
  )
  // Income and expenses are both part of it, so the amount filter doesn't apply
  const emptyReason = getEmptyReason(allParsedFiles, selectedFiles, AmountFilter.ALL)
  const countsByCurrency = useMemo(
    () =>
      mapValues(
        groupBy(allParsedFiles.flatMap(getFileTransactions), (transaction) => transaction.currency),
        (transactions) => getTransactionCounts(transactions, deselectedDays),
      ),
    [allParsedFiles, deselectedDays],
  )
  const profitLosses = useMemo(() => getProfitLoss(selectedFiles, period), [selectedFiles, period])
  const getCaption = (currency: string) => {
    const counts = countsByCurrency[currency]
    return [...(profitLosses.length > 1 ? [currency] : []), ...(counts ? [getTransactionCountText(counts)] : [])].join(
      ` ${MISC.CENTER_DOT} `,
    )
  }

  return (
    <>
      <ViewToolbar>
        <SegmentedToggle
          value={period}
          options={getBreakdownPeriodOptions()}
          onChange={setPeriod}
          disabled={!selectedFiles.length}
          disabledTooltip={t('STATS_PAGE.NO_SELECTION.TITLE')}
        />
      </ViewToolbar>
      <Box sx={sx.scroll}>
        {!files.length ? (
          <DropZoneDisplay
            icon={ReceiptLongOutlined}
            title={t('STATS_PAGE.STATS_VIEW.NO_DATA')}
            subtitleKey="STATS_PAGE.STATS_VIEW.NO_DATA_SELECT"
          />
        ) : !selectedFiles.length ? (
          <NoSelectionDisplay />
        ) : emptyReason ? (
          <NoTransactionsDisplay reason={emptyReason} />
        ) : (
          <Stack divider={<Divider flexItem />}>
            {profitLosses.map((profitLoss) => (
              <Box key={profitLoss.currency} sx={sx.section}>
                <CardTitle caption={getCaption(profitLoss.currency)}>{t('STATS_PAGE.PROFIT_LOSS.TITLE')}</CardTitle>
                <ProfitLossTable profitLoss={profitLoss} period={period} />
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </>
  )
}

export default Component
