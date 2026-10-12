Always use pnpm.
Be extremely concise in all your responses.

## Project Overview

Privacy-focused CSV bank statement parser. All processing is client-side (IndexedDB via LocalForage). Supports South African and European banks.

## Architecture

### Feature Modules (`m-{feature}/`)

- **API Layer** (`api/`) — LocalForage operations, data transformation (At Rest string ↔ In Memory Big), pure async functions
- **Service Layer** (`service/`) — TanStack Query hooks, cache management, business logic

### Data Access Rules

- Components use service hooks from `m-*/service/` (e.g., `useFiles`, `useMutateAddFiles`)
- Components must NOT import API layer directly
- Don't use React Context for async state — use TanStack Query
- LocalStorage for ephemeral state only (e.g., selected file IDs)

## Core Constraints

- All data processing is **client-side only** — no uploads, no tracking, no accounts
- Use `Big` from `@/lib/w-big` for monetary calculations (never native numbers)
- Dates in storage must be ISO strings (`DateTimeString`)
- Support light/dark themes and EN/DE locales

## Adding a New Bank / CSV Format

Banks are declarative definitions in `utils/Parser/banks/`. `BANKS` in `utils/Parser/registry.ts` is the single registry; `ParserId`, `BankAccountId` and `zParserId` are derived from it.

1. Create `utils/Parser/banks/new_bank.ts` (or add a format to an existing bank):
```typescript
import { AccountType, Currency } from '@/types-enums'

import { defineBank } from '../definition'

export const newBank = defineBank({
  id: 'new_bank',
  name: 'New Bank',
  currency: Currency.EUR,
  formats: [
    {
      accountType: AccountType.CURRENT, // bank account ID `new_bank__current`
      accountName: 'Giro', // display name
      version: '1', // parser ID `new_bank__current__1`; '2', '3', etc. for additional formats of the same account
      dateFormat: 'dd.MM.yyyy',
      numberFormat: 'de', // optional, '1.234,56'
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
