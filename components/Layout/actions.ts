import {
  FolderOpenOutlined,
  HelpOutlineRounded,
  HomeOutlined,
  SettingsOutlined,
  SignalCellularAlt,
} from '@mui/icons-material'
import type { SvgIconComponent } from '@mui/icons-material'

import { ROUTES } from '@/common'

export type NavItem = {
  route: string
  labelKey: string
  icon: SvgIconComponent
}

export const NAV_ITEMS_TOP: NavItem[] = [
  { route: ROUTES.HOME, labelKey: 'NAVIGATION.HOME', icon: HomeOutlined },
  { route: ROUTES.DATA, labelKey: 'NAVIGATION.DATA', icon: FolderOpenOutlined },
  { route: ROUTES.STATS, labelKey: 'NAVIGATION.STATS', icon: SignalCellularAlt },
]

export const NAV_ITEMS_BOTTOM: NavItem[] = [
  { route: ROUTES.SETTINGS, labelKey: 'NAVIGATION.SETTINGS', icon: SettingsOutlined },
  { route: ROUTES.ABOUT, labelKey: 'NAVIGATION.ABOUT', icon: HelpOutlineRounded },
]
