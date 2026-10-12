import type { CategoryCode, GradientColorsLightDark, ParentCategoryCode, Transaction } from '@/types'
import { ALL_CATEGORIES, PARENT_CATEGORY_COLORS } from '@/common'
import { isExpense } from '@/utils/Stats'

import { EXPENSE_KEYWORD_RULES, INCOME_KEYWORD_RULES } from './keyword-rules'

export const getCategoryCode = (row: Transaction): CategoryCode => {
  // Zero amounts are categorised as income
  const isIncome = !isExpense(row)
  const keywordRules = isIncome ? INCOME_KEYWORD_RULES : EXPENSE_KEYWORD_RULES

  const description = row.description.toLowerCase()
  let matchedCategory: CategoryCode | null = null
  let matchedKeywordLength = -1

  for (const rule of keywordRules) {
    for (const keyword of rule.keywords) {
      // Prefer the most specific (longest) matching keyword over shorter matches
      if (description.includes(keyword) && keyword.length > matchedKeywordLength) {
        matchedCategory = rule.category
        matchedKeywordLength = keyword.length
      }
    }
  }

  if (matchedCategory) {
    return matchedCategory
  }

  // Uncategorised
  return isIncome ? 'TFI_02' : 'TFO_02'
}

export const getSubcategoryLabel = (code: CategoryCode | null): string => {
  if (!code) {
    return 'Uncategorised'
  }

  const category = ALL_CATEGORIES[getParentCategoryCode(code)]

  if (!category) {
    return code
  }

  const subcategory = category.subcategories[code]
  return subcategory?.label ?? code
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
