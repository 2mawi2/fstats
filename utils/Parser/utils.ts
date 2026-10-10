import type { Parser } from '@/types'
import { MISC } from '@/common'

import { createParser } from './helper'
import type { BankAccountId, ParserId } from './registry'
import { BANKS } from './registry'

export const AVAILABLE_PARSERS = Object.fromEntries(
  BANKS.flatMap((bank) => bank.formats.map((format) => createParser(bank, format))).map((parser) => [
    parser.id,
    parser,
  ]),
) as Record<ParserId, Parser>

export const getParserCurrency = (parserId: ParserId) => {
  return AVAILABLE_PARSERS[parserId].currency
}

export const getBankAccountId = (parserId: ParserId): BankAccountId => {
  return AVAILABLE_PARSERS[parserId].bankAccountId
}

type BankAccountName = {
  short: string
  long: string
  alt: string
}

export const getBankAccountName = (value: ParserId | null): BankAccountName => {
  if (!value) {
    return {
      short: 'Unsupported',
      long: 'Unsupported bank format',
      alt: 'Unsupported format',
    }
  }

  const parser = AVAILABLE_PARSERS[value]

  if (parser) {
    return {
      short: parser.bankName,
      long: `${parser.bankName} ${MISC.CENTER_DOT} ${parser.accountName}`,
      alt: `${parser.bankName} / ${parser.accountName}`,
    }
  }

  console.warn(`Invalid parser ID: ${value}`)

  return {
    short: 'Invalid',
    long: 'Invalid parser',
    alt: 'Invalid parser',
  }
}
