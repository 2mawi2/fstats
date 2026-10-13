import { PersonOffOutlined, VisibilityOffOutlined, WifiOff } from '@mui/icons-material'

import { Country } from '@/types-enums'
import { BANKS } from '@/utils/Parser'

export const BADGES = [
  { Icon: VisibilityOffOutlined, key: 'NO_TRACKING' },
  { Icon: PersonOffOutlined, key: 'NO_ACCOUNT' },
  { Icon: WifiOff, key: 'WORKS_OFFLINE' },
] as const

export const STEPS = [
  { step: 1, key: 'GO_OFFLINE' },
  { step: 2, key: 'ADD_FILES' },
  { step: 3, key: 'VIEW_STATS' },
] as const

const COUNTRY_ORDER: Country[] = [Country.GB, Country.DE, Country.ZA]

/**
 * Supported banks, grouped by country in `COUNTRY_ORDER` (unlisted countries last).
 */
export const getSupportedBanks = () => {
  const countries = [...new Set([...COUNTRY_ORDER, ...BANKS.map((bank) => bank.country)])]

  return countries.flatMap((country) =>
    BANKS.filter((bank) => bank.country === country).map((bank) => ({ name: bank.name, country })),
  )
}

/**
 * Flag of an ISO 3166-1 alpha-2 country code, from its regional indicator symbols.
 */
export const getFlagEmoji = (country: string) => {
  return String.fromCodePoint(...[...country.toUpperCase()].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65))
}
