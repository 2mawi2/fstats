'use client'

import type { SvgIconComponent } from '@mui/icons-material'
import { CloudUploadOutlined } from '@mui/icons-material'
import { Button, Divider, Link } from '@mui/material'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'

import { MISC } from '@/common'
import { DEMO_PARAM, getWorkspaceHref } from '@/m-pages/Workspace/params'
import { Trans, useTranslation } from '@/lib/i18n'

import EmptyDisplay from '../EmptyDisplay'

type DropZoneDisplayProps = {
  onAddFiles: () => void
  onAddFolder: () => void
  icon?: SvgIconComponent
  title?: string
  /**
   * Translation key of the subtitle with the `files` and `link` components, see `DATA_PAGE.CLICK_TO_SELECT`.
   */
  subtitleKey?: string
}

/**
 * Shown in place of the data or stats when there are no files. The whole page is the drop zone.
 */
const Component = ({
  onAddFiles,
  onAddFolder,
  icon = CloudUploadOutlined,
  title,
  subtitleKey = 'DATA_PAGE.CLICK_TO_SELECT',
}: DropZoneDisplayProps) => {
  const { t } = useTranslation()
  const searchParams = useSearchParams()

  // Don't also trigger the click of the whole display
  const renderLink = (onClick: () => void) => (
    <Link
      component="button"
      variant="body2"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      sx={{ verticalAlign: 'baseline', mb: 0 }}
    />
  )

  return (
    <EmptyDisplay
      icon={icon}
      title={title ?? t('DATA_PAGE.DROP_FILES_ANYWHERE')}
      subtitle={
        <Trans
          i18nKey={subtitleKey}
          values={{ dot: MISC.CENTER_DOT }}
          components={{ files: renderLink(onAddFiles), link: renderLink(onAddFolder) }}
        />
      }
      caption={t('DATA_PAGE.FILE_RESTRICTIONS')}
      actions={
        <>
          <Divider sx={{ width: 240, fontSize: 12, color: 'text.secondary' }}>{t('MISC.OR')}</Divider>
          <Button
            component={NextLink}
            href={getWorkspaceHref(searchParams, { [DEMO_PARAM]: 'true' })}
            variant="outlined"
          >
            {t('MISC.VIEW_DEMO')}
          </Button>
        </>
      }
      onClick={onAddFiles}
    />
  )
}

export default Component
