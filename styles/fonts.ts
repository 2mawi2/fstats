import { Roboto, Trispace } from 'next/font/google'

export const roboto = Roboto({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const trispace = Trispace({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-trispace',
})
