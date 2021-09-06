## Andromeda Metaverse

## Contract Fee

### NewNFTExchange
- royalty fee: nft contract field, implement registrar interface.
- protocol fee:
- permil:

###
- operationalFeePermil: 

## Getting Started

Install dependencies:

```bash
yarn
```

Run the development server:

```bash
yarn dev
```

## Deployment

### With Vercel

Just create with default settings

### With PM2

Edit `scripts/start` in [package.json](package.json) to change port.

- Deploy first time

```bash
yarn
yarn build
pm2 start npm --name "marketplace" -- start
```

- Deploy new version

```bash
git pull
yarn
yarn build
pm2 restart marketplace
```