'use client'

import { Suspense } from 'react'

import { PageWrapper } from '@/components'
import { StatsPage } from '@/m-pages'

const Page = () => {
  // Reads the search params (view, demo mode), which need a suspense boundary when prerendering
  return (
    <Suspense fallback={<PageWrapper />}>
      <StatsPage />
    </Suspense>
  )
}

export default Page
