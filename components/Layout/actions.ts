import {
  FolderOpenOutlined,
  HelpOutlineRounded,
  HomeOutlined,
  SettingsOutlined,
  SignalCellularAlt,
} from '@mui/icons-material'

import type { NavItem } from '@/types'
import { ROUTES } from '@/common'

export const NAV_ITEMS_TOP: NavItem[] = [
  { route: ROUTES.HOME, labelKey: 'NAVIGATION.HOME', icon: HomeOutlined },
  { route: ROUTES.DATA, labelKey: 'NAVIGATION.DATA', icon: FolderOpenOutlined },
  { route: ROUTES.STATS, labelKey: 'NAVIGATION.STATS', icon: SignalCellularAlt },
]

export const NAV_ITEMS_BOTTOM: NavItem[] = [
  { route: ROUTES.SETTINGS, labelKey: 'NAVIGATION.SETTINGS', icon: SettingsOutlined },
  { route: ROUTES.ABOUT, labelKey: 'NAVIGATION.ABOUT', icon: HelpOutlineRounded },
]
