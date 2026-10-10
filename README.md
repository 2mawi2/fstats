# fstats

Privacy-focused bank statement parser. Turns CSV exports from your bank into income/expense stats. Everything runs in the browser: no uploads, no tracking, no accounts.


## How it works

1. **Add files** — On the Data page, drop CSV bank statements or add an entire folder. Files are stored locally in the browser (IndexedDB).
2. **Parse** — Each file is matched to a supported bank format by its CSV headers and parsed into transactions. Transactions are categorised automatically.
3. **Select** — Choose which files to include, then continue to Stats.
4. **Analyse** — View profit/loss, income and expense breakdowns by category, charts and a transactions table. Filter by bank and date range, combine datasets and pick a display currency.

Supported banks: Capitec, FNB (South Africa), Comdirect, ING (Germany), Lloyds (UK). Try it at [fstats.site](https://fstats.site/).


## Development

See [DEVELOPMENT.md](DEVELOPMENT.md).
