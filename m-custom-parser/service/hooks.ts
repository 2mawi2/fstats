'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CustomParserMapping } from '@/types'
import { reparseUnsupportedFiles, statsFileKey } from '@/m-stats-file/service'

import { addCustomParser } from '../api'
import { loadCustomParsers } from './helper'

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
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
    },
  })
}
