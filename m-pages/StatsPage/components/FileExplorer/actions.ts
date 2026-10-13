export const MIN_PANE_HEIGHT = 10 // %

export const clampSplit = (value: number) => Math.min(Math.max(value, MIN_PANE_HEIGHT), 100 - MIN_PANE_HEIGHT)
