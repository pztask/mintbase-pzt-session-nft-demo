import { connect, Contract, keyStores } from "near-api-js";
import { Network } from "mintbase";

const NEAR_RPC_URL = process.env.NEAR_RPC_URL ?? "";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS ?? "";

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
    viewMethods: ["nft_tokens_for_user", "permit_for_user"],
  });
  return contract;
}
