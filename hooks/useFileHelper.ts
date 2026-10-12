'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { isParsed, useFiles } from '@/m-stats-file/service'

export const useFileHelper = () => {
  const [selectedFileIds, setSelectedFileIds] = useLocalStorage<string[]>(MISC.LS_SELECTED_FILE_IDS_KEY, [])
  const { data: files = [], isLoading: isLoadingFiles } = useFiles()

  // Derived from `files`, so IDs of removed files are ignored
  const checkedFiles = files.filter((file) => selectedFileIds.includes(file.id))
  const checkedIds = checkedFiles.map((file) => file.id)
  const selectedFiles = checkedFiles.filter(isParsed)
  const isAllChecked = files.length > 0 && checkedIds.length === files.length

  const isChecked = (fileId: string) => selectedFileIds.includes(fileId)

  const toggleFile = (fileId: string) => {
    setSelectedFileIds((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  // Checks all files, or none if some are checked
  const toggleAll = () => {
    setSelectedFileIds(checkedIds.length ? [] : files.map((file) => file.id))
  }

  return {
    files,
    isLoadingFiles,
    checkedFiles,
    checkedIds,
    selectedFiles,
    isAllChecked,
    isChecked,
    toggleFile,
    toggleAll,
    setSelectedFileIds,
  }
}
