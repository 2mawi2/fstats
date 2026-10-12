'use client'

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

  if (!data) {
    return (
      <PreviewSection
        title={file.file.name}
        isLoading={isLoading}
        error={error ? t('DATA_PAGE.FAILED_TO_READ_FILE', { message: error.message }) : null}
      />
    )
  }

  // One table per section (e.g. Giro + Visa), as their columns differ
  return (
    <>
      {data.map(({ accountName, header, rows }, index) => (
        <PreviewSection
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          title={data.length > 1 && accountName ? `${file.file.name} (${accountName})` : file.file.name}
          rowCount={rows.length}
        >
          <VirtualTable
            columns={header?.map((label) => ({ label })) ?? null}
            columnCount={getColumnCount(header, rows)}
            rowCount={rows.length}
            getCells={(rowIndex) => rows[rowIndex]}
            scrollElement={scrollElement}
          />
        </PreviewSection>
      ))}
    </>
  )
}

export default Component
