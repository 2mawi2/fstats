'use client'

import { ArrowDropDown, CreateNewFolderOutlined, DeleteOutlined, NoteAddOutlined } from '@mui/icons-material'
import { Box, Checkbox, Divider, IconButton, ListSubheader, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'

import { MISC } from '@/common'
import { isError, isParsed, isUnknown, useMutateRemoveFiles } from '@/m-stats-file/service'
import { useFileHelper } from '@/hooks'

import { openFolderPicker } from '../../actions'
import { getBankAccountOptions, isSameSelection } from './actions'
import { ui } from './styled'

type FileToolbarProps = {
  onAddFiles: () => void
}

const Component = ({ onAddFiles }: FileToolbarProps) => {
  const sx = ui()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const { files, selectedFileIds, setSelectedFileIds } = useFileHelper()
  const { mutate: removeFiles, isPending: isRemoving } = useMutateRemoveFiles()
  const checkedIds = files.filter((file) => selectedFileIds.includes(file.id)).map((file) => file.id)
  const isAllChecked = files.length > 0 && checkedIds.length === files.length

  const toIds = (list: typeof files) => list.map((file) => file.id)

  const selectOptions = [
    { label: 'All', fileIds: toIds(files) },
    { label: 'None', fileIds: [] },
    { label: 'Parsed', fileIds: toIds(files.filter(isParsed)) },
    { label: 'Unsupported', fileIds: toIds(files.filter(isUnknown)) },
    { label: 'Invalid', fileIds: toIds(files.filter((file) => isError(file) && !isUnknown(file))) },
  ]

  const bankOptions = getBankAccountOptions(files)

  // Derived from the selection, so it stays correct when files are (un)checked by hand
  const isActive = (fileIds: string[]) => isSameSelection(fileIds, checkedIds)
  const activeLabel = checkedIds.length
    ? [...bankOptions, ...selectOptions.filter((option) => !['All', 'None'].includes(option.label))].find((option) =>
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
          disabled={!files.length}
          indeterminate={checkedIds.length > 0 && !isAllChecked}
          onChange={() => setSelectedFileIds(checkedIds.length ? [] : files.map((file) => file.id))}
          sx={sx.checkbox}
        />
        <IconButton
          size="small"
          disabled={!files.length}
          onClick={(event) => setMenuAnchor(event.currentTarget)}
          sx={sx.selectMenuButton}
        >
          <ArrowDropDown />
        </IconButton>
      </Box>

      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)} sx={sx.menu}>
        {selectOptions.map((option) => (
          <MenuItem
            key={option.label}
            disabled={option.label !== 'None' && !option.fileIds.length}
            onClick={() => selectFiles(option.fileIds)}
            selected={isActive(option.fileIds)}
            sx={sx.menuItem}
          >
            {renderItemContent(option.label, option.label === 'None' ? null : option.fileIds.length)}
          </MenuItem>
        ))}
        {bankOptions.length ? <Divider sx={sx.menuDivider} /> : null}
        {bankOptions.length ? <ListSubheader sx={sx.menuSubheader}>Bank accounts</ListSubheader> : null}
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

      {checkedIds.length ? (
        <>
          <Tooltip title="Remove selected">
            <IconButton size="small" disabled={isRemoving} onClick={() => removeFiles(checkedIds)} sx={sx.actionButton}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={sx.divider} />
        </>
      ) : null}

      <Typography variant="caption" sx={sx.count} title={activeLabel}>
        {checkedIds.length ? `${checkedIds.length} of ${files.length}` : `${files.length} files`}
        {activeLabel ? ` ${MISC.CENTER_DOT} ${activeLabel}` : null}
      </Typography>

      <Tooltip title="Add files">
        <IconButton size="small" onClick={onAddFiles} sx={sx.actionButton}>
          <NoteAddOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add folder">
        <IconButton size="small" onClick={openFolderPicker} sx={sx.actionButton}>
          <CreateNewFolderOutlined />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default Component
