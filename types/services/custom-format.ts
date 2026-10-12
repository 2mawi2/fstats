import { z } from 'zod'

import { zCurrency } from '@/types-enums'
import { zCustomId } from '@/utils/Parser/registry'

import { zDateTimeString, zNonEmptyString } from '../global'

/**
 * A bank format defined by the user, turned into a `BankDef` with a single format (see `toCustomBank`).
 */
export const zCustomFormat = z.object({
  id: zCustomId,
  created: zDateTimeString,
  bankName: zNonEmptyString,
  currency: zCurrency,
  dateFormat: zNonEmptyString,
  numberFormat: z.enum(['en', 'de']),
  /**
   * All headers of the file, all are required for detection.
   */
  headers: z.array(zNonEmptyString).min(1),
  columns: z.object({
    date: zNonEmptyString,
    description: z.array(zNonEmptyString).min(1),
    amount: z.discriminatedUnion('type', [
      z.object({ type: z.literal('signed'), header: zNonEmptyString }),
      z.object({ type: z.literal('inOut'), in: zNonEmptyString, out: zNonEmptyString }),
    ]),
  }),
  extraColumns: z.object({ balance: zNonEmptyString.optional(), reference: zNonEmptyString.optional() }),
})

export type CustomFormat = z.infer<typeof zCustomFormat>
