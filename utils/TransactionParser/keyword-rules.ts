import type { KeywordRule } from '@/types'

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
    ],
  },
  {
    category: 'GRO_01',
    keywords: ['BAECKER', 'BACKEREI'],
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

const toLowercaseKeywordRules = (rules: KeywordRule[]): KeywordRule[] => {
  return rules.map((rule) => ({
    ...rule,
    keywords: rule.keywords.map((keyword) => keyword.toLowerCase()),
  }))
}

export const INCOME_KEYWORD_RULES = toLowercaseKeywordRules(RAW_INCOME_KEYWORD_RULES)
export const EXPENSE_KEYWORD_RULES = toLowercaseKeywordRules(RAW_EXPENSE_KEYWORD_RULES)
