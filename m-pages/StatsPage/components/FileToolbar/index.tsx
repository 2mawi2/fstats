'use client'

import { ArrowDropDown, CreateNewFolderOutlined, DeleteOutlined, NoteAddOutlined } from '@mui/icons-material'
import { Box, Checkbox, Divider, IconButton, ListSubheader, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'

import { MISC } from '@/common'
import { isError, isParsed, isUnknown, useMutateRemoveFiles } from '@/m-stats-file/service'
import { useTranslation } from '@/lib/i18n'

import { useWorkspace, useWorkspaceFiles } from '../../context'
import { getBankAccountOptions, isSameSelection } from './actions'
import { ui } from './styled'

const Component = () => {
  const sx = ui()
  const { t } = useTranslation()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  // The demo file can't be unchecked or removed
  const { isDemoMode, onAddFiles, onAddFolder } = useWorkspace()
  const { files, checkedIds, isAllChecked, toggleAll, setSelectedFileIds } = useWorkspaceFiles()
  const { mutate: removeFiles, isPending: isRemoving } = useMutateRemoveFiles()

  const toIds = (list: typeof files) => list.map((file) => file.id)

  const selectOptions = [
    { id: 'all', label: t('STATS_PAGE.FILE_TOOLBAR.SELECT_ALL'), fileIds: toIds(files) },
    { id: 'none', label: t('STATS_PAGE.FILE_TOOLBAR.SELECT_NONE'), fileIds: [] },
    { id: 'parsed', label: t('STATS_PAGE.FILE_TOOLBAR.SELECT_PARSED'), fileIds: toIds(files.filter(isParsed)) },
    {
      id: 'unsupported',
      label: t('STATS_PAGE.FILE_TOOLBAR.SELECT_UNSUPPORTED'),
      fileIds: toIds(files.filter(isUnknown)),
    },
    {
      id: 'invalid',
      label: t('STATS_PAGE.FILE_TOOLBAR.SELECT_INVALID'),
      fileIds: toIds(files.filter(isError)),
    },
  ]

  const bankOptions = getBankAccountOptions(files)

  // Derived from the selection, so it stays correct when files are (un)checked by hand
  const isActive = (fileIds: string[]) => isSameSelection(fileIds, checkedIds)
  const activeLabel = checkedIds.length
    ? [...bankOptions, ...selectOptions.filter((option) => !['all', 'none'].includes(option.id))].find((option) =>
        isActive(option.fileIds),
      )?.label
    : undefined

  const renderItemContent = (label: string, count: number | null) => (
    <>
      <Box component="span" sx={sx.menuItemLabel}>
        {label}
      </Box>
      {count !== null ? (
        <Box component="span" sx={sx.menuItemCount}>
          {count}
        </Box>
      ) : null}
    </>
  )

  const selectFiles = (fileIds: string[]) => {
    setSelectedFileIds(fileIds)
    setMenuAnchor(null)
  }

  return (
    <Box sx={sx.toolbar}>
      <Box sx={sx.select}>
        <Checkbox
          size="small"
          checked={isAllChecked}
          disabled={!files.length || isDemoMode}
          indeterminate={checkedIds.length > 0 && !isAllChecked}
          onChange={toggleAll}
          sx={sx.checkbox}
        />
        <IconButton
          size="small"
          disabled={!files.length || isDemoMode}
          onClick={(event) => setMenuAnchor(event.currentTarget)}
          sx={sx.selectMenuButton}
        >
          <ArrowDropDown />
        </IconButton>
      </Box>

      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)} sx={sx.menu}>
        {selectOptions.map((option) => (
          <MenuItem
            key={option.id}
            disabled={option.id !== 'none' && !option.fileIds.length}
            onClick={() => selectFiles(option.fileIds)}
            selected={isActive(option.fileIds)}
            sx={sx.menuItem}
          >
            {renderItemContent(option.label, option.id === 'none' ? null : option.fileIds.length)}
          </MenuItem>
        ))}
        {bankOptions.length ? <Divider sx={sx.menuDivider} /> : null}
        {bankOptions.length ? (
          <ListSubheader sx={sx.menuSubheader}>{t('STATS_PAGE.FILE_TOOLBAR.BANK_ACCOUNTS')}</ListSubheader>
        ) : null}
        {bankOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => selectFiles(option.fileIds)}
            selected={isActive(option.fileIds)}
            sx={sx.menuItem}
          >
            {renderItemContent(option.label, option.fileIds.length)}
          </MenuItem>
        ))}
      </Menu>

      {checkedIds.length && !isDemoMode ? (
        <>
          <Tooltip title={t('STATS_PAGE.FILE_TOOLBAR.REMOVE_SELECTED')}>
            <IconButton size="small" disabled={isRemoving} onClick={() => removeFiles(checkedIds)} sx={sx.actionButton}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={sx.divider} />
        </>
      ) : null}

      <Typography variant="caption" sx={sx.count} title={activeLabel}>
        {checkedIds.length
          ? t('STATS_PAGE.FILE_TOOLBAR.SELECTED_COUNT', { selected: checkedIds.length, total: files.length })
          : t('STATS_PAGE.FILE_TOOLBAR.FILE_COUNT', { count: files.length })}
        {activeLabel ? ` ${MISC.CENTER_DOT} ${activeLabel}` : null}
      </Typography>

      <Tooltip title={t('STATS_PAGE.FILE_TOOLBAR.ADD_FILES')}>
        <IconButton size="small" onClick={onAddFiles} sx={sx.actionButton}>
          <NoteAddOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('STATS_PAGE.FILE_TOOLBAR.ADD_FOLDER')}>
        <IconButton size="small" onClick={onAddFolder} sx={sx.actionButton}>
          <CreateNewFolderOutlined />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default Component
