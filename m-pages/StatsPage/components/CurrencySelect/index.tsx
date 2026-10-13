'use client'

import { Box } from '@mui/material'

import type { Currency } from '@/types-enums'
import { useTranslation } from '@/lib/i18n'

import type { SelectedCurrency } from '../../useCurrencySelect'
import { ALL_CURRENCIES } from '../../useCurrencySelect'
import RadioItem from '../RadioItem'
import { ui } from './styled'

type CurrencySelectProps = {
  currencies: Currency[]
  value: SelectedCurrency
  onChange: (value: SelectedCurrency) => void
}

/**
 * Shows all currencies or one, like the view options of the toolbar. Fixed below the toolbar when there are several.
 */
const Component = ({ currencies, value, onChange }: CurrencySelectProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const options: { value: SelectedCurrency; label: string }[] = [
    { value: ALL_CURRENCIES, label: t('STATS_PAGE.CURRENCY_SELECT.ALL') },
    ...currencies.map((currency) => ({ value: currency, label: currency })),
  ]

  return (
    <Box role="radiogroup" sx={sx.options}>
      {options.map((option) => (
        <RadioItem
          key={option.value}
          component="button"
          type="button"
          role="radio"
          aria-checked={option.value === value}
          onClick={() => onChange(option.value)}
          label={option.label}
          isActive={option.value === value}
        />
      ))}
    </Box>
  )
}

export default Component
