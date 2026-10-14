import { formatISO } from 'date-fns'

import type { CustomParser, CustomParserMapping } from '@/types'
import { db, getStoreSize } from '@/lib/localforage'

import { syncCustomParser } from './helper'

export const getCustomParsers = async (): Promise<CustomParser[]> => {
  const parsers: CustomParser[] = []
  await db.customParsersStore.iterate<CustomParser, void>((value) => {
    parsers.push(value)
  })
  return parsers.sort((a, b) => a.created.localeCompare(b.created))
}

export const getCustomParsersSize = () => {
  return getStoreSize(db.customParsersStore)
}

export const addCustomParser = async (mapping: CustomParserMapping): Promise<CustomParser> => {
  const created = formatISO(new Date())
  const parser: CustomParser = { ...mapping, id: crypto.randomUUID(), created, modified: created }

  return db.customParsersStore.setItem<CustomParser>(parser.id, syncCustomParser(parser))
}

export const removeAllCustomParsers = async () => {
  await db.customParsersStore.clear()
}
