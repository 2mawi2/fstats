# fstats

A privacy-focused bank statement parser.

Turn your bank's CSV exports into detailed income and expense stats. Everything runs in your browser: no uploads, no tracking, no account and no internet connection required.

Try it for free at [fstats.site](https://fstats.site/).

## How it works

1. Go to [fstats.site/stats](https://fstats.site/stats)
2. Turn off your internet connection (optional)
3. Add your files
4. View and analyse your statements

### Privacy

Your files are stored only in your browser and never leave your device.

By default, your files **are deleted** when you close the tab or browser window. To keep them between sessions, open the "Settings" page and enable "Persist data".

### Supported banks

#### United Kingdom

- [Lloyds](https://www.lloydsbank.com/)

#### Germany

- [Comdirect](https://www.comdirect.de/)
- [ING](https://www.ing.de/)

#### South Africa

- [Capitec](https://www.capitecbank.co.za/)
- [FNB](https://www.fnb.co.za/)

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md).

### Important files

- [utils/Parser](./utils/Parser/create-parser.ts): how CSV files are parsed
