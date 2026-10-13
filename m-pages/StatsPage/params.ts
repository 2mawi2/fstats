import { ROUTES } from '@/common'

const VIEW_PARAM = 'view'

const DEMO_PARAM = 'demo'

/**
 * View of the middle column, `transactions` when the URL has none (or an unknown one).
 */
export const WorkspaceView = {
  CSV: 'csv',
  TRANSACTIONS: 'transactions',
  STATS: 'stats',
  BREAKDOWN: 'breakdown',
} as const

export type WorkspaceView = (typeof WorkspaceView)[keyof typeof WorkspaceView]

type SearchParams = { get: (name: string) => string | null; toString: () => string }

export const getView = (searchParams: SearchParams): WorkspaceView => {
  const view = searchParams.get(VIEW_PARAM)
  return Object.values(WorkspaceView).find((value) => value === view) ?? WorkspaceView.TRANSACTIONS
}

export const isDemo = (searchParams: SearchParams) => {
  return searchParams.get(DEMO_PARAM) === 'true'
}

/**
 * URL of the workspace with the current params changed, `null` removes a param. Keeps the others, e.g. the view
 * when ending the demo.
 */
export const getWorkspaceHref = (searchParams: SearchParams, changes: Record<string, string | null>) => {
  const next = new URLSearchParams(searchParams.toString())

  Object.entries(changes).forEach(([name, value]) => (value === null ? next.delete(name) : next.set(name, value)))

  const query = next.toString()
  return query ? `${ROUTES.STATS}?${query}` : ROUTES.STATS
}

/**
 * The default view has no param, so the plain route stays clean.
 */
export const getViewChange = (view: WorkspaceView) => {
  return { [VIEW_PARAM]: view === WorkspaceView.TRANSACTIONS ? null : view }
}

/**
 * The current workspace URL in demo mode, optionally switching to `view`.
 */
export const getDemoHref = (searchParams: SearchParams = new URLSearchParams(), view?: WorkspaceView) => {
  return getWorkspaceHref(searchParams, { [DEMO_PARAM]: 'true', ...(view ? getViewChange(view) : {}) })
}

/**
 * The current workspace URL without demo mode, keeping the view.
 */
export const getEndDemoHref = (searchParams: SearchParams) => {
  return getWorkspaceHref(searchParams, { [DEMO_PARAM]: null })
}
