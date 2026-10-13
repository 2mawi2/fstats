import { Clear } from '@mui/icons-material'
import { Box, IconButton, ListSubheader } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

type SwipeableDrawerSubheaderProps = {
  title?: ReactNode
  onClose: VoidFunction
  sx?: SxProps<Theme>
}

const Component = ({ title, onClose, sx = {} }: SwipeableDrawerSubheaderProps) => {
  return (
    <ListSubheader sx={{ background: 'transparent', ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, lineHeight: 1.5 }}>{title}</Box>
        <Box>
          <IconButton edge="end" color="primary" onClick={onClose} sx={{ color: 'inherit' }}>
            <Clear fontSize="medium" />
          </IconButton>
        </Box>
      </Box>
    </ListSubheader>
  )
}
export default Component
