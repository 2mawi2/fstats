'use client'

import { GitHub } from '@mui/icons-material'
import {
  Box,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

import type { CustomFormat, StatsFile } from '@/types'
import type { Currency } from '@/types-enums'
import { useMutateSaveCustomFormat } from '@/m-custom-format/service'
import { useFileRows } from '@/m-stats-file/service'
import { getErrorMessage } from '@/utils/FileParser'
import { detectDateFormat, detectHeaderRow, detectNumberFormat, getFormatSuggestions } from '@/utils/Parser'
import { useTranslation } from '@/lib/i18n'

import { getFileNameColor } from '../../actions'
import StatsRow from '../StatsRow'
import type { Draft } from './actions'
import {
  buildCustomFormat,
  cleanHeader,
  CURRENCY_OPTIONS,
  Field,
  fromSuggestion,
  getColumnValues,
  getDateFormatOptions,
  getFieldOptions,
  getInitialDraft,
  getSubmitUrl,
  NUMBER_FORMAT_OPTIONS,
  setField,
  toDraft,
} from './actions'
import { ui } from './styled'

type FormatWizardProps = {
  /**
   * An unsupported file, or a file parsed with `format`.
   */
  file: StatsFile
  /**
   * The saved format of the file, shown read-only.
   */
  format: CustomFormat | null
  defaultExpanded?: boolean
}

/**
 * Maps the columns of an unsupported file to transaction fields and saves them as a custom format.
 */
const Component = ({ file, format, defaultExpanded = false }: FormatWizardProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const { data: fileRows } = useFileRows(file)
  const { mutate: saveFormat, isPending: isSaving } = useMutateSaveCustomFormat()
  const [draftState, setDraft] = useState<Draft>(getInitialDraft)
  const [suggestionIndex, setSuggestionIndex] = useState(-1)
  const [error, setError] = useState('')
  const isSaved = !!format
  const draft = format ? toDraft(format) : draftState

  // Rows from the header row on, saved formats are shown without the file rows
  const section = useMemo(() => {
    const rows = format ? [] : (fileRows?.[0]?.rows ?? [])
    return rows.slice(detectHeaderRow(rows))
  }, [format, fileRows])
  const headers = useMemo(() => (format ? format.headers : (section[0] ?? []).map(cleanHeader)), [format, section])
  const sampleRow = format ? null : section[1]
  const suggestions = useMemo(() => (format ? [] : getFormatSuggestions(headers)), [format, headers])

  const updateDraft = (updates: Partial<Draft>) => {
    setDraft((prev) => ({ ...prev, ...updates }))
    setError('')
  }

  const onFieldChange = (index: number, field: Field) => {
    const values = getColumnValues(section, index)
    updateDraft({
      mapping: setField(draft.mapping, index, field),
      ...(field === Field.DATE ? { dateFormat: detectDateFormat(values) ?? draft.dateFormat } : {}),
      ...(field === Field.AMOUNT || field === Field.IN || field === Field.OUT
        ? { numberFormat: detectNumberFormat(values) }
        : {}),
    })
  }

  const onSuggestionChange = (index: number) => {
    setSuggestionIndex(index)
    updateDraft(index === -1 ? getInitialDraft() : fromSuggestion(headers, suggestions[index]))
  }

  const onSave = () => {
    const result = buildCustomFormat(section, draft)

    if (result.error !== null) {
      setError(result.error)
      return
    }

    saveFormat(result.format, { onError: (err) => setError(getErrorMessage(err)) })
  }

  return (
    <StatsRow
      title={file.file.name}
      titleColor={getFileNameColor(file)}
      chip={isSaved ? t('DATA_PAGE.FORMAT_WIZARD.SAVED') : undefined}
      stats={null}
      defaultExpanded={defaultExpanded}
    >
      <Box sx={sx.wizard}>
        {suggestions.length ? (
          <TextField
            select
            size="small"
            label={t('DATA_PAGE.FORMAT_WIZARD.START_FROM')}
            value={suggestionIndex}
            onChange={(event) => onSuggestionChange(Number(event.target.value))}
            helperText={t('DATA_PAGE.FORMAT_WIZARD.START_FROM_HINT')}
          >
            <MenuItem value={-1}>{t('DATA_PAGE.FORMAT_WIZARD.START_FROM_NONE')}</MenuItem>
            {suggestions.map(({ bank, format: suggestedFormat, score }, index) => (
              <MenuItem key={`${bank.id}-${suggestedFormat.version}-${suggestedFormat.accountType}`} value={index}>
                {bank.name} {suggestedFormat.accountName} ({Math.round(score * 100)}%)
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        <Box sx={sx.settings}>
          <TextField
            select
            size="small"
            label={t('DATA_PAGE.FORMAT_WIZARD.DATE_FORMAT')}
            value={draft.dateFormat}
            onChange={(event) => updateDraft({ dateFormat: event.target.value })}
            disabled={isSaved}
          >
            {getDateFormatOptions(draft.dateFormat).map((dateFormat) => (
              <MenuItem key={dateFormat} value={dateFormat}>
                {dateFormat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('DATA_PAGE.FORMAT_WIZARD.NUMBER_FORMAT')}
            value={draft.numberFormat}
            onChange={(event) => updateDraft({ numberFormat: event.target.value as Draft['numberFormat'] })}
            disabled={isSaved}
          >
            {NUMBER_FORMAT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label={t('DATA_PAGE.FORMAT_WIZARD.CURRENCY')}
            value={draft.currency}
            onChange={(event) => updateDraft({ currency: event.target.value as Currency })}
            disabled={isSaved}
          >
            {CURRENCY_OPTIONS.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Table size="small" sx={sx.table}>
          <TableHead>
            <TableRow>
              <TableCell>{t('DATA_PAGE.FORMAT_WIZARD.COLUMN')}</TableCell>
              <TableCell>{t('DATA_PAGE.FORMAT_WIZARD.MAPS_TO')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {headers.map((header, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow key={index}>
                <TableCell sx={sx.headerCell}>
                  <Box sx={sx.ellipsis} title={header}>
                    {header || '-'}
                  </Box>
                  {sampleRow?.[index] ? (
                    <Box sx={{ ...sx.ellipsis, ...sx.sample }} title={sampleRow[index]}>
                      {sampleRow[index]}
                    </Box>
                  ) : null}
                </TableCell>
                <TableCell sx={sx.fieldCell}>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    value={draft.mapping[index] ?? Field.IGNORE}
                    onChange={(event) => onFieldChange(index, event.target.value as Field)}
                    disabled={isSaved || !header}
                    sx={sx.fieldSelect}
                  >
                    {getFieldOptions().map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={sx.saveRow}>
          <TextField
            size="small"
            fullWidth
            label={t('DATA_PAGE.FORMAT_WIZARD.BANK_NAME')}
            value={draft.bankName}
            onChange={(event) => updateDraft({ bankName: event.target.value })}
            onKeyDown={(event) => (event.key === 'Enter' ? onSave() : null)}
            disabled={isSaved}
          />
          <Button variant="contained" onClick={onSave} loading={isSaving} disabled={isSaved}>
            {t('DATA_PAGE.FORMAT_WIZARD.SAVE')}
          </Button>
        </Box>

        {error ? (
          <Typography variant="caption" component="p" color="error">
            {error}
          </Typography>
        ) : null}

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GitHub />}
          disabled={!format}
          onClick={() => (format ? window.open(getSubmitUrl(format), '_blank', 'noopener,noreferrer') : null)}
        >
          {t('DATA_PAGE.FORMAT_WIZARD.SUBMIT')}
        </Button>
        <Typography variant="caption" component="p" color="text.secondary">
          {t('DATA_PAGE.FORMAT_WIZARD.SUBMIT_HINT')}
        </Typography>
      </Box>
    </StatsRow>
  )
}

export default Component
