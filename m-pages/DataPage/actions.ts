import { uniq } from 'lodash'

import type { StatsFile } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { MISC } from '@/common'
import { isParsed, isUnknown } from '@/m-stats-file/service'
import { AVAILABLE_PARSERS, getBankAccountName } from '@/utils/Parser'
import { i18n } from '@/lib/i18n'

/**
 * What a file was parsed as, or why it wasn't.
 */
export const getFileFormat = (file: StatsFile) => {
  if (isParsed(file)) {
    const parserIds = uniq(file.sections.map((section) => section.parserId))

    if (parserIds.length === 1) {
      return { value: getBankAccountName(parserIds[0]).long, color: 'text.primary' }
    }

    // Sections are all from the same bank, e.g. "Comdirect · Giro + Visa"
    const parsers = parserIds.map((parserId) => AVAILABLE_PARSERS[parserId])
    const accountNames = parsers.map((parser) => parser.accountName).join(' + ')
    return { value: `${parsers[0].bankName} ${MISC.CENTER_DOT} ${accountNames}`, color: 'text.primary' }
  }

  if (file.status === StatsFileStatus.PARSING) {
    return { value: i18n.t('DATA_PAGE.PARSING'), color: 'text.secondary' }
  }

  if (isUnknown(file)) {
    return { value: i18n.t('DATA_PAGE.UNSUPPORTED_FORMAT'), color: 'warning.main' }
  }

  return { value: file.status === StatsFileStatus.ERROR ? file.error.message : '-', color: 'error.main' }
}

export const TableView = {
  RAW: 'raw',
  TRANSACTIONS: 'transactions',
} as const

export type TableView = (typeof TableView)[keyof typeof TableView]

export const getTableViewOptions = () => [
  { value: TableView.RAW, label: i18n.t('DATA_PAGE.TABLE_VIEW.RAW') },
  { value: TableView.TRANSACTIONS, label: i18n.t('DATA_PAGE.TABLE_VIEW.TRANSACTIONS') },
]

export const AmountFilter = {
  ALL: 'all',
  IN: 'in',
  OUT: 'out',
} as const

export type AmountFilter = (typeof AmountFilter)[keyof typeof AmountFilter]

export const getAmountFilterOptions = () => [
  {
    value: AmountFilter.ALL,
    label: i18n.t('DATA_PAGE.AMOUNT_FILTER.ALL'),
    title: i18n.t('DATA_PAGE.AMOUNT_FILTER.ALL_TITLE'),
  },
  {
    value: AmountFilter.IN,
    label: i18n.t('DATA_PAGE.AMOUNT_FILTER.IN'),
    title: i18n.t('DATA_PAGE.AMOUNT_FILTER.IN_TITLE'),
  },
  {
    value: AmountFilter.OUT,
    label: i18n.t('DATA_PAGE.AMOUNT_FILTER.OUT'),
    title: i18n.t('DATA_PAGE.AMOUNT_FILTER.OUT_TITLE'),
  },
]

export const MIN_COLUMN_WIDTH = 10 // %

/**
 * Moves the divider between column `index` and `index + 1` by `delta` percent, respecting the minimum width.
 */
export const resizeColumns = (widths: number[], index: number, delta: number) => {
  const total = widths[index] + widths[index + 1]
  const left = Math.min(Math.max(widths[index] + delta, MIN_COLUMN_WIDTH), total - MIN_COLUMN_WIDTH)
  const next = [...widths]
  next[index] = left
  next[index + 1] = total - left
  return next
}

/**
 * Opens the browser's folder picker and returns all files in it (recursively), or `undefined` if nothing was picked.
 */
export const openFolderPicker = async () => {
  try {
    if (!('showDirectoryPicker' in window)) {
      alert(i18n.t('DATA_PAGE.FOLDER_NOT_SUPPORTED'))
      return
    }

    // @ts-expect-error showDirectoryPicker not in TS types
    const directoryHandle = await window.showDirectoryPicker()

    const getFilesRecursively = async (dirHandle: any): Promise<File[]> => {
      const files: File[] = []
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          files.push(await entry.getFile())
        } else if (entry.kind === 'directory') {
          files.push(...(await getFilesRecursively(entry)))
        }
      }
      return files
    }

    const files = await getFilesRecursively(directoryHandle)

    if (!files.length) {
      alert(i18n.t('DATA_PAGE.FOLDER_EMPTY'))
      return
    }

    return files
  } catch (error) {
    const err = error as Error
    if (err.name !== 'AbortError') {
      console.error('Error selecting folder:', error)
      alert(i18n.t('DATA_PAGE.FOLDER_ACCESS_FAILED'))
    }
  }
}

/**
 * Sets the files of a file input and fires its change event, as if the user had picked them.
 */
export const setInputFiles = (input: HTMLInputElement, files: File[]) => {
  const dataTransfer = new DataTransfer()
  files.forEach((file) => dataTransfer.items.add(file))
  input.files = dataTransfer.files
  input.dispatchEvent(new Event('change', { bubbles: true }))
}
