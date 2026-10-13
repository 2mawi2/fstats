export const ui = () => {
  return {
    middleScroll: (isEmpty: boolean) => ({
      flexGrow: 1,
      minHeight: 0,
      overflowY: 'auto',
      p: isEmpty ? 0 : 2,
    }),
    tables: {
      // Edge to edge, with the same margin above and below
      '& section > [role="separator"]': { mx: -2, my: 5 },
      // Only between tables, those without search matches aren't rendered
      '& > section:first-of-type > [role="separator"]': { display: 'none' },
    },
    // Only once all tables are hidden, without the padding of the scroll container like the other empty displays
    noSearchResults: {
      display: 'none',
      mx: -2,
      mt: -2,
      'div:empty + &': { display: 'block' },
    },
  }
}
