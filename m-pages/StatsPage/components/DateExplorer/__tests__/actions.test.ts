import { describe, expect, it } from 'vitest'

import { getDateTree } from '../actions'

describe('getDateTree', () => {
  it('should sort years, months and days newest first', () => {
    const tree = getDateTree(['2025-12-31', '2026-01-02', '2025-01-15', '2026-01-28', '2026-02-01', '2026-01-02'])

    expect(tree).toEqual([
      {
        key: '2026',
        days: ['2026-02-01', '2026-01-28', '2026-01-02'],
        months: [
          { key: '2026-02', days: ['2026-02-01'] },
          { key: '2026-01', days: ['2026-01-28', '2026-01-02'] },
        ],
      },
      {
        key: '2025',
        days: ['2025-12-31', '2025-01-15'],
        months: [
          { key: '2025-12', days: ['2025-12-31'] },
          { key: '2025-01', days: ['2025-01-15'] },
        ],
      },
    ])
  })
})
