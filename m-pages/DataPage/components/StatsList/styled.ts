const TABULAR_NUMS = { fontVariantNumeric: 'tabular-nums' } as const

export const ui = (size: 'large' | 'small') => {
  return {
    balance: {
      ...TABULAR_NUMS,
      fontSize: size === 'large' ? 28 : 18,
      fontWeight: 600,
      lineHeight: 1.2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    amounts: {
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: 2,
      rowGap: 1,
      mt: 1.5,
    },
    amount: {
      flex: '1 1 0',
      minWidth: 100,
    },
    amountValue: {
      ...TABULAR_NUMS,
      fontWeight: 600,
      whiteSpace: 'nowrap',
    },
    meta: {
      mt: 1.5,
      pt: 1,
      borderTop: 1,
      borderColor: 'divider',
    },
  }
}
