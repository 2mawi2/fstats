export const statsFileKey = {
  all: ['stats-files'] as const,
  // Nested under `all`, so invalidating `all` covers it
  storageSize: ['stats-files', 'storage-size'] as const,
  // Separate root so invalidating `all` doesn't re-read file contents, which never change
  rows: (id: string) => ['stats-file-rows', id] as const,
}
