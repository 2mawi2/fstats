export type ConnectorSide = 'field' | 'column'

export type ConnectorEnd = { side: ConnectorSide; key: string }

export type Point = { x: number; y: number }

export type Anchor = Point & {
  /**
   * The column is scrolled out of view, its line ends at the edge of the list.
   */
  isOutOfView: boolean
}

export const toAnchorId = ({ side, key }: ConnectorEnd) => `${side}:${key}`

export const isSameEnd = (a: ConnectorEnd | null, b: ConnectorEnd) => a?.side === b.side && a.key === b.key

/**
 * Horizontal S-curve from a field to a column.
 */
export const getCurve = (start: Point, end: Point) => {
  const offset = Math.max(Math.abs(end.x - start.x) / 2, 24)

  return `M ${start.x} ${start.y} C ${start.x + offset} ${start.y}, ${end.x - offset} ${end.y}, ${end.x} ${end.y}`
}

/**
 * The field and column of two ends on different sides, `null` for ends on the same side.
 */
export const toConnection = (a: ConnectorEnd, b: ConnectorEnd) => {
  if (a.side === b.side) {
    return null
  }

  return a.side === 'field' ? { field: a.key, column: b.key } : { field: b.key, column: a.key }
}
