import { uniq } from 'lodash'

export const ROW_HEIGHT = 30 // px

/**
 * Years are taller (with bigger text), as the larger grouping.
 */
export const YEAR_ROW_HEIGHT = 38 // px

export const getRowHeight = (row: Pick<DateRow, 'type'>) => {
  return row.type === 'year' ? YEAR_ROW_HEIGHT : ROW_HEIGHT
}

export const OVERSCAN = 10

/**
 * Left padding (px) of the rows by level: the months' expand buttons are centered below the year's checkbox, the days'
 * checkboxes start where the month labels start.
 */
export const ROW_INDENT = [4, 6, 28] as const

type DateMonth = {
  /**
   * `yyyy-MM`
   */
  key: string
  /**
   * `yyyy-MM-dd`, newest first.
   */
  days: string[]
}

type DateYear = DateMonth & {
  months: DateMonth[]
}

export type DateRow =
  | { type: 'year'; key: string; days: string[]; level: 0 }
  | { type: 'month'; key: string; days: string[]; level: 1 }
  | { type: 'day'; key: string; days: string[]; level: 2 }

/**
 * Years, months and days (`yyyy-MM-dd`) with transactions, newest first.
 */
export const getDateTree = (days: string[]): DateYear[] => {
  const sortedDays = uniq(days).sort().reverse()

  return groupByPrefix(sortedDays, 4).map(([year, yearDays]) => ({
    key: year,
    days: yearDays,
    months: groupByPrefix(yearDays, 7).map(([month, monthDays]) => ({ key: month, days: monthDays })),
  }))
}

/**
 * Groups in order of the days. Not `groupBy`, its object would sort integer-like keys (years) ascending.
 */
const groupByPrefix = (days: string[], length: number) => {
  const groups = new Map<string, string[]>()

  days.forEach((day) => {
    const key = day.slice(0, length)
    const group = groups.get(key)

    if (group) {
      group.push(day)
    } else {
      groups.set(key, [day])
    }
  })

  return [...groups.entries()]
}

/**
 * Only the latest year is expanded.
 */
export const getDefaultExpanded = (tree: DateYear[]) => {
  return new Set(tree.slice(0, 1).map((year) => year.key))
}

/**
 * Rows of the expanded years and months, flattened for the virtual list.
 */
export const getVisibleRows = (tree: DateYear[], expanded: Set<string>): DateRow[] => {
  return tree.flatMap((year): DateRow[] => [
    { type: 'year', key: year.key, days: year.days, level: 0 },
    ...(expanded.has(year.key)
      ? year.months.flatMap((month): DateRow[] => [
          { type: 'month', key: month.key, days: month.days, level: 1 },
          ...(expanded.has(month.key)
            ? month.days.map((day): DateRow => ({ type: 'day', key: day, days: [day], level: 2 }))
            : []),
        ])
      : []),
  ])
}

/**
 * Checked if none of the days are deselected, indeterminate if some are.
 */
export const getCheckState = (days: string[], deselectedDays: Set<string>) => {
  const deselectedCount = days.filter((day) => deselectedDays.has(day)).length
  return { checked: deselectedCount === 0, indeterminate: deselectedCount > 0 && deselectedCount < days.length }
}

/**
 * Deselects all days if all are selected, otherwise selects all.
 */
export const toggleDays = (days: string[], deselectedDays: Set<string>) => {
  const next = new Set(deselectedDays)
  const isAllSelected = getCheckState(days, deselectedDays).checked
  days.forEach((day) => (isAllSelected ? next.add(day) : next.delete(day)))
  return next
}

export const toggleExpanded = (key: string, expanded: Set<string>) => {
  const next = new Set(expanded)

  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }

  return next
}
