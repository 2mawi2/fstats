'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CustomFormat } from '@/types'
import { statsFileKey } from '@/m-stats-file/service'

import { deleteCustomFormat, loadCustomFormats, saveCustomFormat } from './helper'
import { customFormatKey } from './keys'

export const useCustomFormats = () => {
  return useQuery({
    queryKey: customFormatKey.all,
    queryFn: () => {
      return loadCustomFormats()
    },
  })
}

export const useMutateSaveCustomFormat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (format: CustomFormat) => {
      return saveCustomFormat(format)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customFormatKey.all })
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
    },
  })
}

export const useMutateDeleteCustomFormat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (format: CustomFormat) => {
      return deleteCustomFormat(format)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customFormatKey.all })
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
    },
  })
}
