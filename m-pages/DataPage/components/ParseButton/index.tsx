'use client'

import { AutorenewRounded } from '@mui/icons-material'
import { Button } from '@mui/material'

import { canParse, useMutateUpdateFiles } from '@/m-stats-file/service'
import { useFileHelper, useUserPreferences } from '@/hooks'
import { parseFiles } from '@/utils/FileParser'

const Component = () => {
  const { mutateAsync: updateFiles } = useMutateUpdateFiles()
  const { locale, dateFormat } = useUserPreferences()
  const { files } = useFileHelper()

  const parseAgain = async () => {
    const parseResults = await parseFiles(files.filter(canParse), locale, dateFormat)
    await updateFiles(parseResults)
  }

  return (
    <Button variant="outlined" startIcon={<AutorenewRounded />} onClick={parseAgain} sx={{ ml: 2, borderRadius: 1.5 }}>
      Parse again
    </Button>
  )
}

export default Component
