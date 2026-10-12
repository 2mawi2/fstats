'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { User } from '@/types'
import { MISC } from '@/common'

import { getUser, updateUser } from '../api'
import { userKey } from './keys'

export const useUser = () => {
  const { data: user, ...rest } = useQuery({
    queryKey: userKey.detail(MISC.USER_KEY),
    queryFn: () => {
      return getUser()
    },
  })

  if (!user) {
    throw new Error('User must exist. Ensure user is initialised before using useUser.')
  }

  return { data: user, ...rest }
}

export const useMutateUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Partial<User>) => {
      return updateUser(updates)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(userKey.detail(MISC.USER_KEY), data)
    },
  })
}
