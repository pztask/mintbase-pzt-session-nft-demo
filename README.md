# Mintbase Puzzletask Session-NFT Demo

Simple project to demonstrate how to use the mintbase-pzt-session-nft lib.

## Docker compose demo environment

If you just want to try the demo follow the instrunctions in the [docker directory](docker/README.md) and ignore the rest of this README file.

## Local development

### 1. Set environment variables

Start by renaming the `.env.example` file to `.env` and change the variables accordingly to your setup.

This is a quick explanation of the variables used:

- DATABASE_URL : The next app sqlite3 database file path, you can just leave it as it is if no special configuration is needed.
- NEXTAUTH_SECRET : Some string to be used as the nextauth secret for encryption and security purposes.
- NEAR_RPC_URL : The RPC endpoint used by the oracle bot to contact the smart contract, should match the network used. (Ref. [RPC Setup](https://docs.near.org/api/rpc/setup)
- NEAR_CONTRACT_ID : The near smart contract address to be used by the near-cli to deploy the contract.

### 2. Install dependencies

Run:

```bash
yarn install
```

### 3. Setup database (sqlite) with Prisma

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

### 4. Running the demo

First, start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the home page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/<endpoint>](http://localhost:3000/api/<endpoint>). This endpoint can be edited in `pages/api/<endpoint>.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## mintbase-pzt-session-nft-lib

In this project we have a git submodule for our [lib repo](https://github.com/pztask/mintbase-pzt-session-nft-lib) which has it's own README.

This lib includes helpers to be used together with mintbase JS `execute` function. This helpers use our concept of a _user bound NFT_ and will mint, transfer and burn NFTs with the user information and we can also request new _permits_ on the smartcontract. We also provide some additional functions to fetch information from the smartcontract, these are views and are not to be ran together with the `execute` function.

For more information about the lib, please refer to the [README](https://github.com/pztask/mintbase-pzt-session-nft-lib/blob/main/README).
