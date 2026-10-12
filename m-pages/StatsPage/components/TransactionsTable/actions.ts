import type { CategoryCode, GradientColorsLightDark } from '@/types'
import { PARENT_CATEGORY_COLORS } from '@/common'

export const getCategoryColor = (code: CategoryCode | null): GradientColorsLightDark | undefined => {
  if (!code) {
    return
  }

  const parentCode = code.split('_')[0] as CategoryCode

  return PARENT_CATEGORY_COLORS[parentCode]
}
