import { z } from 'zod'

import { zCurrency } from '@/types-enums'

import { zDateTimeString, zIdString, zNumberString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'

export const zParentCategoryCode = z.string().regex(/^[A-Z]{3}$/)
export const zCategoryCode = z.string().regex(/^[A-Z]{3}_\d{2}$/)

export type ParentCategoryCode = z.infer<typeof zParentCategoryCode>
export type CategoryCode = z.infer<typeof zCategoryCode>

export const zCategory = z.object({
  code: zCategoryCode,
  label: z.string(),
})

export type Category = z.infer<typeof zCategory>

export const zParentCategory = z.object({
  code: zParentCategoryCode,
  label: z.string(),
  subcategories: z.record(zCategoryCode, zCategory),
})

export type ParentCategory = z.infer<typeof zParentCategory>

export const zTransaction = z.object({
  /**
   * Hash of the transaction content (excluding `category`), so it's stable across re-parses
   * and equal for identical transactions in overlapping statements.
   */
  id: zIdString,
  date: zDateTimeString,
  description: z.string(),
  value: zNumberString,
  currency: zCurrency,
  category: zCategoryCode.nullable(),
  extra: z
    .object({
      parentCategory: z.string().optional(), // Capitec (parentCategory)
      category: z.string().optional(), // Capitec (category)
      balance: zNumberString.optional(), // Capitec (balance), FNB (balance), ING (saldo), Lloyds (balance)
      reference: z.string().optional(), // Comdirect Visa (referenz), ING (verwendungszweck)
      transactionType: z.string().optional(), // Comdirect Giro & Visa (vorgang), ING (buchungstext)
    })
    .nullable(),
})

export type Transaction = z.infer<typeof zTransaction>

export const zTransactionAtRest = z.object({
  ...zTransaction.shape,
  currency: z.string(),
})

export type TransactionAtRest = z.infer<typeof zTransactionAtRest>

// Safety checks
const assertKeys: _KeysCheck<Transaction, TransactionAtRest> = true
_zKeysCheck(zTransaction, zTransactionAtRest, assertKeys)
