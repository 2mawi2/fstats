'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import type { NewStatsFile, RowData, StatsFile, StatsFileState } from '@/types'
import { useFileHelper } from '@/hooks'
import { readCsvRows } from '@/utils/FileParser'
import { AVAILABLE_PARSERS } from '@/utils/Parser'

import {
  addFile,
  addFiles,
  getFile,
  getFiles,
  removeAllFiles,
  removeFile,
  removeFiles,
  updateFile,
  updateFiles,
} from '../api'
import { isParsed } from './helper'
import { statsFileKey } from './keys'

export const useFile = (id: string) => {
  return useQuery({
    queryKey: statsFileKey.detail(id),
    queryFn: () => {
      return getFile(id)
    },
  })
}

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
    staleTime: Infinity,
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

export const useMutateAddFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: NewStatsFile) => {
      return addFile(file)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      queryClient.setQueryData(statsFileKey.detail(data.id), data)
    },
  })
}

export const useMutateAddFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (files: NewStatsFile[]) => {
      return addFiles(files)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      data.forEach((file) => {
        queryClient.setQueryData(statsFileKey.detail(file.id), file)
      })
    },
  })
}

export const useMutateUpdateFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, state }: { id: string; state: StatsFileState }) => {
      return updateFile(id, state)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      queryClient.setQueryData(statsFileKey.detail(data.id), data)
    },
  })
}

export const useMutateUpdateFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (filesToUpdate: { id: string; state: StatsFileState }[]) => {
      return updateFiles(filesToUpdate)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      data.forEach((file) => {
        queryClient.setQueryData(statsFileKey.detail(file.id), file)
      })
    },
  })
}

export const useMutateRemoveFile = () => {
  const queryClient = useQueryClient()
  const { setSelectedFileIds } = useFileHelper()

  return useMutation({
    mutationFn: (id: string) => {
      return removeFile(id)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      queryClient.removeQueries({ queryKey: statsFileKey.detail(id) })
      setSelectedFileIds((prev) => prev.filter((fileId) => fileId !== id))
    },
  })
}

export const useMutateRemoveFiles = () => {
  const queryClient = useQueryClient()
  const { setSelectedFileIds } = useFileHelper()

  return useMutation({
    mutationFn: (ids: string[]) => {
      return removeFiles(ids)
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: statsFileKey.detail(id) })
      })
      setSelectedFileIds((prev) => prev.filter((fileId) => !ids.includes(fileId)))
    },
  })
}

export const useMutateRemoveAllFiles = () => {
  const queryClient = useQueryClient()
  const { setSelectedFileIds } = useFileHelper()

  return useMutation({
    mutationFn: () => {
      return removeAllFiles()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      queryClient.removeQueries({ queryKey: statsFileKey.all })
      setSelectedFileIds([])
    },
  })
}
