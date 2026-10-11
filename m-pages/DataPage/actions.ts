export const MIN_COLUMN_WIDTH = 10 // %

export const DEFAULT_COLUMN_WIDTHS = [20, 50, 30] // %

/**
 * Moves the divider between column `index` and `index + 1` by `delta` percent, respecting the minimum width.
 */
export const resizeColumns = (widths: number[], index: number, delta: number) => {
  const total = widths[index] + widths[index + 1]
  const left = Math.min(Math.max(widths[index] + delta, MIN_COLUMN_WIDTH), total - MIN_COLUMN_WIDTH)
  const next = [...widths]
  next[index] = left
  next[index + 1] = total - left
  return next
}

/**
 * Opens the browser's folder picker and feeds all files (recursively) into the dropzone file input.
 */
export const openFolderPicker = async () => {
  try {
    if (!('showDirectoryPicker' in window)) {
      alert(
        'Folder selection is not supported in your browser. Please use a browser that supports the local File API (e.g. Chrome or Edge).',
      )
      return
    }

    // @ts-expect-error showDirectoryPicker not in TS types
    const directoryHandle = await window.showDirectoryPicker()

    const filesToAdd: File[] = []

    const getFilesRecursively = async (dirHandle: any): Promise<File[]> => {
      const files: File[] = []
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const file = await entry.getFile()
          files.push(file)
        } else if (entry.kind === 'directory') {
          const subFiles = await getFilesRecursively(entry)
          files.push(...subFiles)
        }
      }
      return files
    }

    const files = await getFilesRecursively(directoryHandle)
    filesToAdd.push(...files)

    if (!filesToAdd.length) {
      alert('No files found in the selected folder.')
      return
    }

    const input = document.getElementById('dropzone-file-input') as HTMLInputElement
    if (input) {
      const dataTransfer = new DataTransfer()
      filesToAdd.forEach((file) => dataTransfer.items.add(file))
      input.files = dataTransfer.files
      const event = new Event('change', { bubbles: true })
      input.dispatchEvent(event)
    }
  } catch (error) {
    const err = error as Error
    if (err.name !== 'AbortError') {
      console.error('Error selecting folder:', error)
      alert('Failed to access the folder. Please try again.')
    }
  }
}
