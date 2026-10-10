# Development

Start dev server on [localhost](http://localhost:3000/) with:

```
pnpm dev
```

See `.claude/CLAUDE.md` for architecture and adding a new bank.


## Environments

The website is hosted on Vercel. The website makes use of MUI for styling.

| Environment | URL |
| --- | --- |
| Local | http://localhost:3000/ |
| Staging | https://staging.fstats.site/ |
| Production | https://fstats.site/ |


## Deployment

We use GitHub together with GitHub Actions to push code to staging and production.

Pushing code to a feature branch will trigger a "build-branch" workflow.

Merging/pushing to `develop` will trigger a build on Vercel and a deploy out to staging.

Merging/pushing to `main` will trigger a build on Vercel and a deploy out to production.
