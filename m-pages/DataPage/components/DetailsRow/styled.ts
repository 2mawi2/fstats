export const ui = () => {
  return {
    fileCard: (isError: boolean, isUnknown: boolean, isParsing: boolean) => ({
      py: 0.5,
      cursor: isError || isUnknown ? 'default' : 'pointer',
      borderRadius: 1.25,
      opacity: isParsing ? 0.6 : 1,
      WebkitTapHighlightColor: 'transparent',
    }),

    fileContentBox: {
      flexGrow: 1,
      minWidth: 0,
    },

    fileName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 'medium',
    },
  }
}
