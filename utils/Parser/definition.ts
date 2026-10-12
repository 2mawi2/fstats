import type { AmountColumnDef, BankDef, DescriptionColumnDef, FormatDef, HeaderDef, ValidFormats } from '@/types'

export const defineBank = <const Id extends string, const F extends readonly FormatDef[]>(
  bank: Omit<BankDef, 'id' | 'formats'> & Required<Pick<BankDef, 'country'>> & { id: Id; formats: F & ValidFormats<F> },
): Omit<BankDef, 'id' | 'formats'> & Required<Pick<BankDef, 'country'>> & { id: Id; formats: F } => {
  return bank
}

/**
 * All headers of a format, and the subset required for detection.
 */
export const getFormatHeaders = ({ headers }: FormatDef) => {
  const toName = (header: HeaderDef) => (typeof header === 'string' ? header : header.header)

  return {
    headers: [...new Set(headers.map(toName))],
    required: [...new Set(headers.filter((header) => typeof header === 'string'))],
  }
}

/**
 * Headers read by `columns` and `extraColumns`.
 */
export const getReferencedHeaders = ({ columns, extraColumns = {} }: FormatDef) => {
  return [
    ...new Set([
      columns.date,
      ...getDescriptionHeaders(columns.description),
      ...getAmountHeaders(columns.amount),
      ...Object.values(extraColumns).filter((header) => !!header),
    ]),
  ]
}

export const getDescriptionHeaders = (description: DescriptionColumnDef) => {
  return typeof description === 'string' ? [description] : description
}

const getAmountHeaders = (amount: AmountColumnDef) => {
  switch (amount.type) {
    case 'signed':
      return [amount.header]
    case 'inOut':
      return [amount.in, amount.out]
    case 'firstOf':
      return amount.headers
  }
}

export const toAccountId = (bank: BankDef, format: FormatDef) => {
  return `${bank.id}__${format.accountType}`
}

export const toParserId = (bank: BankDef, format: FormatDef) => {
  return `${toAccountId(bank, format)}__${format.version}`
}
