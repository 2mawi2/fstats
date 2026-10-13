import { z } from 'zod'

import { zNumberString } from './global'
import { zCategory, zCategoryCode, zParentCategory, zTransaction } from './services/transaction'

const zCategoryWithTransactions = z.object({
  ...zCategory.shape,
  label: z.string(),
  transactions: z.array(zTransaction),
  total: zNumberString,
})

export type CategoryWithTransactions = z.infer<typeof zCategoryWithTransactions>

const zParentCategoryWithTransactions = z.object({
  ...zParentCategory.shape,
  label: z.string(),
  subcategories: z.record(zCategoryCode, zCategoryWithTransactions),
  transactions: z.array(zTransaction),
  total: zNumberString,
})

export type ParentCategoryWithTransactions = z.infer<typeof zParentCategoryWithTransactions>
