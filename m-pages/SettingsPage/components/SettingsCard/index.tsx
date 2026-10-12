import { Card, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type SettingsCardProps = {
  title: string
  children: ReactNode
}

const Component = ({ title, children }: SettingsCardProps) => {
  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Card>
  )
}

export default Component
