'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { isParsed, useFiles } from '@/m-stats-file/service'

export const useFileHelper = () => {
  const [selectedFileIds, setSelectedFileIds] = useLocalStorage<string[]>(MISC.LS_SELECTED_FILE_IDS_KEY, [])
  const { data: files = [], isLoading: isLoadingFiles } = useFiles()

  const selectedFiles = files.filter(isParsed).filter((file) => selectedFileIds.includes(file.id))

  return {
    files,
    isLoadingFiles,
    selectedFiles,
    selectedFileIds,
    setSelectedFileIds,
  }
}
