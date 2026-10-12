import type { CategoryCode, Transaction } from '@/types'
import { ALL_CATEGORIES } from '@/common'
import { Big } from '@/lib/w-big'

import { EXPENSE_KEYWORD_RULES, INCOME_KEYWORD_RULES } from './keyword-rules'

export const getCategoryCode = (row: Transaction): CategoryCode => {
  const isIncome = Big(row.value).gte(0)
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

  const parentCode = code.split('_')[0] as CategoryCode
  const category = ALL_CATEGORIES[parentCode]

  if (!category) {
    return code
  }

  const subcategory = category.subcategories[code]
  return subcategory?.label ?? code
}
