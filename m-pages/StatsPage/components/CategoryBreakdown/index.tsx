import { Box, FormControlLabel, Switch } from '@mui/material'
import { useState } from 'react'

import type { Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/common'
import { getStats } from '@/utils/Stats'
import { useTranslation } from '@/lib/i18n'

import CardTitle from '../CardTitle'
import { getTransactionsGroupedByCategory } from './actions'
import { BreakdownTable } from './components'

type CategoryBreakdownProps = {
  transactions: Transaction[]
  currency: Currency
}

const Component = ({ transactions, currency }: CategoryBreakdownProps) => {
  const { t } = useTranslation()
  const { totalIncome, totalExpense } = getStats(transactions)
  const groupedTransactions = getTransactionsGroupedByCategory(transactions)
  const income = groupedTransactions.filter((cat) => Object.keys(INCOME_CATEGORIES).includes(cat.code))
  const expenses = groupedTransactions.filter((cat) => Object.keys(EXPENSE_CATEGORIES).includes(cat.code))
  const [showAll, setShowAll] = useState(false)

  return (
    <Box>
      <CardTitle
        action={
          <FormControlLabel
            control={<Switch size="small" checked={showAll} onChange={(event) => setShowAll(event.target.checked)} />}
            label={t('STATS_PAGE.STATS_VIEW.SHOW_ALL_CATEGORIES')}
            slotProps={{ typography: { variant: 'caption', color: 'text.secondary' } }}
            sx={{ mr: 0 }}
          />
        }
      >
        {t('STATS_PAGE.STATS_VIEW.BREAKDOWN_BY_CATEGORY')}
      </CardTitle>

      <Box sx={{ mb: 3 }}>
        <BreakdownTable
          title={t('MISC.INCOME')}
          emptyText={t('STATS_PAGE.STATS_VIEW.NO_INCOME')}
          transactionsGrouped={income}
          total={totalIncome}
          currency={currency}
          showAll={showAll}
        />
      </Box>

      <BreakdownTable
        title={t('MISC.EXPENSES')}
        emptyText={t('STATS_PAGE.STATS_VIEW.NO_EXPENSES')}
        transactionsGrouped={expenses}
        total={totalExpense}
        currency={currency}
        showAll={showAll}
      />
    </Box>
  )
}

export default Component
