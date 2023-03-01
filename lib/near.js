import { connect, Contract, keyStores } from "near-api-js";
import { Network } from "mintbase";

const NEAR_RPC_URL = "https://rpc.testnet.near.org";
const CONTRACT_ADDRESS = "pztnft02.testnet";

export async function NearContract(accountId) {
  const test = new keyStores.BrowserLocalStorageKeyStore();

  const connection = await connect({
    networkId: Network.testnet,
    keyStore: test,
    masterAccount: accountId,
    nodeUrl: NEAR_RPC_URL,
  });
  const nearAccount = await connection.account(accountId);
  debugger;
  return new Contract(nearAccount, CONTRACT_ADDRESS, {
    // TODO: Check method names
    changeMethods: ["request_permit"],
    viewMethods: ["nft_view"],
  });
}
