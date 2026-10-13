import type { TFunction } from 'i18next'

import type { CategoryCode, ParentCategoryCode, Transaction } from '@/types'
import { isExpense } from '@/utils/Stats'

import { EXPENSE_KEYWORD_RULES, INCOME_KEYWORD_RULES } from './keyword-rules'

export const getCategoryCode = (row: Pick<Transaction, 'description' | 'value'>): CategoryCode => {
  // Zero amounts are categorised as income
  const isIncomeOrZero = !isExpense(row)
  const keywordRules = isIncomeOrZero ? INCOME_KEYWORD_RULES : EXPENSE_KEYWORD_RULES

  let matchedCategory: CategoryCode | null = null
  let matchedKeywordLength = -1

  for (const rule of keywordRules) {
    for (const { pattern, length } of rule.keywords) {
      // Prefer the most specific (longest) matching keyword over shorter matches
      if (length > matchedKeywordLength && pattern.test(row.description)) {
        matchedCategory = rule.category
        matchedKeywordLength = length
      }
    }
  }

  if (matchedCategory) {
    return matchedCategory
  }

  // Uncategorised
  return isIncomeOrZero ? 'TFI_02' : 'TFO_02'
}

/**
 * Translated label of a (parent) category, the code itself when unknown.
 */
export const getCategoryLabel = (code: CategoryCode | ParentCategoryCode | null, t: TFunction): string => {
  return t(code ?? 'UNCATEGORISED', { ns: 'categories' })
}

/**
 * E.g. "INC" for "INC_01"
 */
export const getParentCategoryCode = (code: CategoryCode): ParentCategoryCode => {
  return code.split('_')[0]
}
