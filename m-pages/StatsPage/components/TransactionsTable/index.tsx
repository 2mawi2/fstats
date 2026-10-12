'use client'

import { Search } from '@mui/icons-material'
import {
  Box,
  Card,
  Chip,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { green } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import { useMemo, useState } from 'react'

import type { Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { useIsMobile, useUserPreferences } from '@/hooks'
import { getCurrencySymbol } from '@/utils/Currency'
import { toDisplayDate } from '@/utils/Date'
import { toFixedLocaleAmount } from '@/utils/Number'
import { isIncome } from '@/utils/Stats'
import { getCategoryColor, getSubcategoryLabel } from '@/utils/TransactionParser'
import { useTranslation } from '@/lib/i18n'

import CardTitle from '../CardTitle'
import { ui } from './styled'

type TransactionsTableProps = {
  transactions: Transaction[]
  currency: Currency
}

const Component = ({ transactions, currency }: TransactionsTableProps) => {
  const { t } = useTranslation()
  const { locale, dateFormat } = useUserPreferences()
  const theme = useTheme()
  const isMobile = useIsMobile()
  const sx = ui(theme, isMobile)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) {
      return text
    }

    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={`${part}-${index}`} component="span" sx={sx.highlight}>
              {part}
            </Box>
          ) : (
            // eslint-disable-next-line react/no-array-index-key
            <span key={`${part}-${index}`}>{part}</span>
          ),
        )}
      </>
    )
  }

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) {
      return transactions
    }

    const query = searchQuery.toLowerCase()
    return transactions.filter(
      (row) =>
        row.description.toLowerCase().includes(query) ||
        getSubcategoryLabel(row.category).toLowerCase().includes(query) ||
        row.date.includes(searchQuery),
    )
  }, [searchQuery, transactions])

  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <CardTitle sx={{ mb: 3 }}>{t('MISC.TRANSACTIONS')}</CardTitle>

      <Box sx={sx.searchContainer}>
        <TextField
          fullWidth
          placeholder={t('STATS_PAGE.SEARCH_TRANSACTIONS')}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setPage(0)
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
          sx={sx.searchField}
          autoComplete="off"
        />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: isMobile ? 200 : 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={sx.tableHeader}>{t('MISC.DATE')}</TableCell>
              <TableCell sx={sx.tableHeader}>{t('MISC.DESCRIPTION')}</TableCell>
              {!isMobile && <TableCell sx={sx.tableHeader}>{t('MISC.CATEGORY')}</TableCell>}
              <TableCell sx={sx.tableHeader} align="right">
                {t('MISC.AMOUNT_WITH_CURRENCY', { currency: getCurrencySymbol(currency) })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!filteredTransactions.length ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 3 : 4} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
                    {t('STATS_PAGE.NO_TRANSACTIONS_FOUND')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id} hover sx={sx.tableRow}>
                  <TableCell sx={sx.compactCell}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', mb: 0, whiteSpace: 'nowrap' }}
                    >
                      {highlightText(toDisplayDate(row.date, locale, { formatTo: dateFormat }), searchQuery)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={sx.compactCell}>
                    <Box sx={sx.descriptionCell}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          mb: 0,
                          maxWidth: isMobile ? 150 : 'none',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: isMobile ? 'nowrap' : 'normal',
                        }}
                      >
                        {highlightText(row.description, searchQuery)}
                      </Typography>
                    </Box>
                    {isMobile && row.category ? (
                      <Chip
                        label={getSubcategoryLabel(row.category)}
                        size="small"
                        sx={{ ...sx.categoryChip(getCategoryColor(row.category)), mt: 0.5 }}
                      />
                    ) : null}
                  </TableCell>
                  {!isMobile ? (
                    <TableCell sx={sx.compactCell}>
                      {row.category ? (
                        <Chip
                          label={highlightText(getSubcategoryLabel(row.category), searchQuery)}
                          size="small"
                          sx={sx.categoryChip(getCategoryColor(row.category))}
                        />
                      ) : null}
                    </TableCell>
                  ) : null}
                  <TableCell align="right" sx={sx.compactCell}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0,
                        color: isIncome(row) ? green[600] : 'text.primary',
                        fontWeight: isIncome(row) ? 600 : 400,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {toFixedLocaleAmount(row.value, row.currency, locale, { showPlusSign: true })}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('STATS_PAGE.ROWS_PER_PAGE')}
        labelDisplayedRows={({ from, to, count }) => t('STATS_PAGE.DISPLAYED_ROWS', { from, to, total: count })}
      />
    </Card>
  )
}

export default Component
