export const ui = () => {
  return {
    middleScroll: (isEmpty: boolean) => ({
      flexGrow: 1,
      minHeight: 0,
      overflowY: 'auto',
      p: isEmpty ? 0 : 2,
    }),
    tables: {
      // Edge to edge, as much space below as above, where the margin of the previous table adds to it
      '& section > [role="separator"]': { mx: -2, mb: 5 },
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
