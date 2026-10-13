import type { SvgIconComponent } from '@mui/icons-material'
import { Box, ButtonBase, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

import { ui } from './styled'

type SidebarNavButtonProps = {
  label: string
  icon: SvgIconComponent
  expanded: boolean
  route?: string
  isExternal?: boolean
  onClick?: VoidFunction
  isActive?: boolean
}

const Component = ({
  label,
  icon: Icon,
  expanded,
  route,
  isExternal = false,
  onClick,
  isActive = false,
}: SidebarNavButtonProps) => {
  const theme = useTheme()
  const sx = ui(theme, isActive)
  const linkProps = route
    ? isExternal
      ? { component: 'a', href: route, target: '_blank', rel: 'noopener noreferrer' }
      : { component: Link, href: route }
    : { onClick }

  return (
    <Tooltip title={expanded ? '' : label} placement="right">
      <ButtonBase {...linkProps} aria-label={label} sx={sx.button}>
        <Box sx={sx.icon}>
          <Icon sx={{ fontSize: 20 }} />
        </Box>
        <Typography noWrap sx={sx.label(expanded)}>
          {label}
        </Typography>
      </ButtonBase>
    </Tooltip>
  )
}

export default Component
