'use client'

import { useSearchParams } from 'next/navigation'

import DataPage from '@/m-pages/DataPage'
import { getView, WorkspaceView } from '@/m-pages/Workspace/params'

import { StatsView } from './components'

/**
 * Middle column of the workspace, the data or stats view depending on the `view` param.
 */
const Component = () => {
  const searchParams = useSearchParams()

  return getView(searchParams) === WorkspaceView.STATS ? <StatsView /> : <DataPage />
}

export default Component
