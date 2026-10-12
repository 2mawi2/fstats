import { Box, Card, FormControlLabel, Switch, Typography } from '@mui/material'
import { useState } from 'react'

import type { Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/common'
import { getStats } from '@/utils/Stats'
import { useTranslation } from '@/lib/i18n'

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
    <Card sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" color="secondary">
          {t('STATS_PAGE.BREAKDOWN_BY_CATEGORY')}
        </Typography>

        <FormControlLabel
          control={<Switch color="primary" value={showAll} onChange={() => setShowAll(!showAll)} />}
          label={t('STATS_PAGE.SHOW_ALL_CATEGORIES')}
          sx={{ color: showAll ? 'text.primary' : 'text.secondary' }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <BreakdownTable
          title={t('MISC.INCOME')}
          emptyText={t('STATS_PAGE.NO_INCOME')}
          transactionsGrouped={income}
          total={totalIncome}
          currency={currency}
          showAll={showAll}
        />
      </Box>

      <BreakdownTable
        title={t('MISC.EXPENSES')}
        emptyText={t('STATS_PAGE.NO_EXPENSES')}
        transactionsGrouped={expenses}
        total={totalExpense}
        currency={currency}
        showAll={showAll}
      />
    </Card>
  )
}

export default Component
