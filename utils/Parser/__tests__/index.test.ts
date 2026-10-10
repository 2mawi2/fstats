import { describe, expect, expectTypeOf, it } from 'vitest'

import type { BankAccountId, ParserId } from '@/utils/Parser'
import {
  AVAILABLE_PARSERS,
  BANKS,
  getFormatHeaders,
  getReferencedHeaders,
  normalizeHeader,
  PARSER_IDS,
  toParserId,
} from '@/utils/Parser'

describe('registry', () => {
  it('should derive literal ID types', () => {
    expectTypeOf<ParserId>().toEqualTypeOf<
      | 'capitec__savings__1'
      | 'capitec__savings__2'
      | 'comdirect__current__1'
      | 'comdirect__credit_card__1'
      | 'fnb__credit_card__1'
      | 'ing__current__1'
      | 'lloyds__current__1'
    >()
    expectTypeOf<BankAccountId>().toEqualTypeOf<
      | 'capitec__savings'
      | 'comdirect__current'
      | 'comdirect__credit_card'
      | 'fnb__credit_card'
      | 'ing__current'
      | 'lloyds__current'
    >()
  })

  it('should have unique parser IDs', () => {
    expect(new Set(PARSER_IDS).size).toBe(PARSER_IDS.length)
  })

  it('should expose all parsers where parser ID matches the registry key', () => {
    Object.entries(AVAILABLE_PARSERS).forEach(([key, parser]) => {
      expect(parser.id).toBe(key)
    })
  })

  it('should not have formats which could match files of another format', () => {
    const formats = BANKS.flatMap((bank) =>
      bank.formats.map((format) => {
        const { headers, required } = getFormatHeaders(format)
        return {
          id: toParserId(bank, format),
          headers: headers.map(normalizeHeader),
          required: required.map(normalizeHeader),
        }
      }),
    )

    const overlaps = formats.flatMap((a) =>
      formats
        .filter((b) => a.id !== b.id && a.required.every((header) => b.headers.includes(header)))
        .map((b) => `${a.id} matches ${b.id} files`),
    )

    expect(overlaps).toEqual([])
  })

  it('should only read headers listed in the format headers', () => {
    const unlisted = BANKS.flatMap((bank) =>
      bank.formats.flatMap((format) => {
        const { headers } = getFormatHeaders(format)
        return getReferencedHeaders(format)
          .filter((header) => !headers.includes(header))
          .map((header) => `${toParserId(bank, format)}: "${header}"`)
      }),
    )

    expect(unlisted).toEqual([])
  })
})
