'use client'

import { Box, List } from '@mui/material'
import { usePathname } from 'next/navigation'

import { useTranslation } from '@/lib/i18n'

import { NAV_ITEMS_BOTTOM, NAV_ITEMS_TOP } from '../../actions'
import MenuDrawerNavButton from '../MenuDrawerNavButton'

type MenuDrawerProps = {
  onClose: VoidFunction
}

const Component = ({ onClose }: MenuDrawerProps) => {
  const { t } = useTranslation()
  const pathname = usePathname()

  return (
    <List disablePadding>
      <Box sx={{ mt: 3 }}>
        {[...NAV_ITEMS_TOP, ...NAV_ITEMS_BOTTOM].map((item) => (
          <MenuDrawerNavButton
            key={item.route}
            route={item.route}
            isActive={pathname === item.route}
            isExternal={item.isExternal}
            onClose={onClose}
          >
            {t(item.labelKey)}
          </MenuDrawerNavButton>
        ))}
      </Box>
    </List>
  )
}

export default Component
