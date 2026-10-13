import type { ReactNode } from 'react'
import { z } from 'zod'

// See: https://github.com/mui/material-ui/issues/35910
import type {} from '@mui/material/themeCssVarsAugmentation'

// -------------------------------------------------------

export const zNonEmptyString = z.string().trim().nonempty({ error: 'ERRORS:REQUIRED' })

/**
 * The NonEmptyString ensures that there is a string value after being trimmed.
 */
export type NonEmptyString = z.infer<typeof zNonEmptyString>

// -------------------------------------------------------

export const zIdString = zNonEmptyString

/**
 * The IdString is a short-hand/proxy for readability purposes only.
 */
export type IdString = z.infer<typeof zIdString>

// -------------------------------------------------------

const zDateRange = z.object({
  start: z.date(),
  end: z.date(),
})

export type DateRange = z.infer<typeof zDateRange>

// -------------------------------------------------------

export const zDateTimeString = z.iso.datetime({ offset: true, error: 'ERRORS:INVALID_DATETIME' })

/**
 * The DateTimeString must be a string in the ISO date format,
 * i.e. "2020-01-01T00:00:00+02:00".
 *
 * For more info see: https://github.com/colinhacks/zod?tab=readme-ov-file#datetimes
 */
export type DateTimeString = z.infer<typeof zDateTimeString>

// -------------------------------------------------------

const zSelectOptionWithType = <T>(valueSchema: z.ZodType<T>) => {
  return z.object({
    value: valueSchema,
    label: z.custom<ReactNode>(),
    labelSecondary: z.custom<ReactNode>().optional(),
  })
}

export type SelectOptionWithType<T> = z.infer<ReturnType<typeof zSelectOptionWithType<T>>>

// -------------------------------------------------------

export const zNumberString = z.string().nonempty({ error: 'ERRORS:REQUIRED' })
/**
 * The NumberString must be a string representation of a number,
 * i.e. '0' and never '', as using `Big('')` would fail.
 */
export type NumberString = z.infer<typeof zNumberString>

// -------------------------------------------------------

export type GradientDirection = 'horizontal' | 'vertical'

export type GradientColors = {
  start: string
  end: string
}

export type GradientColorsLightDark = {
  light: GradientColors
  dark: GradientColors
}

// -------------------------------------------------------
