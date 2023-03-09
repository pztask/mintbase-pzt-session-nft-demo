import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { Network } from "mintbase";

const NEAR_RPC_URL = "https://rpc.testnet.near.org";
const CONTRACT_ADDRESS = "pztnft03.testnet";

export async function NearContract(accountId) {
  const test = new keyStores.BrowserLocalStorageKeyStore();

  const connection = await connect({
    networkId: Network.testnet,
    keyStore: test,
    masterAccount: accountId,
    nodeUrl: NEAR_RPC_URL,
  });

  // const walletConnection = new WalletConnection(connection, CONTRACT_ADDRESS);

  const nearAccount = await connection.account(accountId);

  // const testAccount = walletConnection.account();

  const contract = new Contract(nearAccount, CONTRACT_ADDRESS, {
    // TODO: Check method names
    changeMethods: ["permit_request"],
    viewMethods: ["nft_tokens_for_user"],
  });
  return contract;
}
