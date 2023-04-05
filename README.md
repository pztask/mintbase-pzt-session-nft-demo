# Mintbase Puzzletask Session-NFT Demo

Simple project to demonstrate how to use the mintbase-pzt-session-nft lib.

## Introduction

This repo is meant to be used as a demo for the Mintbase Puzzletask Session-NFT use case and open-source lib.

The idea behind our use case is that an NFT will be bound to a puzzletask user and that use can manage it's NFTs without the need to be the NFT owner. We can check our NFTs with just the puzzletask user session and we can also transfer the NFTs between different wallets, even if we loose access to the wallet where the NFTs are stored.

A good comparison is the Multi-Factor Authentication auth solutions. If we store our OTPs on Google Authenticator and we loose our phone, the OTPs are lost for good unless we have the recovery phrases. In response to this some companies created a way to attach your OTPs to your phone number or email address, like Authy. So, even if you lose your phone you just need to login again on the app to recover all your OTPs.

With Mintbase Puzzletask Session-NFT we are able to keep a hold on the NFTs without the need of the original wallet, we just need any wallet we want and the puzzletask user session to manage our NFTs, and they will never be lost. All the user needs is to be logged in and associate a wallet to it's user (we called it a `permit`). This permits are registered both in the API and the smart contract, for full tranparency and to be auditable to a certain point by anyone.

### Architecture

![image](https://user-images.githubusercontent.com/30434316/230063375-75c48777-4757-4fc1-864a-30e515bc262f.png)


There's three main blocks in our architecture, the browser page, the [smart contract](https://github.com/pztask/mintbase-pzt-session-nft-contract) and the puzzletask API.

The browser page handles all the puzzetask user session, the wallet session and the NFTs management. This is done using our [lib](https://github.com/pztask/mintbase-pzt-session-nft-lib) and our specific helpers.

The [smart contract](https://github.com/pztask/mintbase-pzt-session-nft-contract) is based on the zero to hero tutorial from Near, with some capabilities removed in favor of our custom puzzletask user layer and because we thought about this use case as a closed environment.

The puzzletask API is a simple REST API to handle the user login, and also register and check permits.

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

**Notes:**

The api comes with only two test users available in the `prisma/seed.ts` file.

```
john.doe@example.com:password1
jane.doe@example.com:password1
```

These should be enough to test the demo, but if you want to add and test your custom users please edit the `prisma/seed.ts` file with your own data to be loaded into the api before the next step.

Also, if you need a clean fresh database, run this:

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
