'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CustomParserMapping } from '@/types'
import { reparseOutdatedFiles, reparseUnsupportedFiles, statsFileKey } from '@/m-stats-file/service'

import { addCustomParser, getCustomParsers, getCustomParsersSize, removeAllCustomParsers } from '../api'
import { loadCustomParsers } from './helper'
import { customParserKey } from './keys'

export const useCustomParsers = () => {
  return useQuery({
    queryKey: customParserKey.all,
    queryFn: () => {
      return getCustomParsers()
    },
    // Invalidated while the settings page isn't shown (e.g. a format set up), refetched once it is
    refetchOnMount: true,
  })
}

export const useCustomParsersSize = () => {
  return useQuery({
    queryKey: customParserKey.storageSize,
    queryFn: () => {
      return getCustomParsersSize()
    },
    refetchOnMount: true,
    retry: false,
  })
}

/**
 * Saves a custom parser and re-parses the unsupported files, so all files it matches are parsed with it.
 */
export const useMutateAddCustomParser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (mapping: CustomParserMapping) => {
      const parser = await addCustomParser(mapping)
      await loadCustomParsers()
      await reparseUnsupportedFiles()
      return parser
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customParserKey.all })
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
    },
  })
}

/**
 * Removes all custom parsers and re-parses the files read with them, which become unsupported until set up again.
 */
export const useMutateRemoveAllCustomParsers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await removeAllCustomParsers()
      await loadCustomParsers()
      await reparseOutdatedFiles()
    },
    // Also on errors, e.g. the parsers were removed but re-parsing failed
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: customParserKey.all })
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
    },
  })
}
