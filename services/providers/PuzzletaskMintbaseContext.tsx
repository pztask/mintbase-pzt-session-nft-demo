import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useRouter } from "next/router";

import { Wallet } from "mintbase";
import { EState, MbButton } from "mintbase-ui";
import { SessionProvider, signOut, useSession } from "next-auth/react";

import { WalletProvider, useWallet } from "./MintbaseWalletContext";
import styles from "../../styles/Home.module.css";

// TODO: Review props declaration
export const WalletConnectButton = ({
  wallet,
  isConnected,
  details,
}: {
  wallet: Wallet | undefined;
  isConnected: boolean;
  details: {
    accountId: string;
    balance: string;
    allowance: string;
    contractName: string;
  };
}) => {
  return (
    <MbButton
      label={
        isConnected ? `Disconnect ${details.accountId}` : "Connect NEAR wallet"
      }
      state={EState.ACTIVE}
      onClick={
        isConnected
          ? () => {
              wallet?.disconnect();
              window.location.reload();
            }
          : () => {
              wallet?.connect({ requestSignIn: true });
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
    wallet: Wallet | undefined;
    details: {
      accountId: string;
      balance: string;
      allowance: string;
      contractName: string;
    };
  } | null;
  mntbWalletConnected: boolean;
  pztSession: {
    userWallet: PztWallet | null;
    session: {
      email: string;
      id: number;
    };
  } | null;
  userWalletMatches: UserWalletMatchStates;
  pztAuthenticated: boolean;
  associateWallet?: () => void;
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
  const { status, data: session } = useSession();
  const { wallet, isConnected, details } = useWallet();
  const isSignedIn = status === "authenticated";

  useEffect(() => {
    if (isConnected && userWallet !== null) {
      if ("address" in userWallet && userWallet.address === details.accountId) {
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
  }, [isConnected, userWallet, details.accountId]);

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

  async function associateWallet() {
    const response = await fetch(
      `/api/user/${(session as any)?.user?.id}/wallet`,
      {
        method: "POST",
        body: JSON.stringify({
          address: details.accountId,
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
      await fetchUserWallet();
    } else {
      // TODO: Error handling
    }
  }

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

  function resolveContextValues() {
    const mntbWallet = isConnected
      ? {
          wallet,
          details,
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
      associateWallet: () => associateWallet(),
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
            wallet={wallet}
            isConnected={isConnected}
            details={details}
          />
        </div>
      </header>
      {children}
    </PztMntbContext.Provider>
  );
}

export const usePuzzletaskMintbaseContext = () =>
  useContext<PztMntbConsumer>(PztMntbContext);
