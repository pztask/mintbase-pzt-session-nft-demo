import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { WalletContextProvider } from "@mintbase-js/react";
import "@near-wallet-selector/modal-ui/styles.css";

import PuzzletaskMintbaseContext from "../services/providers/PuzzletaskMintbaseContext";

import "../styles/globals.css";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <WalletContextProvider>
        <PuzzletaskMintbaseContext>
          <>
            <Header />
            <Component {...pageProps} />
          </>
        </PuzzletaskMintbaseContext>
      </WalletContextProvider>
    </SessionProvider>
  );
}
