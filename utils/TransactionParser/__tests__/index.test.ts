import { describe, expect, it } from 'vitest'

import type { Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { getCategoryCode } from '@/utils/TransactionParser'

const expense = (description: string): Transaction => ({
  id: '1',
  date: '2026-01-01T00:00:00.000Z',
  description,
  value: '-10.00',
  currency: Currency.EUR,
  category: null,
  extra: null,
})

describe('getCategoryCode', () => {
  it('should match keywords as whole words, ignoring case', () => {
    expect(getCategoryCode(expense('OBI Markt 123'))).toBe('HOU_05')
    expect(getCategoryCode(expense('Lastschrift spar Filiale'))).toBe('GRO_01')
    expect(getCategoryCode(expense('Müller Drogerie'))).toBe('HLT_02')
  })

  it('should not match keywords inside other words', () => {
    expect(getCategoryCode(expense('T-Mobile Rechnung'))).toBe('TFO_02')
    expect(getCategoryCode(expense('Sparkasse Überweisung'))).toBe('TFO_02')
    expect(getCategoryCode(expense('Nettogehalt'))).toBe('TFO_02')
  })

  it('should match keywords with non-word edges', () => {
    expect(getCategoryCode(expense('#INT PYMT FEE'))).toBe('FIN_05')
    expect(getCategoryCode(expense('Internet Banking Payment: Luno (stb) 42'))).toBe('FIN_04')
  })

  it('should prefer the longest matching keyword', () => {
    expect(getCategoryCode(expense('STEAM PURCHASE AMAZON PRIM'))).toBe('FAM_06')
  })
})
