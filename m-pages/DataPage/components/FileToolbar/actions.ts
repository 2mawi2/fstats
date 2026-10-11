import type { StatsFile } from '@/types'
import { isParsed } from '@/m-stats-file/service'
import { AVAILABLE_PARSERS, getBankAccountName } from '@/utils/Parser'

export type BankAccountOption = {
  value: string
  label: string
  fileIds: string[]
}

/**
 * One option per bank account of the parsed files, sorted by label.
 */
export const getBankAccountOptions = (files: StatsFile[]): BankAccountOption[] => {
  const options = new Map<string, BankAccountOption>()

  files.filter(isParsed).forEach((file) => {
    const { bankAccountId } = AVAILABLE_PARSERS[file.parserId]
    const option = options.get(bankAccountId) ?? {
      value: bankAccountId,
      label: getBankAccountName(file.parserId).alt,
      fileIds: [],
    }
    options.set(bankAccountId, { ...option, fileIds: [...option.fileIds, file.id] })
  })

  return Array.from(options.values()).sort((a, b) => a.label.localeCompare(b.label))
}

/**
 * Whether `fileIds` are exactly the checked files, i.e. the option is what's currently selected.
 */
export const isSameSelection = (fileIds: string[], checkedIds: string[]) => {
  return fileIds.length === checkedIds.length && fileIds.every((id) => checkedIds.includes(id))
}
