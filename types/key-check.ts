/**
 * This is a utility type to check whether keys of two types match.
 */
export type _KeysCheck<T, U> = keyof T extends keyof U ? (keyof U extends keyof T ? true : never) : never
