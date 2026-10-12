'use client'

import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, Divider, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

import type { NumberString, ParentCategoryWithTransactions, SortingPref } from '@/types'
import { Currency } from '@/types-enums'
import { getCurrencySymbol } from '@/utils/Currency'
import { useTranslation } from '@/lib/i18n'

import { COL_SPACING, COL1, COL2, COL3, getSortedParentCategoriesWithTransactions } from '../../actions'
import { ui } from '../../styled'
import BreakdownRow from '../BreakdownRow'

type ExpensesBreakdownProps = {
  transactionsGrouped: ParentCategoryWithTransactions[]
  total: NumberString
  currency: Currency
  showAll?: boolean
}

const Component = ({ transactionsGrouped, total, currency, showAll = false }: ExpensesBreakdownProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const sx = ui(theme)
  const [sortingPref, setSortingPref] = useState<SortingPref>('totalDesc')
  const sortedCategories = getSortedParentCategoriesWithTransactions(
    transactionsGrouped,
    transactionsGrouped.map((category) => category.code),
    sortingPref,
  )
  const categoriesWithTransactions = sortedCategories.filter((category) => category.transactions.length)
  const categoriesToShow = showAll ? sortedCategories : categoriesWithTransactions

  return (
    <>
      <Grid container spacing={COL_SPACING} sx={{ mb: 0 }}>
        <Grid size={{ xs: COL1[0], sm: COL1[1] }}>
          <Box sx={sx.tableHeader} onClick={() => setSortingPref(sortingPref === 'asc' ? 'desc' : 'asc')}>
            <Box sx={sx.tableHeaderContent}>
              {t('MISC.INCOME')}
              {sortingPref === 'asc' ? <ArrowUpward sx={{ fontSize: 13 }} /> : null}
              {sortingPref === 'desc' ? <ArrowDownward sx={{ fontSize: 13 }} /> : null}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: COL2[0], sm: COL2[1] }}>
          <Box
            sx={{ ...sx.tableHeader, justifyContent: 'flex-end' }}
            onClick={() => setSortingPref(sortingPref === 'totalDesc' ? 'totalAsc' : 'totalDesc')}
          >
            <Box sx={sx.tableHeaderContent}>
              {t('MISC.TOTAL_WITH_CURRENCY', { currency: getCurrencySymbol(currency) })}
              {sortingPref === 'totalAsc' ? <ArrowUpward sx={{ fontSize: 13 }} /> : null}
              {sortingPref === 'totalDesc' ? <ArrowDownward sx={{ fontSize: 13 }} /> : null}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: COL3[0], sm: COL3[1] }}>
          <Box sx={{ ...sx.tableHeader, justifyContent: 'flex-end', cursor: 'default' }}>%</Box>
        </Grid>
      </Grid>

      <Divider sx={{ mt: 0.5, mb: 1.5 }} />

      {categoriesToShow.length ? (
        categoriesToShow.map((category) => {
          return (
            <BreakdownRow key={category.code} category={category} parentCategoryTotal={total} currency={currency} />
          )
        })
      ) : (
        <Typography variant="body2" noWrap sx={{ fontSize: 15, mb: 0, color: 'text.secondary', ml: 1 }}>
          {t('STATS_PAGE.NO_INCOME')}
        </Typography>
      )}
    </>
  )
}

export default Component
