import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { EState, MbButton, ESize } from "mintbase-ui";
import Head from "next/head";
import Image from "next/image";

import NFTViewer from "../components/NFTViewer";
import {
  usePuzzletaskMintbaseContext,
  UserWalletMatchStates,
} from "../services/providers/PuzzletaskMintbaseContext";
import LinkWDisable from "../components/LinkWDisable";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const {
    associateWallet,
    userWalletMatches,
    getUserNFTs,
    contractReady,
    mintNFT,
    mntbWalletConnected,
    pztAuthenticated,
  } = usePuzzletaskMintbaseContext();
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [userNFTs, setUserNFTs] = useState<any>(null);

  const onLoad = useCallback(async () => {
    const nfts = getUserNFTs && (await getUserNFTs());
    setUserNFTs(nfts);
  }, [getUserNFTs]);

  useEffect(() => {
    if (contractReady && mntbWalletConnected && pztAuthenticated) {
      setIsLoadingNFTs(true);
      onLoad();
    }
  }, [onLoad, contractReady, mntbWalletConnected, pztAuthenticated]);

  useEffect(() => {
    if (userNFTs !== null) {
      setIsLoadingNFTs(false);
    }
  }, [userNFTs]);

  const actionsEnabled =
    userWalletMatches === UserWalletMatchStates.USER_WALLET_MATCHES;

  function renderPageHeader() {
    let header = null;
    switch (userWalletMatches) {
      case UserWalletMatchStates.USER_WALLET_MATCHES:
        header = (
          <h1 className={styles.description}>
            You are ready to perform actions.
          </h1>
        );
        break;
      case UserWalletMatchStates.USER_WALLET_NOT_MATCHES:
        header = (
          <>
            <h1 className={styles.description}>
              The User Session NFT belongs to your account and can be minted,
              transfered or burnt during this session. <br />
              This wallet is not linked to your account. In order to perform
              actions you need to link the wallet that will hold the NFT.
              <br />
              Linking a wallet will have a fixed cost that will be used to
              maintain our verification process.
              <br />
              Do yo want to link this wallet?
            </h1>
            <MbButton
              style={{ width: "15rem" }}
              label="Link Wallet"
              size={ESize.BIG}
              state={EState.ACTIVE}
              onClick={() => associateWallet && associateWallet()}
            />
          </>
        );
        break;
      case UserWalletMatchStates.NO_USER_WALLET:
        header = (
          <h1 className={styles.description}>
            Please login <br /> using the upper right controls.
          </h1>
        );
        break;
      case UserWalletMatchStates.NO_MNTB_WALLET:
        header = (
          <h1 className={styles.description}>
            Please connect your wallet <br /> using the upper right controls.
          </h1>
        );
        break;
      default:
        header = (
          <h1 className={styles.description}>
            Please login and connect your wallet <br /> using the upper right
            controls.
          </h1>
        );
    }

    return header;
  }

  function renderNFT() {
    return (
      <>
        {actionsEnabled && isLoadingNFTs && <p>Loading NFT...</p>}
        {actionsEnabled &&
          !isLoadingNFTs &&
          userNFTs &&
          userNFTs.length > 0 && <NFTViewer nft={userNFTs[0]} />}
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Puzzletask X Mintbase NFT Demo </title>
        <meta name="description" content="Puzzletask X Mintbase NFT Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {renderPageHeader()}

        {renderNFT()}

        <div className={styles.grid} style={{ marginTop: "4rem" }}>
          <MbButton
            style={{ marginRight: "1rem", width: "15rem" }}
            label="Mint NFT"
            size={ESize.BIG}
            state={actionsEnabled ? EState.ACTIVE : EState.DISABLED}
            onClick={() => router.push("/nft/mint")}
          />
          <MbButton
            style={{ marginRight: "1rem", width: "15rem" }}
            label="Transfer NFT"
            size={ESize.BIG}
            state={actionsEnabled ? EState.ACTIVE : EState.DISABLED}
            onClick={() => router.push("/nft/transfer")}
          />
          <MbButton
            style={{ width: "15rem" }}
            label="Burn NFT"
            size={ESize.BIG}
            state={actionsEnabled ? EState.ACTIVE : EState.DISABLED}
            onClick={() => router.push("/nft/burn")}
          />
        </div>
      </main>
    </div>
  );
}
