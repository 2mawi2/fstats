import type { SxProps, Theme } from '@mui/material'
import { Box } from '@mui/material'

import { ui } from './styled'

// Between the strokes, and between the first one and the edge (px)
const GAP = 2
// Where the strokes meet the line (px from the edge). At 45°, they reach the edge at the same distance from the line.
const STROKES = [2, 3.5, 5].map((index) => ({ offset: index * GAP, length: index * GAP * Math.SQRT2 }))

type FletchingDividerProps = {
  sx?: SxProps<Theme>
}

/**
 * Divider for a stronger break than `Divider`, e.g. between sections of different currencies: a full width line with
 * three 45° strokes above and below it at both ends, from the edge to the line, like the fletching of an arrow.
 */
const Component = ({ sx: dividerSx }: FletchingDividerProps) => {
  const sx = ui()

  return (
    <Box role="separator" sx={[sx.divider, ...(Array.isArray(dividerSx) ? dividerSx : [dividerSx])]}>
      {(['start', 'end'] as const).flatMap((side) =>
        (['up', 'down'] as const).flatMap((direction) =>
          STROKES.map(({ offset, length }) => (
            <Box
              key={`${side}-${direction}-${offset}`}
              sx={sx.stroke(side, direction)}
              style={{ [side === 'start' ? 'left' : 'right']: offset - length, width: length }}
            />
          )),
        ),
      )}
    </Box>
  )
}

export default Component
