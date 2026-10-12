import { QueryClient } from '@tanstack/react-query'

let queryClient: QueryClient | undefined = undefined

/**
 * Data only lives in the browser (IndexedDB) and is never fetched on the server, so a single client suffices.
 */
export const getQueryClient = () => {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          retry: false,
          staleTime: Infinity,
          gcTime: 1000 * 60 * 60, // 60 minutes
        },
      },
    })
  }
  return queryClient
}
