/**
 * Items grouped by key, in order of first appearance. Unlike lodash's `groupBy`, whose object sorts integer-like keys
 * (e.g. years) ascending.
 */
export const groupInOrder = <T>(items: T[], getKey: (item: T) => string) => {
  const groups = new Map<string, T[]>()

  items.forEach((item) => {
    const key = getKey(item)
    const group = groups.get(key)

    if (group) {
      group.push(item)
    } else {
      groups.set(key, [item])
    }
  })

  return groups
}
