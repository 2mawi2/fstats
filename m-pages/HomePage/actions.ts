import { LockOutlined, PersonOffOutlined, Public } from '@mui/icons-material'

import type { Country } from '@/types-enums'
import { BANKS } from '@/utils/Parser'

export const CARD_ITEMS = [
  {
    Icon: LockOutlined,
    key: 'ON_DEVICE',
  },
  {
    Icon: Public,
    key: 'IN_BROWSER',
  },
  {
    Icon: PersonOffOutlined,
    key: 'NO_ACCOUNT',
  },
] as const

export const STEPS = [
  {
    step: 1,
    key: 'ADD_FILES',
  },
  {
    step: 2,
    key: 'SELECT_FILES',
  },
  {
    step: 3,
    key: 'VIEW_STATS',
  },
] as const

/**
 * Supported bank names per country, in registry order.
 */
export const getBanksByCountry = () => {
  return BANKS.reduce<Partial<Record<Country, string[]>>>((acc, bank) => {
    acc[bank.country] = [...(acc[bank.country] ?? []), bank.name]
    return acc
  }, {})
}

/**
 * Flag of an ISO 3166-1 alpha-2 country code, from its regional indicator symbols.
 */
export const getFlagEmoji = (country: string) => {
  return String.fromCodePoint(...[...country.toUpperCase()].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65))
}
