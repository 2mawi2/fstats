import { describe, expect, it } from 'vitest'

import { ALL_CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/common/categories'

describe('INCOME_CATEGORIES', () => {
  it('should have no duplicate parent keys with EXPENSE_CATEGORIES', () => {
    const incomeKeys = Object.keys(INCOME_CATEGORIES)
    const expenseKeys = Object.keys(EXPENSE_CATEGORIES)
    const duplicates = incomeKeys.filter((key) => expenseKeys.includes(key))

    expect(duplicates).toEqual([])
  })
})

describe('ALL_CATEGORIES', () => {
  it('should have a matching code for each parent key', () => {
    Object.entries(ALL_CATEGORIES).forEach(([key, category]) => {
      expect(category.code).toBe(key)
    })
  })

  it('should have unique subcategory keys across all parent categories', () => {
    const allSubcategoryKeys: string[] = []

    Object.values(ALL_CATEGORIES).forEach((category) => {
      allSubcategoryKeys.push(...Object.keys(category.subcategories))
    })

    const uniqueKeys = new Set(allSubcategoryKeys)
    const duplicates = allSubcategoryKeys.filter((key, index) => allSubcategoryKeys.indexOf(key) !== index)

    expect(duplicates).toEqual([])
    expect(allSubcategoryKeys.length).toBe(uniqueKeys.size)
  })

  it('should have a matching code for each subcategory key', () => {
    Object.values(ALL_CATEGORIES).forEach((category) => {
      Object.entries(category.subcategories).forEach(([key, subcategory]) => {
        expect(subcategory.code).toBe(key)
      })
    })
  })
})
