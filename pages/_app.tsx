import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { WalletContextProvider } from "@mintbase-js/react";
import "@near-wallet-selector/modal-ui/styles.css";

// import { WalletProvider } from "../services/providers/MintbaseWalletContext";
import PuzzletaskMintbaseContext from "../services/providers/PuzzletaskMintbaseContext";

import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <WalletContextProvider>
        <PuzzletaskMintbaseContext>
          <Component {...pageProps} />
        </PuzzletaskMintbaseContext>
      </WalletContextProvider>
    </SessionProvider>
  );
}
