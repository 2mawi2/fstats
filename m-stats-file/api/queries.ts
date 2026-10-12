import { formatISO } from 'date-fns'

import type { NewStatsFile, StatsFile, StatsFileAtRest, StatsFileState } from '@/types'
import { StatsFileErrorCode, StatsFileStatus } from '@/types-enums'
import { db } from '@/lib/localforage'

import { getFileHash, parseStatsFile, syncStatsFile } from './helper'

export const getFile = async (id: string): Promise<StatsFile | null> => {
  if (!id) {
    throw new Error('No ID provided!')
  }
  const file = await db.filesStore.getItem<StatsFileAtRest>(id)
  return file ? parseStatsFile(file) : null
}

export const getFiles = async (): Promise<StatsFile[]> => {
  const files: StatsFile[] = []
  await db.filesStore.iterate<StatsFileAtRest, void>((value) => {
    files.push(parseStatsFile(value))
  })
  // Storage order is by (random) ID. Numeric, so "file 2" comes before "file 10".
  return files.sort((a, b) => a.file.name.localeCompare(b.file.name, undefined, { numeric: true }))
}

export const addFile = async (newFile: NewStatsFile): Promise<StatsFile> => {
  const [addedFile] = await addFiles([newFile])
  return addedFile
}

/**
 * Accepted files are added with status "parsing", unless their content was already uploaded.
 */
export const addFiles = async (newFiles: NewStatsFile[]): Promise<StatsFile[]> => {
  const existingFiles = await getFiles()
  const knownHashes = new Map(
    existingFiles
      .filter((file) => {
        return file.hash && !(file.status === StatsFileStatus.ERROR && file.error.code === StatsFileErrorCode.DUPLICATE)
      })
      .map((file) => [file.hash, file.file.name]),
  )

  const addedFiles: StatsFile[] = []

  // Sequential, so duplicates within the same upload are detected too
  for (const { file, rejection } of newFiles) {
    const hash = rejection ? null : await getFileHash(file)
    const duplicateOf = hash ? knownHashes.get(hash) : undefined

    const state: StatsFileState = rejection
      ? {
          status: StatsFileStatus.ERROR,
          error: { code: StatsFileErrorCode.REJECTED, message: rejection },
        }
      : duplicateOf
        ? {
            status: StatsFileStatus.ERROR,
            error: { code: StatsFileErrorCode.DUPLICATE, message: `Same content as "${duplicateOf}"` },
          }
        : { status: StatsFileStatus.PARSING }

    if (hash && !duplicateOf) {
      knownHashes.set(hash, file.name)
    }

    const created = formatISO(new Date())
    const addedFile: StatsFile = { id: crypto.randomUUID(), created, modified: created, file, hash, ...state }

    await db.filesStore.setItem<StatsFileAtRest>(addedFile.id, syncStatsFile(addedFile))
    addedFiles.push(addedFile)
  }

  return addedFiles
}

/**
 * Replaces the status dependent part of a file (e.g. with the parse result).
 */
export const updateFile = async (id: string, state: StatsFileState): Promise<StatsFile> => {
  const file = await db.filesStore.getItem<StatsFileAtRest>(id)

  if (!file) {
    throw new Error(`File with id ${id} not found`)
  }

  const updatedFile: StatsFile = {
    id: file.id,
    created: file.created,
    modified: formatISO(new Date()),
    file: file.file,
    hash: file.hash,
    ...state,
  }

  await db.filesStore.setItem<StatsFileAtRest>(id, syncStatsFile(updatedFile))

  return updatedFile
}

export const updateFiles = async (filesToUpdate: { id: string; state: StatsFileState }[]): Promise<StatsFile[]> => {
  const promises = filesToUpdate.map(({ id, state }) => updateFile(id, state))
  return await Promise.all(promises)
}

export const removeFile = async (id: string): Promise<void> => {
  await db.filesStore.removeItem(id)
}

export const removeFiles = async (ids: string[]): Promise<void> => {
  const promises = ids.map((id) => removeFile(id))
  await Promise.all(promises)
}

export const removeAllFiles = async (): Promise<void> => {
  await db.filesStore.clear()
}
