export const ui = () => {
  return {
    middleScroll: (isEmpty: boolean) => ({
      flexGrow: 1,
      minHeight: 0,
      overflowY: 'auto',
      p: isEmpty ? 0 : 2,
    }),
    // Only once all tables are hidden, without the padding of the scroll container like the other empty displays
    noSearchResults: {
      display: 'none',
      mx: -2,
      mt: -2,
      'div:empty + &': { display: 'block' },
    },
  }
}
