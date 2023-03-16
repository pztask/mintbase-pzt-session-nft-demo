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
import { EState, MbButton, ESize } from "mintbase-ui";
import { signOut, useSession } from "next-auth/react";
import { execute, mbjs, burn } from "@mintbase-js/sdk";

import { NearContract } from "../../lib/near";
import styles from "../../styles/Home.module.css";
import {
  burnUserBoundNFT,
  getUserNFTs as pztGetUserNFTs,
  mintUserBoundNFT,
  permitRequest,
  transferUserBoundNFT,
} from "../../lib/puzzletaskHelpers";

const CONTRACT_ADRESS = process.env.CONTRACT_ADDRESS ?? "";

// TODO: Review props declaration
export function WalletConnectButton(/* {
  isConnected,
  connect,
  disconnect,
  activeAccountId,
}: {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  activeAccountId: string | null;
} */) {
  const { connect, disconnect, activeAccountId, isConnected } = useWallet();

  return (
    <MbButton
      style={{ height: "4rem", width: "20rem" }}
      label={
        isConnected ? `Disconnect ${activeAccountId}` : "Connect NEAR wallet"
      }
      size={ESize.BIG}
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
}

export function SignInButton(/* {
  isSignedIn,
  email,
}: {
  isSignedIn: boolean;
  email: string;
} */) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const isSignedIn = status === "authenticated";

  return (
    <MbButton
      style={{ height: "4rem", width: "20rem", marginRight: "1rem" }}
      label={isSignedIn ? `Log out ${session?.user?.email ?? ""}` : "Log in"}
      state={EState.ACTIVE}
      size={ESize.BIG}
      onClick={isSignedIn ? () => signOut() : () => router.push("/login")}
    />
  );
}

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
  burnNFT?: (tokenId: string) => Promise<void>;
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
      contractAddress: CONTRACT_ADRESS,
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
      const userId = (session as any)?.user?.id;
      const permitRequestCall = permitRequest({
        contractAddress: CONTRACT_ADRESS,
        userId: userId,
      });
      const permitResponse = await execute({ wallet }, permitRequestCall).catch(
        (e) => {
          console.log(e);
        }
      );
      // TODO: verify if request_permit was successful
    } else {
      // TODO: Error handling
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, activeAccountId, nearContract]);

  const getUserNFTs = useCallback(async () => {
    return await pztGetUserNFTs({
      nearContract: nearContract,
      userId: (session as any)?.user?.id,
    });
  }, [nearContract, session]);

  const mintNFT = useCallback(async () => {
    const wallet = await selector.wallet();
    const mintCall = mintUserBoundNFT({
      contractAddress: CONTRACT_ADRESS,
      receiverId: activeAccountId ?? "",
      userId: (session as any)?.user?.id,
      metadata: {
        title: "PZT Token " + new Date().toLocaleString("en-US"),
        description: "I'm a PZT User Bound Token.",
      },
    });
    await execute({ wallet }, mintCall).catch((e) => {
      alert(e);
    });
  }, [selector, activeAccountId, session]);

  const transferNFT = useCallback(
    async (tokenId: string) => {
      const wallet = await selector.wallet();
      const transferCall = transferUserBoundNFT({
        contractAddress: CONTRACT_ADRESS,
        receiverId: activeAccountId ?? "",
        tokenId: tokenId,
      });
      await execute({ wallet }, transferCall).catch((e) => {
        alert(e);
      });
    },
    [selector, activeAccountId]
  );

  const burnNFT = useCallback(
    async (tokenId: string) => {
      const wallet = await selector.wallet();
      const burnCall = burnUserBoundNFT({
        contractAddress: CONTRACT_ADRESS,
        tokenId: tokenId,
      });
      await execute({ wallet }, burnCall).catch((e) => {
        alert(e);
      });
    },
    [selector]
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
      burnNFT: burnNFT,
      contractReady: nearContract !== null,
    };
  }

  const contextValues = useMemo(
    () => resolveContextValues(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isConnected, isSignedIn, session, userWalletMatches, nearContract]
  );

  return (
    <PztMntbContext.Provider value={contextValues}>
      {/* <header className={styles["header-actions"]}>
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
      </header> */}
      {children}
    </PztMntbContext.Provider>
  );
}

export const usePuzzletaskMintbaseContext = () =>
  useContext<PztMntbConsumer>(PztMntbContext);
