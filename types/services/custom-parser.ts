import { z } from 'zod'

import { zCurrency } from '@/types-enums'

import { zDateTimeString, zIdString, zNonEmptyString } from '../global'

const zAmountColumn = z.discriminatedUnion('type', [
  z.object({ type: z.literal('signed'), header: zNonEmptyString }),
  z.object({ type: z.literal('inOut'), in: zNonEmptyString, out: zNonEmptyString }),
  z.object({
    type: z.literal('sum'),
    signed: z.array(zNonEmptyString),
    in: z.array(zNonEmptyString),
    out: z.array(zNonEmptyString),
  }),
])

/**
 * How to read the CSV files of one account, set up by the user for files no built-in bank format matches. Like a
 * `FormatDef`, all `headers` must be present in a file for it to match.
 */
export const zCustomParserMapping = z.object({
  bankName: zNonEmptyString,
  accountName: zNonEmptyString,
  currency: zCurrency,
  dateFormat: zNonEmptyString,
  numberFormat: z.enum(['en', 'de']),
  headers: z.array(zNonEmptyString).min(1),
  columns: z.object({
    date: zNonEmptyString,
    description: zNonEmptyString,
    amount: zAmountColumn,
  }),
  extraColumns: z.object({
    balance: zNonEmptyString.nullable(),
    reference: zNonEmptyString.nullable(),
    transactionType: zNonEmptyString.nullable(),
    category: zNonEmptyString.nullable(),
    parentCategory: zNonEmptyString.nullable(),
  }),
})

export type CustomParserMapping = z.infer<typeof zCustomParserMapping>

export const zCustomParser = z.object({
  id: zIdString,
  created: zDateTimeString,
  modified: zDateTimeString,
  ...zCustomParserMapping.shape,
})

export type CustomParser = z.infer<typeof zCustomParser>
