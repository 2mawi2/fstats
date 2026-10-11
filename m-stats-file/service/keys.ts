export const statsFileKey = {
  all: ['stats-files'] as const,
  detail: (id?: string | null) => [...statsFileKey.all, id] as const,
  // Separate root so invalidating `all` doesn't re-read file contents, which never change
  rows: (id: string) => ['stats-file-rows', id] as const,
}
