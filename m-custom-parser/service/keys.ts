export const customParserKey = {
  all: ['custom-parsers'] as const,
  // Nested under `all`, so invalidating `all` covers it
  storageSize: ['custom-parsers', 'storage-size'] as const,
}
