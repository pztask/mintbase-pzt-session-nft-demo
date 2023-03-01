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
import { mbjs } from "@mintbase-js/sdk";

import {
  WalletProvider,
  useWallet as useWalletOLD,
} from "./MintbaseWalletContext";
import { NearContract } from "../../lib/near";
import styles from "../../styles/Home.module.css";

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
  associateWallet?: () => Promise<void>;
  getUserNFTs?: () => Promise<Array<any>>;
}

export const PztMntbContext = createContext<PztMntbConsumer>({
  mntbWallet: null,
  mntbWalletConnected: false,
  pztSession: null,
  pztAuthenticated: false,
  userWalletMatches: UserWalletMatchStates.NO_WALLETS,
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
      contractAddress: "pztnft02.testnet",
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
      const permitResponse = nearContract.request_permit({
        user: (session as any)?.user?.id,
        wallet: activeAccountId,
      });
      // TODO: verify if request_permit was successful
    } else {
      // TODO: Error handling
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, activeAccountId, nearContract]);

  const getUserNFTs = useCallback(async () => {
    const response = await nearContract.nft_view({
      user: (session as any)?.user?.id,
    });

    // TODO: verify if nft_view was successful

    return response;
  }, [nearContract, session]);

  const mintNFT = useCallback(async () => {}, []);

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
