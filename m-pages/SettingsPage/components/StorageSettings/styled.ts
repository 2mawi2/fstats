export const ui = () => {
  return {
    // The stats and the list of the selected one, apart from the buttons
    details: {
      mb: 3,
      pb: 2,
      borderBottom: '1px solid',
      borderColor: 'divider',
    },

    // The stats' padding is outside, so the icons align with the content below
    statsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1.5,
      mx: -1.5,
    },

    // Clickable stats show their list
    statTab: {
      borderRadius: 1,
      textAlign: 'left',
      '&:hover': { bgcolor: 'action.hover' },
      '&.Mui-focusVisible': { outline: 2, outlineColor: 'primary.main' },
    },

    chevron: {
      ml: -0.5,
      fontSize: 18,
      color: 'text.secondary',
      transition: 'transform 150ms',
    },

    chevronOpen: {
      transform: 'rotate(180deg)',
    },

    selectedTab: {
      bgcolor: 'action.selected',
      '&:hover': { bgcolor: 'action.selected' },
    },

    list: {
      mt: 2,
      mb: 0,
      pl: 2.5,
      fontSize: 13,
      color: 'text.secondary',
      wordBreak: 'break-word',
    },

    // Body text has a bottom margin in the theme
    listEmpty: {
      mt: 2,
      mb: 0,
      fontSize: 13,
      color: 'text.secondary',
    },

    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
    },

    // All stats are padded alike (also the one that isn't a tab), so they're spaced evenly
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      px: 1.5,
      py: 0.75,
    },

    statIcon: {
      fontSize: 20,
      color: 'text.secondary',
    },

    statValue: (isLoading: boolean) => ({
      fontWeight: 600,
      color: 'text.primary',
      mr: 1,
      opacity: isLoading ? 0.3 : 1,
    }),

    statLabel: {
      color: 'text.secondary',
      fontSize: '0.75rem',
    },
  }
}
