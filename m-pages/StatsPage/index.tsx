'use client'

import { Card, Grid, Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { FormProvider, useForm, useWatch } from 'react-hook-form'

import type { StatsPageForm } from '@/types'
import { PageWrapper } from '@/components'
import { useFileHelper, useTransactionHelper, useUserPreferences } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { getBankSelectOptions, getCurrencyForSelection } from './actions'
import {
  BankSelector,
  CategoryBreakdown,
  DemoBanner,
  ProfitLossSummary,
  SummaryChart,
  TransactionChart,
  TransactionInfo,
  TransactionsTable,
} from './components'

const Component = () => {
  const { t } = useTranslation()
  const { locale, dateFormat } = useUserPreferences()
  const { selectedFiles } = useFileHelper()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get('demo') === 'true'
  const bankOptions = getBankSelectOptions(isDemoMode ? [] : selectedFiles)
  const values: StatsPageForm = {
    selectedId: bankOptions.length ? bankOptions[0].value : '',
    groupDataBy: 'day',
    includeEmptyRangeItems: true,
  }
  const methods = useForm<StatsPageForm>({
    defaultValues: values,
    values,
  })
  const selectedId = useWatch({ control: methods.control, name: 'selectedId' })
  const groupDataBy = useWatch({ control: methods.control, name: 'groupDataBy' })
  const { transactions, duplicates, transactionRangeItems } = useTransactionHelper({
    isDemoMode,
    selectedId,
    groupDataBy,
    files: selectedFiles,
    locale,
    dateFormat,
  })
  const currency = getCurrencyForSelection(selectedId, transactions)

  return (
    <FormProvider {...methods}>
      <PageWrapper>
        <Grid container spacing={3}>
          {isDemoMode ? (
            <Grid size={12}>
              <DemoBanner />
            </Grid>
          ) : null}

          {bankOptions.length ? (
            <Grid size={{ xs: 12, sm: 2 }}>
              <BankSelector options={bankOptions} />
            </Grid>
          ) : null}

          {!isDemoMode ? (
            <Grid size="grow">
              <TransactionInfo total={transactions.length + duplicates.length} duplicates={duplicates.length} />
            </Grid>
          ) : null}

          {/* <Grid size={2}>Date range</Grid> */}
          {/* <Grid size={2}>Display currency</Grid> */}
          {/* <Grid size={2}>Compress x-axis</Grid> */}
          {/* <Grid size={2}>Combine datasets</Grid> */}

          <Grid size={12}>
            <Card>
              <Typography variant="h6" color="secondary">
                {t('STATS_PAGE.AT_A_GLANCE')}
              </Typography>
              <SummaryChart transactionRangeItems={transactionRangeItems} />
              <ProfitLossSummary transactions={transactions} currency={currency} />
            </Card>
          </Grid>

          <Grid size={12}>
            <CategoryBreakdown transactions={transactions} currency={currency} />
          </Grid>

          <Grid size={12}>
            <TransactionChart transactions={transactions} currency={currency} />
          </Grid>

          <Grid size={12}>
            <TransactionsTable transactions={transactions} currency={currency} />
          </Grid>
        </Grid>
      </PageWrapper>
    </FormProvider>
  )
}

export default Component
