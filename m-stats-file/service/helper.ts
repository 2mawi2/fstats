import type { ParsedStatsFile, StatsFile, Transaction } from '@/types'
import { Currency, StatsFileErrorCode, StatsFileStatus } from '@/types-enums'
import { MISC } from '@/common'
import { parseFiles } from '@/utils/FileParser'
import type { BankAccountId } from '@/utils/Parser'
import { getBankAccountId, getBankAccountName, getParserCurrency, PARSER_VERSION } from '@/utils/Parser'

import { getFiles, removeAllFiles, updateFiles } from '../api'

export const isParsed = (file: StatsFile): file is ParsedStatsFile => {
  return file.status === StatsFileStatus.PARSED
}

/**
 * Files which are broken, as opposed to `isUnknown()` files which are valid CSVs from an unsupported bank.
 */
export const isError = (file: StatsFile) => {
  return file.status === StatsFileStatus.ERROR && file.error.code !== StatsFileErrorCode.UNSUPPORTED_FORMAT
}

/**
 * Files that weren't added as CSV (wrong file type or too large), so their content is never read.
 */
export const isRejected = (file: StatsFile): file is Extract<StatsFile, { status: typeof StatsFileStatus.ERROR }> => {
  return file.status === StatsFileStatus.ERROR && file.error.code === StatsFileErrorCode.REJECTED
}

export const isUnknown = (file: StatsFile) => {
  return file.status === StatsFileStatus.ERROR && file.error.code === StatsFileErrorCode.UNSUPPORTED_FORMAT
}

export const getFileTransactions = (file: ParsedStatsFile) => {
  return file.sections.flatMap((section) => section.transactions)
}

/**
 * All sections of a file are from the same bank, so they share the currency.
 */
export const getFileCurrency = (file: ParsedStatsFile) => {
  return getParserCurrency(file.sections[0].parserId)
}

type FileBankAccount = {
  bankAccountId: BankAccountId
  label: string
  currency: Currency
  fileIds: string[]
}

/**
 * Bank accounts of the files' sections, with the files they're in, sorted by label.
 */
export const getFileBankAccounts = (files: ParsedStatsFile[]): FileBankAccount[] => {
  const accounts = new Map<BankAccountId, FileBankAccount>()

  files.forEach((file) => {
    file.sections.forEach(({ parserId }) => {
      const bankAccountId = getBankAccountId(parserId)
      const account = accounts.get(bankAccountId) ?? {
        bankAccountId,
        label: getBankAccountName(parserId).alt,
        currency: getParserCurrency(parserId),
        fileIds: [],
      }

      if (!account.fileIds.includes(file.id)) {
        accounts.set(bankAccountId, { ...account, fileIds: [...account.fileIds, file.id] })
      }
    })
  })

  return Array.from(accounts.values()).sort((a, b) => a.label.localeCompare(b.label))
}

/**
 * IDs are content hashes, so identical transactions (e.g. from overlapping statements) are duplicates. The first
 * occurrence is unique, any later ones are duplicates.
 */
export const splitDuplicates = <T extends Transaction>(transactions: T[]) => {
  const seenIds = new Set<string>()
  const unique: T[] = []
  const duplicates: T[] = []

  transactions.forEach((transaction) => {
    if (seenIds.has(transaction.id)) {
      duplicates.push(transaction)
    } else {
      seenIds.add(transaction.id)
      unique.push(transaction)
    }
  })

  return { unique, duplicates }
}

/**
 * Re-parses stored files that were parsed with an older parser version, e.g. to update their transaction IDs.
 */
export const reparseOutdatedFiles = async () => {
  const files = await getFiles()
  const outdatedFiles = files.filter((file) => isParsed(file) && file.parserVersion !== PARSER_VERSION)

  if (outdatedFiles.length) {
    await updateFiles(await parseFiles(outdatedFiles))
  }
}

/**
 * Removes all stored files and the selected file IDs, e.g. at the start of a session when data isn't persisted.
 */
export const clearSessionFiles = async () => {
  await removeAllFiles()
  window.localStorage.removeItem(MISC.LS_SELECTED_FILE_IDS_KEY)
}
