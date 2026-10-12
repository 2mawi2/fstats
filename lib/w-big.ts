import { Big as TheBig } from 'big.js'

TheBig.NE = -9 // Default is -7, but we set it to -9 because of BTC. 1 Satoshi can be represented as 1e-8 and we want to prevent that, hence -9

export const Big = TheBig
export type Big = TheBig
export type { BigSource } from 'big.js'
