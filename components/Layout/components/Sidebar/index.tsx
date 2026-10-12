'use client'

import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from '@mui/icons-material'
import { Box, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { usePathname } from 'next/navigation'

import { useTranslation } from '@/lib/i18n'

import { NAV_ITEMS_BOTTOM, NAV_ITEMS_TOP } from '../../actions'
import SidebarNavButton from '../SidebarNavButton'
import { ui } from './styled'

type SidebarProps = {
  expanded: boolean
  onToggle: VoidFunction
}

const Component = ({ expanded, onToggle }: SidebarProps) => {
  const theme = useTheme()
  const pathname = usePathname()
  const { t } = useTranslation()
  const sx = ui(theme, expanded)

  return (
    <Box component="nav" sx={sx.sidebar}>
      <Box sx={sx.group}>
        {NAV_ITEMS_TOP.map((item) => (
          <SidebarNavButton
            key={item.route}
            route={item.route}
            label={t(item.labelKey)}
            icon={pathname === item.route ? item.iconActive : item.icon}
            expanded={expanded}
            isActive={pathname === item.route}
          />
        ))}
      </Box>

      <Box sx={sx.group}>
        {NAV_ITEMS_BOTTOM.map((item) => (
          <SidebarNavButton
            key={item.route}
            route={item.route}
            label={t(item.labelKey)}
            icon={pathname === item.route ? item.iconActive : item.icon}
            expanded={expanded}
            isActive={pathname === item.route}
          />
        ))}

        <Divider sx={{ my: 1 }} />

        <SidebarNavButton
          label={t(expanded ? 'NAVIGATION.COLLAPSE_MENU' : 'NAVIGATION.EXPAND_MENU')}
          icon={expanded ? KeyboardDoubleArrowLeftRounded : KeyboardDoubleArrowRightRounded}
          expanded={expanded}
          onClick={onToggle}
        />
      </Box>
    </Box>
  )
}

export default Component
