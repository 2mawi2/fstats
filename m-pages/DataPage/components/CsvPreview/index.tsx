'use client'

import { useMemo } from 'react'

import type { StatsFile } from '@/types'
import { useFileRows } from '@/m-stats-file/service'
import { useTranslation } from '@/lib/i18n'

import PreviewSection from '../PreviewSection'
import VirtualTable from '../VirtualTable'
import { getColumnCount } from './actions'

type CsvPreviewProps = {
  file: StatsFile
  scrollElement: HTMLElement | null
}

const Component = ({ file, scrollElement }: CsvPreviewProps) => {
  const { t } = useTranslation()
  const { data, isLoading, error } = useFileRows(file)
  const header = data?.header ?? null
  const rows = useMemo(() => data?.rows ?? [], [data])
  const columnCount = useMemo(() => getColumnCount(header, rows), [header, rows])
  const columns = useMemo(() => header?.map((label) => ({ label })) ?? null, [header])

  return (
    <PreviewSection
      title={file.file.name}
      rowCount={data ? rows.length : undefined}
      isLoading={isLoading}
      error={error ? t('DATA_PAGE.FAILED_TO_READ_FILE', { message: error.message }) : null}
    >
      {data ? (
        <VirtualTable
          columns={columns}
          columnCount={columnCount}
          rowCount={rows.length}
          getCells={(index) => rows[index]}
          scrollElement={scrollElement}
        />
      ) : null}
    </PreviewSection>
  )
}

export default Component
