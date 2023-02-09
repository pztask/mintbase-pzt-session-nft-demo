# Mintbase Puzzletask Session-NFT Demo

Simple project to demonstrate how to use the mintbase-pzt-session-nft lib.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/<endpoint>](http://localhost:3000/api/<endpoint>). This endpoint can be edited in `pages/api/<endpoint>.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Setup database (sqlite) with Prisma

1. Edit your .env file with the location and database file name you want. (check the existing .env.example)
2. Run the prisma migrations with:

```
yarn run prisma migrate dev
```

3. Run the database seeds:

```
yarn run prisma db seed
```

4. The demo is now ready to use the database.

**Note:** If you need a clean fresh database, run this:

```
yarn run prisma migrate reset
```
