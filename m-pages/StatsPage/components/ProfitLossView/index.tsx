'use client'

import { ReceiptLongOutlined } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { groupBy, mapValues } from 'lodash'
import { useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { FletchingDivider } from '@/components'
import { getFileTransactions } from '@/m-stats-file/service'
import { useTranslation } from '@/lib/i18n'

import {
  filterFiles,
  filterTransactions,
  getEmptyReason,
  getTransactionCounts,
  getTransactionCountText,
} from '../../actions'
import { useShownFiles, useWorkspaceFiles } from '../../context'
import { useCurrencySelect } from '../../useCurrencySelect'
import { useTransactionFilter } from '../../useTransactionFilter'
import DropZoneDisplay from '../DropZoneDisplay'
import NoSelectionDisplay from '../NoSelectionDisplay'
import NoTransactionsDisplay from '../NoTransactionsDisplay'
import PreviewSection from '../PreviewSection'
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
  const { categoryFilter: filter } = useTransactionFilter()
  const emptyReason = getEmptyReason(allParsedFiles, selectedFiles, filter)
  const countsByCurrency = useMemo(
    () =>
      mapValues(
        groupBy(
          filterTransactions(allParsedFiles.flatMap(getFileTransactions), filter),
          (transaction) => transaction.currency,
        ),
        (transactions) => getTransactionCounts(transactions, deselectedDays),
      ),
    [allParsedFiles, filter, deselectedDays],
  )
  const profitLosses = useMemo(
    () => getProfitLoss(filterFiles(selectedFiles, filter), period, t),
    [selectedFiles, filter, period, t],
  )
  const currencies = profitLosses.map((profitLoss) => profitLoss.currency)
  const { selected, setSelected, shownCurrencies } = useCurrencySelect(currencies)

  return (
    <>
      <ViewToolbar currency={{ currencies, value: selected, onChange: setSelected }}>
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
          // Sections like the transactions view, so the headings line up when switching. Padded per currency, so the
          // dividers between them go edge to edge.
          <Stack divider={<FletchingDivider />}>
            {profitLosses
              .filter((profitLoss) => shownCurrencies.includes(profitLoss.currency))
              .map((profitLoss) => (
                <Box key={profitLoss.currency} sx={sx.section}>
                  <PreviewSection
                    title={t('STATS_PAGE.PROFIT_LOSS.TITLE')}
                    chip={currencies.length > 1 ? profitLoss.currency : undefined}
                    caption={
                      countsByCurrency[profitLoss.currency]
                        ? getTransactionCountText(countsByCurrency[profitLoss.currency])
                        : undefined
                    }
                  >
                    <ProfitLossTable profitLoss={profitLoss} period={period} />
                  </PreviewSection>
                </Box>
              ))}
          </Stack>
        )}
      </Box>
    </>
  )
}

export default Component
