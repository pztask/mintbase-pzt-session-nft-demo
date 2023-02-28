# Run the demo using docker and docker-compose

Instructions on how to setup the demo environment using docker and docker-compose.

## Requirements

- [docker](https://docs.docker.com/get-docker/)
- [docker-compose](https://docs.docker.com/compose/install/)

## 1. Setup the .env file

Use the `.env.example` file available in the docker directory to create your own `.env` file that will be needed for the whole docker environment to work.

- NEAR_ENV : The near network that should be used by the near-cli when deploying the contract.
- NEAR_NETWORK : The near network that should be used by the oracle bot to access the contract.
- NEAR_PRIVATE_KEY : You account private key for the oracle bot to access the contract functions.
- NEAR_CONTRACT_ID : The near smart contract address to be used by the near-cli to deploy the contract.
- NEAR_ACCOUNT_ID : Your near account id used by the oracle bot to make the contract calls (usually the same as $NEAR_CONTRACT_ID).
- NEAR_RPC_URL : The RPC endpoint used by the oracle bot to contact the smart contract, should match the network used. (Ref. [RPC Setup](https://docs.near.org/api/rpc/setup)
- CONTRACT_REPO : The smart contract repository used for the contract deploy step. (Use ours for the demo: https://github.com/pztask/mintbase-pzt-session-nft-contract )
- ORACLE_BOT_REPO : The oracle bot repository used for the bot. (Use ours for the demo: https://github.com/pztask/mintbase-pzt-session-nft-bot )
- API_BASE_URL : The api address used by the bot to check for permits. (Use ours inside the docker container environment: http://mintbase-pzt-session-nft-demo:3000 )

## 2. Deploy our smart contract

First you need to build the docker image used to build the contract.

```
docker build -t pzt/smart_contract_deploy ./smart_contract_deploy
```

You will be prompted to follow the wallet login, by copying and pasting the given url on your browser and then approving the access on you account. If the redirect doesn't work in the end, just copy your account id and paste it on the terminal.

After the docker image is built, then we use it to run and deploy our smart contract on near.

```
docker run --env-file='./.env' -it pzt/smart_contract_deploy
```

## 3. Add data to the api

The api comes with some only two test users available in the `prisma/seed.ts` file.

```
john.doe@example.com:password1
jane.doe@example.com:password1
```

These should be enough to test the demo, but if you want to add and test your custom users please edit the `prisma/seed.ts` file with your own data to be loaded into the api before the next step.

## 4. Start the docker-compose environment

You can just run the following command and everything should the ready to go:

```
docker-compose up --build
```

Now you should have the api and frontend running and the oracle bot pinging the smart contract checking for new permits to verify. You should be able to access the demo frontend page on http://localhost:3000.

A healthy docker-compose environment should output something like this:

```
mintbase-pzt-session-nft-demo  | yarn run v1.22.19
mintbase-pzt-session-nft-demo  | $ next start
mintbase-pzt-session-nft-demo  | ready - started server on 0.0.0.0:3000, url: http://localhost:3000
mintbase-pzt-session-nft-demo  | info  - Loaded env from /app/.env
mintbase-pzt-session-nft-bot   | Fri Feb 17 15:26:43 UTC 2023
mintbase-pzt-session-nft-bot   | info: Permits to verify: {"permits":[]}
mintbase-pzt-session-nft-bot   | info: There's no permits to verify.
mintbase-pzt-session-nft-bot   | Fri Feb 17 15:26:49 UTC 2023
mintbase-pzt-session-nft-bot   | info: Permits to verify: {"permits":[]}
mintbase-pzt-session-nft-bot   | info: There's no permits to verify.
mintbase-pzt-session-nft-bot   | Fri Feb 17 15:26:54 UTC 2023
mintbase-pzt-session-nft-bot   | info: Permits to verify: {"permits":[]}
mintbase-pzt-session-nft-bot   | info: There's no permits to verify.
```

**Note:** If you see some deprecation warnings on the oracle bot, it's fine the near-sdk is still in development and some things are evolving and changing.

## 4. Testing the demo

You should be able to do all the actions available on the frontend page.