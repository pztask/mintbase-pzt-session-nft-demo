import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import { WalletProvider } from "../services/providers/MintbaseWalletContext";
import PuzzletaskMintbaseContext from "../services/providers/PuzzletaskMintbaseContext";

import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <WalletProvider apiKey={process.env.MINTBASEJS_API_KEY || ""}>
        <PuzzletaskMintbaseContext>
          <Component {...pageProps} />
        </PuzzletaskMintbaseContext>
      </WalletProvider>
    </SessionProvider>
  );
}
