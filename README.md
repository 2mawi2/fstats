# fstats

A privacy focused bank statement parser.

Turn CSV exports from your bank into granular income/expense stats. Everything runs in your browser. No uploads, no tracking, no account, no internet required!

Try it for free at: [fstats.site](https://fstats.site/)

## How it works

1. Navigate to [fstats.site/stats](https://fstats.site/stats)
2. Turn off internet (optional)
3. Add files
4. View and analyse your statements

### Under the hood

Security first.

Files you add get stored in your browser! I'm really not interested in your finances.

By default files you add **will be deleted** as soon as you close the tab or browser window. To keep files and have them persist across browser sessions go to the "Settings" page and choose the "Persist data" option.


### Supported banks

##### United Kingdom

[lloydsbank.com](https://www.lloydsbank.com/) - Lloyds

##### Germany

[comdirect.de](https://www.comdirect.de/) - Comdirect
[ing.de](https://www.ing.de/) - ING

##### South Africa

[capitecbank.co.za](https://www.capitecbank.co.za/) - Capitec
[fnb.co.za](https://www.fnb.co.za/) - FNB


## Development

See [DEVELOPMENT.md](DEVELOPMENT.md).

#### Important files

[utils/Parser](./utils/Parser/create-parser.ts) - Read up on how CSVs get parsed
