'use client'

import { PageWrapper } from '@/components'
import { StatsPage } from '@/m-pages'
import { useFileHelper } from '@/hooks'

const Page = () => {
  const { isLoadingFiles } = useFileHelper()

  if (isLoadingFiles) {
    return <PageWrapper />
  }

  return <StatsPage />
}

export default Page
