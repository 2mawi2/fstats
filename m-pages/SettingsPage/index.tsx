import { Grid } from '@mui/material'

import { PageWrapper } from '@/components'

import { DeviceSettings, LayoutSettings, StorageSettings, UserPreferences } from './components'

const Component = () => {
  return (
    <PageWrapper>
      <Grid container spacing={4}>
        <Grid size={12}>
          <DeviceSettings />
        </Grid>

        <Grid size={12}>
          <StorageSettings />
        </Grid>

        <Grid size={12}>
          <UserPreferences />
        </Grid>

        <Grid size={12}>
          <LayoutSettings />
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Component
