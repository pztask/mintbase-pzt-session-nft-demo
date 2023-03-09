import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import { useWallet } from "@mintbase-js/react";
import { Wallet } from "mintbase";
import { EState, MbButton } from "mintbase-ui";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { execute, mbjs, mint } from "@mintbase-js/sdk";
import { v4 as uuidv4 } from "uuid";

import {
  WalletProvider,
  useWallet as useWalletOLD,
} from "./MintbaseWalletContext";
import { NearContract } from "../../lib/near";
import styles from "../../styles/Home.module.css";

const GAS = "300000000000000";

// TODO: Review props declaration
export const WalletConnectButton = ({
  isConnected,
  connect,
  disconnect,
  activeAccountId,
}: {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  activeAccountId: string | null;
}) => {
  return (
    <MbButton
      label={
        isConnected ? `Disconnect ${activeAccountId}` : "Connect NEAR wallet"
      }
      state={EState.ACTIVE}
      onClick={
        isConnected
          ? () => {
              disconnect();
              window.location.reload(); // TODO: Check if needed
            }
          : () => {
              connect();
            }
      }
    />
  );
};

export const SignInButton = ({
  isSignedIn,
  email,
}: {
  isSignedIn: boolean;
  email: string;
}) => {
  const router = useRouter();

  return (
    <MbButton
      style={{}}
      label={isSignedIn ? `Log out ${email}` : "Log in"}
      state={EState.ACTIVE}
      onClick={isSignedIn ? () => signOut() : () => router.push("/login")}
    />
  );
};

interface PzMntbProviderProps {
  children?: ReactNode;
}

const EMPTY_ADDRESS = "empty";

export enum UserWalletMatchStates {
  NO_WALLETS = "no_wallets",
  NO_USER_WALLET = "no_user_wallet",
  NO_MNTB_WALLET = "no_mntb_wallet",
  USER_WALLET_MATCHES = "user_wallet_matches",
  USER_WALLET_NOT_MATCHES = "user_wallet_not_matches",
}

interface PztWallet {
  id: number;
  address: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PztMntbConsumer {
  mntbWallet: {
    activeAccountId: string;
  } | null;
  mntbWalletConnected: boolean;
  pztSession: {
    userWallet: PztWallet | null;
    session: {
      email: string;
      id: number;
    };
  } | null;
  pztAuthenticated: boolean;
  userWalletMatches: UserWalletMatchStates;
  contractReady: boolean;
  associateWallet?: () => Promise<void>;
  getUserNFTs?: () => Promise<Array<any>>;
  mintNFT?: () => Promise<void>;
  transferNFT?: (tokenId: string) => Promise<void>;
}

export const PztMntbContext = createContext<PztMntbConsumer>({
  mntbWallet: null,
  mntbWalletConnected: false,
  pztSession: null,
  pztAuthenticated: false,
  userWalletMatches: UserWalletMatchStates.NO_WALLETS,
  contractReady: false,
});

// TODO: Review component name/role
export default function PuzzletaskMintbaseProvider({
  children,
}: PzMntbProviderProps) {
  const [userWallet, setUserWallet] = useState<PztWallet | null>(null);
  const [userWalletMatches, setUserWalletMatches] = useState(
    UserWalletMatchStates.NO_USER_WALLET
  );
  const [nearContract, setNearContract] = useState<any>(null);
  const { status, data: session } = useSession();
  const {
    connect,
    disconnect,
    activeAccountId,
    selector,
    isConnected,
    errorMessage,
  } = useWallet();
  const isSignedIn = status === "authenticated";

  // Set up mintbase sdk
  useEffect(() => {
    const config = {
      network: "testnet",
      contractAddress: "pztnft03.testnet",
    };
    mbjs.config(config);
    console.log("global keys of all mintbase-js packages", mbjs.keys);
  }, []);

  // Create contract connection for direct interaction
  async function handleContractSet() {
    const contract = await NearContract(activeAccountId);
    setNearContract(contract);
  }

  useEffect(() => {
    if (isConnected) {
      handleContractSet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  // Check account/wallet relation status
  useEffect(() => {
    if (isConnected && userWallet !== null) {
      if ("address" in userWallet && userWallet.address === activeAccountId) {
        setUserWalletMatches(UserWalletMatchStates.USER_WALLET_MATCHES);
      } else {
        setUserWalletMatches(UserWalletMatchStates.USER_WALLET_NOT_MATCHES);
      }
    } else if (isConnected && userWallet === null) {
      setUserWalletMatches(UserWalletMatchStates.NO_USER_WALLET);
    } else if (!isConnected && userWallet !== null) {
      setUserWalletMatches(UserWalletMatchStates.NO_MNTB_WALLET);
    } else if (!isConnected && userWallet === null) {
      setUserWalletMatches(UserWalletMatchStates.NO_WALLETS);
    }
  }, [isConnected, userWallet, activeAccountId]);

  async function fetchUserWallet() {
    const response = await fetch(
      `/api/user/${(session as any)?.user?.id}/wallet`
    ).then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 404) {
        return { address: EMPTY_ADDRESS };
      } else {
        return null;
      }
    });

    setUserWallet(response);
  }

  // Handle local state var userWallet
  useEffect(() => {
    // User logged in
    if (isSignedIn && userWallet === null) {
      fetchUserWallet();
    }
    // User logged out
    if (!isSignedIn && userWallet !== null) {
      setUserWallet(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, isConnected, userWallet]);

  const associateWallet = useCallback(async () => {
    const response = await fetch(
      `/api/user/${(session as any)?.user?.id}/wallet`,
      {
        method: "POST",
        body: JSON.stringify({
          address: activeAccountId,
        }),
      }
    ).then((response) => {
      if (response.ok) {
        return 1;
      } else {
        return null;
      }
    });

    if (response !== null) {
      // Get wallet data
      await fetchUserWallet();
      // Request permit to contract

      const wallet = await selector.wallet();
      const permitResponse = await wallet
        .signAndSendTransaction({
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "permit_request",
                args: { user_id: (session as any)?.user?.id },
                gas: GAS,
                deposit: "100000000000000000000000",
              },
            },
          ],
        })
        .catch((e) => {});
      // TODO: verify if request_permit was successful
    } else {
      // TODO: Error handling
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, activeAccountId, nearContract]);

  const getUserNFTs = useCallback(async () => {
    const response = await nearContract.nft_tokens_for_user({
      user_id: (session as any)?.user?.id,
    });
    // TODO: verify if nft_view was successful

    return response;
  }, [nearContract, session]);

  const mintNFT = useCallback(async () => {
    const wallet = await selector.wallet();

    const mintResponse = await wallet
      .signAndSendTransaction({
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "nft_mint",
              args: {
                receiver_id: activeAccountId,
                token_id: uuidv4(),
                metadata: {
                  title: "My Non Fungible Team Token 42",
                  description: "The Team Most Certainly Goes 2:)",
                  extra: JSON.stringify({
                    user_id: (session as any)?.user?.id,
                  }),
                },
              },
              gas: GAS,
              deposit: "100000000000000000000000",
            },
          },
        ],
      })
      .catch((e) => {});
  }, [selector, activeAccountId, session]);

  const transferNFT = useCallback(
    async (tokenId: string) => {
      const wallet = await selector.wallet();

      const transferResponse = await wallet
        .signAndSendTransaction({
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "nft_transfer",
                args: {
                  receiver_id: activeAccountId,
                  token_id: tokenId,
                },
                gas: GAS,
                deposit: "1",
              },
            },
          ],
        })
        .catch((e) => {});
    },
    [selector, activeAccountId]
  );

  function resolveContextValues() {
    const mntbWallet = isConnected
      ? {
          activeAccountId: activeAccountId ?? "",
        }
      : null;
    const mntbWalletConnected = isConnected;

    const pztSession = isSignedIn
      ? {
          userWallet: userWallet,
          session: {
            id: (session as any)?.user.id ?? "",
            email: session?.user?.email ?? "",
          },
        }
      : null;
    const pztAuthenticated = isSignedIn;

    return {
      mntbWallet,
      mntbWalletConnected,
      pztSession,
      pztAuthenticated,
      userWalletMatches,
      associateWallet: associateWallet,
      getUserNFTs: getUserNFTs,
      mintNFT: mintNFT,
      transferNFT: transferNFT,
      contractReady: nearContract !== null,
    };
  }

  const contextValues = useMemo(
    () => resolveContextValues(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isConnected, isSignedIn, session, userWalletMatches]
  );

  return (
    <PztMntbContext.Provider value={contextValues}>
      <header className={styles.header}>
        <div className={styles["header-card"]}>
          <SignInButton
            isSignedIn={isSignedIn}
            email={session?.user?.email ?? ""}
          />
          <WalletConnectButton
            connect={connect}
            disconnect={disconnect}
            isConnected={isConnected}
            activeAccountId={activeAccountId}
          />
        </div>
      </header>
      {children}
    </PztMntbContext.Provider>
  );
}

export const usePuzzletaskMintbaseContext = () =>
  useContext<PztMntbConsumer>(PztMntbContext);
