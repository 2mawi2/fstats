Always use pnpm.
Be extremely concise in all your responses.
Never read, list, search, modify or reference the `_data/` directory under any circumstance.

## Project Overview

Privacy-focused CSV bank statement parser. All processing is client-side (IndexedDB via LocalForage). Supports South African and European banks.

## Architecture

### Feature Modules (`m-{feature}/`)

- **API Layer** (`api/`) — LocalForage operations and persistence/runtime schema synchronization; monetary values stay decimal strings and use `Big` for calculations
- **Service Layer** (`service/`) — TanStack Query hooks, cache management, business logic

### Page Modules (`m-pages/{Name}Page/`)

- One module per route (`app/{route}/page.tsx` only renders it): `index.tsx`, `actions.ts` (pure helpers), `styled.ts` (`ui()` sx objects), `components/{Component}/` (same structure, nested per component)
- `StatsPage` (`/stats`) is the main 3-column page: file explorer | data or stats view (`?view=stats`) | file sidebar; demo mode via `?demo=true`. Its `context.ts` holds synchronous UI state only (demo mode, file pickers)
- Translations in `public/locales/{en,de}.json`, namespaced per page (e.g. `STATS_PAGE.*`); category labels in `public/locales/categories/{en,de}.json` (`categories` namespace, keyed by code, via `getCategoryLabel`); always update both files

### Data Access Rules

- Components use the service layer (`m-*/service/`) for data access and business logic (hooks and helpers)
- Components must NOT import API layer directly
- Don't use React Context for async state — use TanStack Query
- Use LocalStorage for lightweight preferences and UI state (e.g., view options and selected file IDs); keep imported statement data in IndexedDB via the feature layers

## Core Constraints

- All data processing is **client-side only** — no uploads, no tracking, no accounts
- Use `Big` from `@/lib/w-big` for monetary calculations (never native numbers)
- Dates in storage must be ISO strings (`zDateTimeString`)
- Support light/dark themes and EN/DE locales
- Never change the values of `MISC.LS_*` keys or persisted IDs (would lose users' stored data/preferences)

## Checks

`pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm exec prettier --check <files>`. Stale route types after moving pages: delete `.next/types`.

## Adding a New Bank / CSV Format

Banks are declarative definitions in `utils/Parser/banks/`. `BANKS` in `utils/Parser/registry.ts` is the single registry; `ParserId`, `BankAccountId` and `zParserId` are derived from it.

1. Create `utils/Parser/banks/new_bank.ts` (or add a format to an existing bank):
```typescript
import { AccountType, Country, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const newBank = defineBank({
  id: 'new_bank',
  name: 'New Bank',
  country: Country.DE, // shown on the home page, add new countries to `Country` and the `COUNTRY` translations
  currency: Currency.EUR,
  formats: [
    {
      accountType: AccountType.CURRENT, // bank account ID `new_bank__current`
      accountName: 'Giro', // display name
      variant: 'default', // parser ID `new_bank__current__default`; additional formats of the same account get descriptive names (e.g. 'legacy')
      dateFormat: 'dd.MM.yyyy',
      numberFormat: 'de', // '1.234,56', or 'en' for '1,234.56'
      // All CSV headers of the file (any order, header row found automatically). Used for detection: all
      // non-optional headers must be present, unlisted headers still match but are logged.
      headers: ['Buchung', 'Datum', 'Empfänger', 'Verwendungszweck', { header: 'Saldo', optional: true }, 'Betrag'],
      // Headers below must be listed in `headers` (type-checked)
      columns: {
        date: 'Datum',
        description: 'Empfänger', // or ['Empfänger', 'Verwendungszweck'] (joined)
        amount: { type: 'signed', header: 'Betrag' },
        // | { type: 'inOut', in: 'Haben', out: 'Soll' } (out is always negative)
        // | { type: 'firstOf', headers: ['In', 'Out', 'Fee'] } (first non-empty)
      },
      extraColumns: {
        balance: 'Saldo',
        reference: 'Verwendungszweck',
      },
    },
  ],
})
```
2. Export from `utils/Parser/banks/index.ts` and add to `BANKS` in `utils/Parser/registry.ts`
   - New account type: add it to `AccountType` in `types-enums/index.ts`
   - Update the expected IDs in the "should derive literal ID types" test (`utils/Parser/__tests__/index.test.ts`)
3. A file must match exactly one format. The registry test fails if a format's required headers are a subset of another format's headers — make sure `headers` lists all headers of the file.
4. Changing how existing files are parsed (e.g. transaction IDs) or renaming parser IDs (bank `id`, `accountType`, `variant`): bump `PARSER_VERSION` in `utils/Parser/create-parser.ts`, so stored files are re-parsed.
