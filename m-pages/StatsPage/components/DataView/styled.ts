export const ui = () => {
  return {
    middleScroll: (isEmpty: boolean) => ({
      flexGrow: 1,
      minHeight: 0,
      overflowY: 'auto',
      p: isEmpty ? 0 : 2,
    }),
  }
}
