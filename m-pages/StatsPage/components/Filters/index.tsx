'use client'

import { ChevronRight, TuneOutlined } from '@mui/icons-material'
import { Badge, Box, IconButton, Popover, Radio, Switch, Tooltip } from '@mui/material'
import { countBy, sumBy } from 'lodash'
import { useSearchParams } from 'next/navigation'
import type { KeyboardEvent, ReactNode } from 'react'
import { useMemo, useState } from 'react'

import type { Currency } from '@/types-enums'
import { useTranslation } from '@/lib/i18n'

import { AmountFilter } from '../../actions'
import { useShownFiles } from '../../context'
import { getView, WorkspaceView } from '../../params'
import type { SelectedCurrency } from '../../useCurrencySelect'
import { ALL_CURRENCIES } from '../../useCurrencySelect'
import { useTransactionFilter } from '../../useTransactionFilter'
import OutlineCheckbox from '../OutlineCheckbox'
import { getCategoryFilterTransactions, getCategoryGroups, getCheckState, toggleCategories } from './actions'
import { ui } from './styled'

export type FilterOption = {
  key: string
  label: string
  /**
   * Transactions the option applies to, disabled without any.
   */
  count: number
  checked: boolean
  onChange: (checked: boolean) => void
}

export type CurrencyFilter = {
  /**
   * Shown currencies, one can be selected when there are several.
   */
  currencies: Currency[]
  value: SelectedCurrency
  onChange: (value: SelectedCurrency) => void
  /**
   * Shows all currencies without allowing a selection, e.g. in the split transactions layout.
   */
  disabled?: boolean
}

type FiltersProps = {
  /**
   * Switches of the transactions table.
   */
  options: FilterOption[]
  currency?: CurrencyFilter
}

// Rows are buttons, like the rows of the date explorer
const onRowKeyDown = (event: KeyboardEvent<HTMLElement>) => {
  if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    event.currentTarget.click()
  }
}

/**
 * Filters button on the right of the toolbar, with a panel of the currencies, switches for the transactions table and
 * the money in and out categories (of the shown files) as trees, styled like the date explorer. Marked while a filter is on. Disabled in
 * the CSV view and without checked files.
 */
const Component = ({ options, currency }: FiltersProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const view = getView(useSearchParams())
  const { checkedFiles, parsedFiles } = useShownFiles()
  const { amountFilter, excludedCategories: excluded, setExcludedCategories } = useTransactionFilter()
  // The breakdown shows income and expenses, so the amount filter doesn't apply
  const amount = view === WorkspaceView.BREAKDOWN ? AmountFilter.ALL : amountFilter
  const transactions = useMemo(() => getCategoryFilterTransactions(parsedFiles, amount), [parsedFiles, amount])
  const groups = useMemo(() => getCategoryGroups(transactions), [transactions])
  const currencyCounts = useMemo(() => countBy(transactions, (transaction) => transaction.currency), [transactions])
  const disabled = !checkedFiles.length || view === WorkspaceView.CSV
  const currencies = currency?.currencies ?? []
  const hasCurrencyChoice = currencies.length > 1
  // With one currency, it's shown but can't be changed
  const canSelectCurrency = hasCurrencyChoice && !currency?.disabled
  const selectedCurrency = canSelectCurrency ? currency?.value : ALL_CURRENCIES
  const currencyOptions: { value: SelectedCurrency; label: string; count: number }[] = hasCurrencyChoice
    ? [
        {
          value: ALL_CURRENCIES,
          label: t('STATS_PAGE.FILTERS.ALL_CURRENCIES'),
          count: sumBy(currencies, (value) => currencyCounts[value] ?? 0),
        },
        // Only "All" when disabled
        ...(canSelectCurrency
          ? currencies.map((value) => ({ value, label: value, count: currencyCounts[value] ?? 0 }))
          : []),
      ]
    : currencies.map((value) => ({ value, label: value, count: currencyCounts[value] ?? 0 }))
  const hasOptions = options.length > 0 || currencyOptions.length > 0
  const allKeys = groups.flatMap((group) => group.parents.flatMap((parent) => parent.keys))
  const isActive =
    selectedCurrency !== ALL_CURRENCIES ||
    options.some((option) => option.checked && option.count) ||
    !getCheckState(excluded, allKeys).checked

  const onToggle = (keys: string[]) => setExcludedCategories(toggleCategories(excluded, keys))

  const toggleExpanded = (key: string) => {
    const next = new Set(expanded)
    if (!next.delete(key)) {
      next.add(key)
    }
    setExpanded(next)
  }

  const renderCategoryRow = ({
    key,
    label,
    count,
    keys,
    start,
    isParent = false,
    onClick,
    rowSx,
    labelSx,
  }: {
    key: string
    label: ReactNode
    count: number
    keys: string[]
    start?: ReactNode
    isParent?: boolean
    onClick?: () => void
    rowSx?: object
    labelSx?: object
  }) => {
    // Without transactions, parents can still be expanded
    const isDisabled = !count
    const state = isDisabled ? { checked: false, indeterminate: false } : getCheckState(excluded, keys)
    const isDeselected = !state.checked && !state.indeterminate
    const onRowClick = onClick ?? (isDisabled ? undefined : () => onToggle(keys))

    return (
      <Box
        key={key}
        onClick={onRowClick}
        role="button"
        tabIndex={onRowClick ? 0 : -1}
        aria-disabled={isDisabled}
        onKeyDown={onRowKeyDown}
        sx={{ ...sx.row, ...rowSx, ...(onRowClick ? null : sx.disabledRow) }}
      >
        {start}
        <OutlineCheckbox
          {...state}
          disabled={isDisabled}
          onClick={(event) => event.stopPropagation()}
          onChange={() => onToggle(keys)}
        />
        <Box
          component="span"
          sx={{
            ...sx.label,
            color: isDeselected ? 'text.disabled' : 'text.primary',
            // Deselected parents aren't emphasized, like deselected months
            fontWeight: isParent && !isDeselected ? 600 : 400,
            ...labelSx,
          }}
        >
          {label}
        </Box>
        <Box component="span" sx={isDisabled ? { ...sx.count, ...sx.emptyCount } : sx.count}>
          {count}
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Tooltip
        title={
          !checkedFiles.length
            ? t('STATS_PAGE.NO_SELECTION.TITLE')
            : disabled
              ? t('STATS_PAGE.CSV_DISABLED')
              : t('STATS_PAGE.FILTERS.TITLE')
        }
      >
        {/* Disabled buttons don't fire hover events */}
        <Box component="span" sx={sx.button}>
          <IconButton
            size="small"
            disabled={disabled}
            onClick={(event) => setAnchor(event.currentTarget)}
            aria-label={t('STATS_PAGE.FILTERS.TITLE')}
            aria-haspopup="dialog"
            aria-expanded={anchor ? true : undefined}
          >
            <Badge variant="dot" color="primary" invisible={disabled || !isActive}>
              <TuneOutlined sx={sx.icon} />
            </Badge>
          </IconButton>
        </Box>
      </Tooltip>
      <Popover
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: sx.paper(hasOptions) } }}
      >
        <Box sx={sx.columns(hasOptions)}>
          {hasOptions ? (
            <Box sx={sx.column}>
              {currencyOptions.length ? (
                <Box role="radiogroup" aria-label={t('STATS_PAGE.FILTERS.CURRENCY')} sx={sx.section}>
                  <Box sx={sx.header}>{t('STATS_PAGE.FILTERS.CURRENCY')}</Box>
                  {currencyOptions.map((option) => {
                    const isChecked = !hasCurrencyChoice || option.value === selectedCurrency

                    return (
                      <Box
                        key={option.value}
                        onClick={canSelectCurrency ? () => currency?.onChange(option.value) : undefined}
                        role="radio"
                        aria-checked={isChecked}
                        aria-disabled={!canSelectCurrency}
                        tabIndex={canSelectCurrency ? 0 : -1}
                        onKeyDown={onRowKeyDown}
                        sx={{ ...sx.row, ...sx.optionRow, ...(canSelectCurrency ? null : sx.disabledRow) }}
                      >
                        <Radio
                          size="small"
                          checked={isChecked}
                          disabled={!canSelectCurrency}
                          tabIndex={-1}
                          sx={sx.radio}
                        />
                        <Box component="span" sx={sx.label}>
                          {option.label}
                        </Box>
                        <Box component="span" sx={sx.count}>
                          {option.count}
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              ) : null}
              {options.length ? <Box sx={sx.header}>{t('STATS_PAGE.FILTERS.SHOW')}</Box> : null}
              {options.map((option) => (
                <Box
                  key={option.key}
                  onClick={option.count ? () => option.onChange(!option.checked) : undefined}
                  role="switch"
                  aria-checked={option.checked}
                  aria-disabled={!option.count}
                  tabIndex={option.count ? 0 : -1}
                  onKeyDown={onRowKeyDown}
                  sx={{ ...sx.row, ...sx.optionRow, ...(option.count ? null : sx.disabledRow) }}
                >
                  <Switch
                    size="small"
                    checked={option.checked && !!option.count}
                    disabled={!option.count}
                    tabIndex={-1}
                    sx={sx.switch}
                  />
                  <Box component="span" sx={sx.label}>
                    {option.label}
                  </Box>
                  <Box component="span" sx={sx.count}>
                    {option.count}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : null}
          {groups.map((group) => (
            <Box key={group.key} sx={sx.column}>
              {renderCategoryRow({
                key: group.key,
                label: group.label,
                count: sumBy(group.parents, 'count'),
                keys: group.parents.flatMap((parent) => parent.keys),
                rowSx: sx.groupRow,
                labelSx: sx.groupLabel,
              })}
              <Box sx={sx.scroll}>
                {group.parents.flatMap((parent) => {
                  const isExpanded = expanded.has(parent.key)
                  const hasChildren = parent.children.length > 0

                  return [
                    renderCategoryRow({
                      key: parent.key,
                      label: parent.label,
                      count: parent.count,
                      keys: parent.keys,
                      isParent: hasChildren,
                      // Parents expand like the months of the date explorer, their checkbox toggles them
                      onClick: hasChildren ? () => toggleExpanded(parent.key) : undefined,
                      start: hasChildren ? (
                        <Box component="span" sx={sx.expandIcon}>
                          <ChevronRight style={{ transform: isExpanded ? 'rotate(90deg)' : undefined }} />
                        </Box>
                      ) : (
                        <Box sx={sx.expandSpacer} />
                      ),
                      rowSx: sx.parentRow,
                    }),
                    ...(isExpanded
                      ? parent.children.map((child) =>
                          renderCategoryRow({
                            key: child.key,
                            label: child.label,
                            count: child.count,
                            keys: [child.key],
                            start: <Box sx={sx.expandSpacer} />,
                            rowSx: sx.childRow,
                          }),
                        )
                      : []),
                  ]
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  )
}

export default Component
