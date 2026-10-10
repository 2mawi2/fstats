export const SHA256 = {
  encrypt: async (input: string | ArrayBuffer): Promise<string> => {
    const encoded = typeof input === 'string' ? new TextEncoder().encode(input) : input
    const buffer = await window.crypto.subtle.digest('SHA-256', encoded)

    return Array.from(new Uint8Array(buffer))
      .map((val) => val.toString(16).padStart(2, '0'))
      .join('')
  },
}

/**
 * Fast, synchronous, non-cryptographic 53-bit hash, for deterministic IDs where `SHA256` (async) can't be used.
 * Source: https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
 */
export const CYRB53 = {
  encrypt: (input: string): string => {
    let h1 = 0xdeadbeef
    let h2 = 0x41c6ce57

    for (let index = 0; index < input.length; index += 1) {
      const char = input.charCodeAt(index)
      h1 = Math.imul(h1 ^ char, 2654435761)
      h2 = Math.imul(h2 ^ char, 1597334677)
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)

    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0')
  },
}
