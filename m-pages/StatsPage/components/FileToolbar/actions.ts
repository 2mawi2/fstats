import type { StatsFile } from '@/types'
import { getFileBankAccounts, isParsed } from '@/m-stats-file/service'

export type BankAccountOption = {
  value: string
  label: string
  fileIds: string[]
}

/**
 * One option per bank account of the parsed files, sorted by label.
 */
export const getBankAccountOptions = (files: StatsFile[]): BankAccountOption[] => {
  return getFileBankAccounts(files.filter(isParsed)).map(({ bankAccountId, label, fileIds }) => ({
    value: bankAccountId,
    label,
    fileIds,
  }))
}

/**
 * Whether `fileIds` are exactly the checked files, i.e. the option is what's currently selected.
 */
export const isSameSelection = (fileIds: string[], checkedIds: string[]) => {
  return fileIds.length === checkedIds.length && fileIds.every((id) => checkedIds.includes(id))
}
