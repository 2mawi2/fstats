import localforage from 'localforage'

const baseConfig = {
  name: 'fstats',
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
}

let filesStore: LocalForage | null = null
let userStore: LocalForage | null = null
let customParsersStore: LocalForage | null = null

export const initStorage = () => {
  filesStore = localforage.createInstance({
    ...baseConfig,
    storeName: 'fstats__files',
    description: 'Uploaded files store',
  })

  userStore = localforage.createInstance({
    ...baseConfig,
    storeName: 'fstats__user',
    description: 'User store',
  })

  customParsersStore = localforage.createInstance({
    ...baseConfig,
    storeName: 'fstats__custom_parsers',
    description: 'Custom parsers store',
  })
}

export const db = {
  get filesStore() {
    if (!filesStore) {
      throw new Error('DB not initialised! Call initStorage() first.')
    }
    return filesStore
  },
  get userStore() {
    if (!userStore) {
      throw new Error('DB not initialised! Call initStorage() first.')
    }
    return userStore
  },
  get customParsersStore() {
    if (!customParsersStore) {
      throw new Error('DB not initialised! Call initStorage() first.')
    }
    return customParsersStore
  },
}
