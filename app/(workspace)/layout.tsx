'use client'

import type { ReactNode } from 'react'
import { Suspense } from 'react'

import { PageWrapper } from '@/components'
import { Workspace } from '@/m-pages'

type LayoutProps = {
  children: ReactNode
}

/**
 * Shared by the data and stats pages, so the file explorer stays mounted when switching between them.
 */
const Layout = ({ children }: LayoutProps) => {
  // Reads the search params (demo mode), which need a suspense boundary when prerendering
  return (
    <Suspense fallback={<PageWrapper />}>
      <Workspace>{children}</Workspace>
    </Suspense>
  )
}

export default Layout
