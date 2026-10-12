import type { CategoryCode, Transaction } from '@/types'
import { ALL_CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/common'
import { Big } from '@/lib/w-big'

import { EXPENSE_KEYWORD_RULES, INCOME_KEYWORD_RULES } from './helper'

const useRandomizer = false

export const getCategoryCode = (row: Transaction): CategoryCode => {
  const isIncome = Big(row.value).gte(0)
  const keywordRules = isIncome ? INCOME_KEYWORD_RULES : EXPENSE_KEYWORD_RULES

  if (useRandomizer) {
    const incomeCats: CategoryCode[] = Object.keys(INCOME_CATEGORIES).flatMap((catCode) =>
      Object.keys(INCOME_CATEGORIES[catCode].subcategories),
    )
    const expenseCats: CategoryCode[] = Object.keys(EXPENSE_CATEGORIES).flatMap((catCode) =>
      Object.keys(EXPENSE_CATEGORIES[catCode].subcategories),
    )

    const incomeIndex = Math.floor(Math.random() * incomeCats.length)
    const expenseIndex = Math.floor(Math.random() * expenseCats.length)

    return isIncome ? incomeCats[incomeIndex] : expenseCats[expenseIndex]
  }

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
