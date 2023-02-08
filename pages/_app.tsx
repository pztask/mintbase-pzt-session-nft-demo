import type { AppProps } from "next/app";
import { EState, MbButton } from "mintbase-ui";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { WalletProvider } from "../services/providers/MintbaseWalletContext";
import { useWallet } from "../services/providers/MintbaseWalletContext";

import styles from "../styles/Home.module.css";
import "../styles/globals.css";
import { Wallet } from "mintbase";

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
  setIsSignedIn,
}: {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
}) => {
  const router = useRouter();

  const accountName = "Placeholder User";

  return (
    <MbButton
      style={{}}
      label={isSignedIn ? `${accountName}` : "Log in"}
      state={EState.ACTIVE}
      onClick={
        isSignedIn ? () => setIsSignedIn(false) : () => router.push("/login")
      }
    />
  );
};

export default function App({ Component, pageProps }: AppProps) {
  const { wallet, isConnected, details } = useWallet();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn && isConnected) {
      // user now has both connected
    } else if (!isSignedIn && isConnected) {
      // user now only has wallet connected
    } else if (isSignedIn && !isConnected) {
      // user now only has account connected
    } else {
      // fully disconnected
    }
  }, [isSignedIn, isConnected]);

  return (
    <WalletProvider apiKey={process.env.MINTBASEJS_API_KEY || ""}>
      <header className={styles.header}>
        <div className={styles["header-card"]}>
          <SignInButton isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
          <WalletConnectButton
            wallet={wallet}
            isConnected={isConnected}
            details={details}
          />
        </div>
      </header>
      <Component
        {...pageProps}
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
      />
    </WalletProvider>
  );
}
