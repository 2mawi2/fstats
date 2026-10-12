'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import type { NewStatsFile, RowData, StatsFile, StatsFileState } from '@/types'
import { readCsvRows } from '@/utils/FileParser'
import { AVAILABLE_PARSERS } from '@/utils/Parser'

import { addFiles, getFiles, getStorageSize, removeAllFiles, removeFiles, updateFiles } from '../api'
import { isParsed } from './helper'
import { statsFileKey } from './keys'

/**
 * Header and transaction rows of a file as is. Files that weren't parsed have no known header, so all rows are
 * returned.
 */
export const useFileRows = (file: StatsFile) => {
  const parserId = isParsed(file) ? file.parserId : null

  // Stable `select`, otherwise it re-runs (scanning the whole file) on every render
  const select = useCallback(
    (rows: RowData[]): { header: RowData | null; rows: RowData[] } =>
      (parserId ? AVAILABLE_PARSERS[parserId].extractRows(rows) : null) ?? { header: null, rows },
    [parserId],
  )

  return useQuery({
    queryKey: statsFileKey.rows(file.id),
    queryFn: () => {
      return readCsvRows(file.file)
    },
    select,
  })
}

export const useFiles = () => {
  return useQuery({
    queryKey: statsFileKey.all,
    queryFn: () => {
      return getFiles()
    },
  })
}

export const useStorageSize = () => {
  return useQuery({
    queryKey: statsFileKey.storageSize,
    queryFn: () => {
      return getStorageSize()
    },
    retry: false,
  })
}

export const useMutateAddFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (files: NewStatsFile[]) => {
      return addFiles(files)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
    },
  })
}

export const useMutateUpdateFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (filesToUpdate: { id: string; state: StatsFileState }[]) => {
      return updateFiles(filesToUpdate)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
    },
  })
}

export const useMutateRemoveFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => {
      return removeFiles(ids)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
    },
  })
}

export const useMutateRemoveAllFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      return removeAllFiles()
    },
    onSuccess: () => {
      queryClient.setQueryData(statsFileKey.all, [])
      queryClient.setQueryData(statsFileKey.storageSize, 0)
    },
  })
}
