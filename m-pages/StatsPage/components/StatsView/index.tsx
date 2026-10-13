'use client'

import { InsertChartOutlined } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { useMemo } from 'react'

import { FletchingDivider } from '@/components'
import { useTranslation } from '@/lib/i18n'

import { getAmountFilterOptions, getEmptyReason, getFilteredCurrencies } from '../../actions'
import { useStatsTransactions, useWorkspaceFiles } from '../../context'
import { useCurrencySelect } from '../../useCurrencySelect'
import { useTransactionFilter } from '../../useTransactionFilter'
import DropZoneDisplay from '../DropZoneDisplay'
import NoSelectionDisplay from '../NoSelectionDisplay'
import NoTransactionsDisplay from '../NoTransactionsDisplay'
import SegmentedToggle from '../SegmentedToggle'
import ViewToolbar from '../ViewToolbar'
import { CurrencyStats } from './components'
import { ui } from './styled'

/**
 * Stats view of the workspace: charts and category breakdown of the selected files, per currency.
 */
const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  const { files, selectedFiles } = useWorkspaceFiles()
  const { all, shown, byCurrency } = useStatsTransactions()
  const { filter, amountFilter, setAmountFilter } = useTransactionFilter()
  const emptyReason = useMemo(() => getEmptyReason(all, shown, filter), [all, shown, filter])
  // Only those with transactions left by the filters
  const currencies = useMemo(() => getFilteredCurrencies(shown, filter), [shown, filter])
  const { selected, setSelected, shownCurrencies } = useCurrencySelect(currencies)

  return (
    <>
      <ViewToolbar currency={{ currencies, value: selected, onChange: setSelected }}>
        <SegmentedToggle
          value={amountFilter}
          options={getAmountFilterOptions()}
          onChange={setAmountFilter}
          disabled={!selectedFiles.length}
          disabledTooltip={t('STATS_PAGE.NO_SELECTION.TITLE')}
        />
      </ViewToolbar>
      <Box sx={sx.scroll}>
        {!files.length ? (
          <DropZoneDisplay
            icon={InsertChartOutlined}
            title={t('STATS_PAGE.STATS_VIEW.NO_DATA')}
            subtitleKey="STATS_PAGE.STATS_VIEW.NO_DATA_SELECT"
          />
        ) : !selectedFiles.length ? (
          <NoSelectionDisplay />
        ) : emptyReason ? (
          <NoTransactionsDisplay reason={emptyReason} />
        ) : (
          // One block per currency, as amounts in different currencies can't be summed up
          <Stack divider={<FletchingDivider />}>
            {shownCurrencies.map((currency) => (
              <CurrencyStats
                key={currency}
                currency={currency}
                transactions={byCurrency[currency]!}
                chip={currencies.length > 1 ? currency : undefined}
              />
            ))}
          </Stack>
        )}
      </Box>
    </>
  )
}

export default Component
