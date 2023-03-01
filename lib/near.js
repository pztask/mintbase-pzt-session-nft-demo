import { connect, Contract } from "near-api-js";
import { Network } from "mintbase";

const NEAR_RPC_URL = process.env.NEAR_RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

export async function NearContract(wallet) {
  const { accountId } = wallet.activeAccount;
  const connection = await connect({
    networkId: Network.testnet,
    keyStore: wallet.keyStore,
    masterAccount: accountId,
    nodeUrl: NEAR_RPC_URL,
  });
  const nearAccount = await connection.account(accountId);

  return new Contract(nearAccount, CONTRACT_ADDRESS, {
    // TODO: Check method names
    changeMethods: ["request_permit"],
    viewMethods: ["nft_view"],
  });
}
