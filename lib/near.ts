import { connect, Contract, keyStores } from "near-api-js";
import { Network } from "mintbase";

const NEAR_RPC_URL = "https://rpc.testnet.near.org";
const CONTRACT_ADDRESS = "pztnft03.testnet";

export async function NearContract(
  accountId: string | null
): Promise<Contract> {
  accountId = accountId ? accountId : "";
  const keyStore = new keyStores.BrowserLocalStorageKeyStore();
  const connection = await connect({
    networkId: Network.testnet,
    keyStore: keyStore,
    masterAccount: accountId,
    nodeUrl: NEAR_RPC_URL,
    headers: {},
  });

  const nearAccount = await connection.account(accountId);

  const contract = new Contract(nearAccount, CONTRACT_ADDRESS, {
    changeMethods: [],
    viewMethods: ["nft_tokens_for_user"],
  });
  return contract;
}
