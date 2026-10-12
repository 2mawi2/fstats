'use client'

import { Box, ListItem, Skeleton } from '@mui/material'

import StatsCard from '../StatsCard'
import { ui as statsListUi } from '../StatsList/styled'
import { ui as statsRowUi } from '../StatsRow/styled'

/**
 * Static placeholder of the expanded "All transactions" row, shown when no file is checked.
 */
const Component = () => {
  const rowSx = statsRowUi()
  const listSx = statsListUi()

  return (
    <StatsCard>
      <ListItem disablePadding divider sx={rowSx.item} aria-hidden>
        <Box sx={{ ...rowSx.row, display: 'flex', alignItems: 'center' }}>
          <Skeleton animation={false} width={110} sx={{ ...rowSx.title, flexGrow: 0 }} />
        </Box>
        <Box className="details" sx={rowSx.details}>
          <Skeleton animation={false} width={90} sx={listSx.count} />
          {[64, 72].map((width) => (
            <Box key={width} sx={listSx.row}>
              <Skeleton animation={false} width={width} sx={listSx.label} />
              <Skeleton animation={false} width={80} sx={listSx.value} />
            </Box>
          ))}
          <Box sx={{ ...listSx.row, ...listSx.totalRow, borderColor: 'divider' }}>
            <Skeleton animation={false} width={48} sx={{ ...listSx.label, ...listSx.total }} />
            <Skeleton animation={false} width={96} sx={{ ...listSx.value, ...listSx.total }} />
          </Box>
        </Box>
      </ListItem>
    </StatsCard>
  )
}

export default Component
