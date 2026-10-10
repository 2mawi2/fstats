'use client'

import { Box, Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

import { StatsFileStatus } from '@/types-enums'
import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useFileHelper } from '@/hooks'

import { AddFolderButton, FileDropZone, ParseButton, Summary } from './components'
import { ui } from './styled'

const showParseButton = process.env.NODE_ENV === 'development'

const Component = () => {
  const sx = ui()
  const router = useRouter()
  const { files, selectedFiles } = useFileHelper()

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Drop files below or add an entire folder.
          </Typography>
        </Grid>

        <Grid size={12}>
          <FileDropZone />
        </Grid>

        <Grid size={12}>
          <AddFolderButton />
          {showParseButton ? <ParseButton /> : null}
        </Grid>

        <Grid size={12}>
          <Summary />
        </Grid>

        {files.length ? (
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onMouseEnter={() => router.prefetch(ROUTES.STATS)}
                onClick={() => router.push(ROUTES.STATS)}
                sx={sx.ctaButton}
                disabled={!selectedFiles.length}
                loading={files.some((file) => file.status === StatsFileStatus.PARSING)}
              >
                Continue with {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'}
              </Button>
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </PageWrapper>
  )
}

export default Component
