import type { StatsFile } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { isParsed, isUnknown } from '@/m-stats-file/service'
import { getBankAccountName } from '@/utils/Parser'

/**
 * What a file was parsed as, or why it wasn't.
 */
export const getFileFormat = (file: StatsFile) => {
  if (isParsed(file)) {
    return { value: getBankAccountName(file.parserId).long, color: 'text.primary' }
  }

  if (file.status === StatsFileStatus.PARSING) {
    return { value: 'Parsing…', color: 'text.secondary' }
  }

  if (isUnknown(file)) {
    return { value: 'Unsupported format', color: 'warning.main' }
  }

  return { value: file.status === StatsFileStatus.ERROR ? file.error.message : '-', color: 'error.main' }
}

export const TableView = {
  RAW: 'raw',
  TRANSACTIONS: 'transactions',
} as const

export type TableView = (typeof TableView)[keyof typeof TableView]

export const TABLE_VIEW_OPTIONS = [
  { value: TableView.RAW, label: 'Raw CSV' },
  { value: TableView.TRANSACTIONS, label: 'Transactions' },
]

export const AmountFilter = {
  ALL: 'all',
  IN: 'in',
  OUT: 'out',
} as const

export type AmountFilter = (typeof AmountFilter)[keyof typeof AmountFilter]

export const AMOUNT_FILTER_OPTIONS = [
  { value: AmountFilter.ALL, label: 'All', title: 'All amounts' },
  { value: AmountFilter.IN, label: 'In', title: 'Money in only' },
  { value: AmountFilter.OUT, label: 'Out', title: 'Money out only' },
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
 * Opens the browser's folder picker and feeds all files (recursively) into the dropzone file input.
 */
export const openFolderPicker = async () => {
  try {
    if (!('showDirectoryPicker' in window)) {
      alert(
        'Folder selection is not supported in your browser. Please use a browser that supports the local File API (e.g. Chrome or Edge).',
      )
      return
    }

    // @ts-expect-error showDirectoryPicker not in TS types
    const directoryHandle = await window.showDirectoryPicker()

    const filesToAdd: File[] = []

    const getFilesRecursively = async (dirHandle: any): Promise<File[]> => {
      const files: File[] = []
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const file = await entry.getFile()
          files.push(file)
        } else if (entry.kind === 'directory') {
          const subFiles = await getFilesRecursively(entry)
          files.push(...subFiles)
        }
      }
      return files
    }

    const files = await getFilesRecursively(directoryHandle)
    filesToAdd.push(...files)

    if (!filesToAdd.length) {
      alert('No files found in the selected folder.')
      return
    }

    const input = document.getElementById('dropzone-file-input') as HTMLInputElement
    if (input) {
      const dataTransfer = new DataTransfer()
      filesToAdd.forEach((file) => dataTransfer.items.add(file))
      input.files = dataTransfer.files
      const event = new Event('change', { bubbles: true })
      input.dispatchEvent(event)
    }
  } catch (error) {
    const err = error as Error
    if (err.name !== 'AbortError') {
      console.error('Error selecting folder:', error)
      alert('Failed to access the folder. Please try again.')
    }
  }
}
