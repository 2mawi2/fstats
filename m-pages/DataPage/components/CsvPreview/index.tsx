'use client'

import type { StatsFile } from '@/types'
import { isRejected, useFileRows } from '@/m-stats-file/service'
import { useTranslation } from '@/lib/i18n'

import FileMessage from '../FileMessage'
import PreviewSection from '../PreviewSection'
import VirtualTable from '../VirtualTable'
import { getColumnCount, getMinColumnWidth } from './actions'

type CsvPreviewProps = {
  file: StatsFile
  scrollElement: HTMLElement | null
}

const Component = ({ file, scrollElement }: CsvPreviewProps) => {
  const { t } = useTranslation()
  const { data, isLoading, error } = useFileRows(file)

  // Not a CSV, so only the reason is shown
  if (isRejected(file)) {
    return (
      <PreviewSection title={file.file.name} file={file}>
        <FileMessage file={file} message={t('DATA_PAGE.FILE_NOT_READ', { message: file.error.message })} />
      </PreviewSection>
    )
  }

  if (!data) {
    return (
      <PreviewSection
        title={file.file.name}
        file={file}
        isLoading={isLoading}
        error={error ? t('DATA_PAGE.FAILED_TO_READ_FILE', { message: error.message }) : null}
      />
    )
  }

  // One table per section (e.g. Giro + Visa), as their columns differ
  return (
    <>
      {data.map(({ accountName, header, rows }, index) => {
        const columnCount = getColumnCount(header, rows)

        return (
          <PreviewSection
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            title={data.length > 1 && accountName ? `${file.file.name} (${accountName})` : file.file.name}
            file={file}
            rowCount={rows.length}
          >
            <VirtualTable
              columns={header?.map((label) => ({ label })) ?? null}
              columnCount={columnCount}
              minColumnWidth={getMinColumnWidth(columnCount)}
              rowCount={rows.length}
              getCells={(rowIndex) => rows[rowIndex]}
              scrollElement={scrollElement}
            />
          </PreviewSection>
        )
      })}
    </>
  )
}

export default Component
