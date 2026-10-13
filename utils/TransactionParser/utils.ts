import type { TFunction } from 'i18next'

import type { CategoryCode, GradientColorsLightDark, ParentCategoryCode, Transaction } from '@/types'
import { PARENT_CATEGORY_COLORS } from '@/common'
import { isExpense } from '@/utils/Stats'

import { EXPENSE_KEYWORD_RULES, INCOME_KEYWORD_RULES } from './keyword-rules'

export const getCategoryCode = (row: Transaction): CategoryCode => {
  // Zero amounts are categorised as income
  const isIncome = !isExpense(row)
  const keywordRules = isIncome ? INCOME_KEYWORD_RULES : EXPENSE_KEYWORD_RULES

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
  return isIncome ? 'TFI_02' : 'TFO_02'
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

export const getCategoryColor = (code: CategoryCode | null): GradientColorsLightDark | undefined => {
  if (!code) {
    return
  }

  return PARENT_CATEGORY_COLORS[getParentCategoryCode(code)]
}
