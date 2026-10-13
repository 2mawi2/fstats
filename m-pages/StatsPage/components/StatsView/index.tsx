'use client'

import { InsertChartOutlined } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'

import { FletchingDivider } from '@/components'
import { useTranslation } from '@/lib/i18n'

import { getAmountFilterOptions, getEmptyReason, getFilteredCurrencies, groupFilesByCurrency } from '../../actions'
import { useShownFiles, useWorkspaceFiles } from '../../context'
import { useCurrencySelect } from '../../useCurrencySelect'
import { useTransactionFilter } from '../../useTransactionFilter'
import CurrencySelect from '../CurrencySelect'
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
  const { files } = useWorkspaceFiles()
  const { parsedFiles: selectedFiles, allParsedFiles } = useShownFiles()
  const { filter, amountFilter, setAmountFilter } = useTransactionFilter()
  const emptyReason = getEmptyReason(allParsedFiles, selectedFiles, filter)
  const filesByCurrency = groupFilesByCurrency(selectedFiles)
  const allFilesByCurrency = groupFilesByCurrency(allParsedFiles)
  // Only those with transactions left by the filters
  const currencies = getFilteredCurrencies(filesByCurrency, filter)
  const { selected, setSelected, shownCurrencies } = useCurrencySelect(currencies)

  return (
    <>
      <ViewToolbar>
        <SegmentedToggle
          value={amountFilter}
          options={getAmountFilterOptions()}
          onChange={setAmountFilter}
          disabled={!selectedFiles.length}
          disabledTooltip={t('STATS_PAGE.NO_SELECTION.TITLE')}
        />
      </ViewToolbar>
      {/* Below the toolbar, outside the scroll container like it */}
      {currencies.length > 1 && selectedFiles.length && !emptyReason ? (
        <CurrencySelect currencies={currencies} value={selected} onChange={setSelected} />
      ) : null}
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
          <>
            <Stack divider={<FletchingDivider />}>
              {shownCurrencies.map((currency) => (
                <CurrencyStats
                  key={currency}
                  currency={currency}
                  files={filesByCurrency[currency]}
                  allFiles={allFilesByCurrency[currency]}
                  chip={currencies.length > 1 ? currency : undefined}
                />
              ))}
            </Stack>
          </>
        )}
      </Box>
    </>
  )
}

export default Component
