/**
 * Single source of truth for supported banks. IDs and zod schemas are derived from `BANKS`.
 *
 * Keep this module free of runtime imports besides `zod` and the bank definitions, it's used by `@/types`.
 */
import { z } from 'zod'

import type { AccountIds, ParserIds } from '@/types'

import { capitec, comdirect, fnb, ing, lloyds } from './banks'
import { toParserId } from './definition'

export const BANKS = [capitec, comdirect, fnb, ing, lloyds] as const

type Bank = (typeof BANKS)[number]

export type ParserId = ParserIds<Bank>

export type BankAccountId = AccountIds<Bank>

export const PARSER_IDS = BANKS.flatMap((bank) => bank.formats.map((format) => toParserId(bank, format))) as ParserId[]

export const zParserId = z.enum(PARSER_IDS)
