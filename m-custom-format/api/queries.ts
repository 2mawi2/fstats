import type { CustomFormat } from '@/types'
import { zCustomFormat } from '@/types'
import { db } from '@/lib/localforage'
import { parseOrThrow } from '@/lib/zod'

export const getCustomFormats = async (): Promise<CustomFormat[]> => {
  const formats: CustomFormat[] = []
  await db.customFormatsStore.iterate<CustomFormat, void>((value) => {
    formats.push(value)
  })
  return formats.sort((a, b) => a.bankName.localeCompare(b.bankName))
}

export const addCustomFormat = async (format: CustomFormat): Promise<CustomFormat> => {
  return db.customFormatsStore.setItem(format.id, parseOrThrow(zCustomFormat, format, 'Cannot sync CustomFormat'))
}

export const removeCustomFormat = async (id: string): Promise<void> => {
  await db.customFormatsStore.removeItem(id)
}
