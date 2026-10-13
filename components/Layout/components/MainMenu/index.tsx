import { Menu } from '@mui/icons-material'
import { Box, Container, Divider, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { usePathname } from 'next/navigation'

import { LAYOUT } from '@/common'

import ThemeSwitcher from '../../../ThemeSwitcher'
import { getActiveRouteLabel } from './actions'
import { ui } from './styled'

type MainMenuProps = {
  onMenuClick: VoidFunction
}

const Component = ({ onMenuClick }: MainMenuProps) => {
  const pathname = usePathname()
  const theme = useTheme()
  const sx = ui(theme)
  const activeLabel = getActiveRouteLabel(pathname)

  return (
    <>
      <Container maxWidth={LAYOUT.CONTAINER_MAX_WIDTH} sx={sx.menuContainer}>
        <Box sx={sx.menuWrapper}>
          <Box sx={sx.menu}>
            <IconButton color="primary" sx={{ ml: -1 }} onClick={onMenuClick}>
              <Menu color="primary" />
            </IconButton>
            <Typography color="secondary" sx={{ fontSize: 14 }}>
              {activeLabel}
            </Typography>
          </Box>

          <Box sx={sx.iconMenu}>
            <ThemeSwitcher />
          </Box>
        </Box>
      </Container>

      <Divider sx={sx.divider} />
    </>
  )
}

export default Component
