import type { CategoryCode } from '@/types'

type KeywordRule = {
  keywords: string[]
  category: CategoryCode
}

const RAW_INCOME_KEYWORD_RULES: KeywordRule[] = [
  {
    category: 'PAS_03',
    keywords: ['Interest Received', 'INTEREST ON CREDIT BALANCE'],
  },

  {
    category: 'OTH_06',
    keywords: ['PAYMENT-THANK YOU', 'PAYMENT - THANK YOU', 'AMAZON PRIM', 'AMZN Mktp', 'STEAM PURCHASE'],
  },

  {
    category: 'TFI_01',
    keywords: ['Visa-Kartenabrechnung'],
  },
]

const RAW_EXPENSE_KEYWORD_RULES: KeywordRule[] = [
  {
    category: 'HOU_03',
    keywords: ['TELEKOM'],
  },
  {
    category: 'HOU_05',
    keywords: ['HERKULES', 'HORNBACH', 'OBI', 'BAUHAUS', 'TOOM', 'GARDENA'],
  },
  {
    category: 'HOU_07',
    keywords: ['IKEA', 'JYSK'],
  },

  {
    category: 'GRO_01',
    keywords: [
      'REWE',
      'EDEKA',
      'ALDI',
      'LIDL',
      'PENNY',
      'NETTO',
      'Kaufland',
      'NORMA',
      'SPAR',
      'SOUTHERN CO-OP',
      'TESCO',
      'Checkers',
      'BAECKER',
      'BACKEREI',
    ],
  },

  {
    category: 'TRN_01',
    keywords: ['SHELL', 'TOTAL'],
  },
  {
    category: 'TRN_04',
    keywords: ['Parkgarage', 'PAYBYPHONE'],
  },
  {
    category: 'TRN_06',
    keywords: ['WIGHTLINK'],
  },
  {
    category: 'TRN_07',
    keywords: ['2THELOO'],
  },

  {
    category: 'FAM_05',
    keywords: ['GOOGLE*YOUTUBE', 'GOOGLE *YouTube', 'Google YouTube Dublin', 'YouTube'],
  },
  {
    category: 'FAM_06',
    keywords: ['STEAM PURCHASE', 'STEAMGAMES.COM'],
  },
  {
    category: 'FAM_09',
    keywords: ['AMZN Mktp', 'AMAZON PRIM', 'TEDI'],
  },

  {
    category: 'HLT_02',
    keywords: ['ROSSMANN', 'DM DROGERIE', 'Müller', 'APOTHEKE', 'PHARMACY'],
  },

  {
    category: 'FIN_02',
    keywords: ['Internet Banking Payment: Fnb Cheque Account'],
  },
  {
    category: 'FIN_04',
    keywords: ['Internet Banking Payment: Luno (stb)'],
  },
  {
    category: 'FIN_05',
    keywords: [
      'Monthly Account Admin Fee',
      'International Processing Card Purchase Fee',
      'INTEREST',
      '#INT PYMT FEE',
      '#CREDIT CARD ACCOUNT FEE',
      '#CREDIT FACILITY SERVICE FEE',
      'Payment Fee',
    ],
  },

  {
    category: 'BUS_03',
    keywords: [
      'CLAUDE.AI',
      'GITHUB',
      'Google CLOUD',
      'GOOGLE*CLOUD',
      'DIGITALOCEAN.COM',
      'NAME-CHEAP.COM',
      'DNH*GODADDY',
      'Microsoft',
    ],
  },

  {
    category: 'TFO_01',
    keywords: ['Summe Monatsabrechnung Visa-Karte', 'Internet Banking Transfer'],
  },
]

type KeywordMatcher = {
  category: KeywordRule['category']
  keywords: { pattern: RegExp; length: number }[]
}

const WORD_CHAR = /[\p{L}\p{N}]/u

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Case-insensitive pattern that only matches whole words, e.g. 'OBI' doesn't match "mobile". Edges that aren't
 * letters or digits (e.g. '#INT PYMT FEE') need no boundary.
 */
const toKeywordPattern = (keyword: string) => {
  const start = WORD_CHAR.test(keyword.at(0) ?? '') ? '(?<![\\p{L}\\p{N}])' : ''
  const end = WORD_CHAR.test(keyword.at(-1) ?? '') ? '(?![\\p{L}\\p{N}])' : ''

  return new RegExp(`${start}${escapeRegExp(keyword)}${end}`, 'iu')
}

const toKeywordMatchers = (rules: KeywordRule[]): KeywordMatcher[] => {
  return rules.map((rule) => ({
    category: rule.category,
    keywords: rule.keywords.map((keyword) => ({ pattern: toKeywordPattern(keyword), length: keyword.length })),
  }))
}

export const INCOME_KEYWORD_RULES = toKeywordMatchers(RAW_INCOME_KEYWORD_RULES)
export const EXPENSE_KEYWORD_RULES = toKeywordMatchers(RAW_EXPENSE_KEYWORD_RULES)
