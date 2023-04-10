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
    getUserPermit,
    contractReady,
    mintNFT,
    transferNFT,
    burnNFT,
    mntbWallet,
    mntbWalletConnected,
    pztAuthenticated,
  } = usePuzzletaskMintbaseContext();
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [userNFTs, setUserNFTs] = useState<any>(null);

  const [isLoadingPermit, setIsLoadingPermit] = useState(false);
  const [userPermit, setUserPermit] = useState<any>(null);

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

  const checkPermit = useCallback(async () => {
    const permit = getUserPermit && (await getUserPermit());
    setUserPermit(permit);
    // TODO: Review
    setIsLoadingPermit(false);
  }, [getUserPermit]);

  useEffect(() => {
    if (
      contractReady &&
      userWalletMatches === UserWalletMatchStates.USER_WALLET_MATCHES
    ) {
      setIsLoadingPermit(true);
      checkPermit();
    }
  }, [
    checkPermit,
    userWalletMatches,
    contractReady,
    mntbWalletConnected,
    pztAuthenticated,
  ]);

  const actionsEnabled =
    userWalletMatches === UserWalletMatchStates.USER_WALLET_MATCHES &&
    userPermit !== null &&
    userPermit.account_id === mntbWallet?.activeAccountId;
  const nftAlreadyInWallet =
    userNFTs &&
    userNFTs.length > 0 &&
    userNFTs[0].owner_id === mntbWallet?.activeAccountId;

  const mintEnabled = actionsEnabled && userNFTs && userNFTs.length === 0;
  const transferEnabled =
    actionsEnabled && userNFTs && userNFTs.length > 0 && !nftAlreadyInWallet;
  const burnEnabled =
    actionsEnabled && userNFTs && userNFTs.length > 0 && nftAlreadyInWallet;

  function renderPageHeader() {
    let header = null;
    switch (userWalletMatches) {
      case UserWalletMatchStates.USER_WALLET_MATCHES:
        if (isLoadingPermit) {
          header = <h1 className={styles.description}>Loading...</h1>;
        } else {
          if (
            userPermit === null ||
            userPermit.account_id !== mntbWallet?.activeAccountId
          ) {
            header = (
              <>
                <h1 className={styles.description}>
                  The verification process is running, please refresh the page.
                </h1>
                <MbButton
                  style={{ width: "15rem", height: "4rem" }}
                  label="Refresh"
                  size={ESize.BIG}
                  state={EState.ACTIVE}
                  onClick={() => location.reload()}
                />
              </>
            );
          } else if (mintEnabled) {
            header = (
              <h1 className={styles.description}>You can now mint your nft.</h1>
            );
          } else if (transferEnabled) {
            header = (
              <h1 className={styles.description}>
                Your NFT is not in this wallet. <br /> You can get it back it by
                pressing the transfer button.
              </h1>
            );
          } else {
            header = (
              <h1 className={styles.description}>
                Your NFT is in this wallet. <br /> You can now burn it, if you
                want to.
              </h1>
            );
          }
        }
        break;
      case UserWalletMatchStates.USER_WALLET_NOT_MATCHES:
        header = (
          <>
            <h1 className={styles.description} style={{ fontSize: "1.75rem" }}>
              <p>
                The User Session NFT belongs to your account and can be minted,
                transfered or burnt during this session.
              </p>
              <p>
                This wallet is not linked to your account.
                <br />
                In order to perform actions you need to link the wallet that
                will hold the NFT.
              </p>
              <p>
                Linking a wallet will have a fixed cost that will be used to
                maintain our verification process.
              </p>
              <p className={styles.description} style={{ width: "100%" }}>
                Do you want to link this wallet?
              </p>
            </h1>
            <MbButton
              style={{ width: "15rem", height: "4rem", marginBottom: "2rem" }}
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
            Please login using the upper right controls.
          </h1>
        );
        break;
      case UserWalletMatchStates.NO_MNTB_WALLET:
        header = (
          <h1 className={styles.description}>
            Please connect your wallet using the upper right controls.
          </h1>
        );
        break;
      default:
        header = (
          <h1 className={styles.description}>
            Please login and connect your wallet using the upper right controls.
          </h1>
        );
    }

    return header;
  }

  function renderNFT() {
    return (
      <>
        {isLoadingNFTs && <p>Loading NFT...</p>}
        {!isLoadingNFTs && userNFTs && userNFTs.length > 0 && (
          <NFTViewer nft={userNFTs[0]} />
        )}
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
            style={{ marginRight: "1rem", width: "15rem", height: "4rem" }}
            label="Mint NFT"
            size={ESize.BIG}
            state={mintEnabled ? EState.ACTIVE : EState.DISABLED}
            onClick={() => mintNFT && mintNFT()}
          />
          <MbButton
            style={{ marginRight: "1rem", width: "15rem", height: "4rem" }}
            label="Transfer NFT"
            size={ESize.BIG}
            state={transferEnabled ? EState.ACTIVE : EState.DISABLED}
            onClick={() => transferNFT && transferNFT(userNFTs[0].token_id)}
          />
          <MbButton
            style={{ width: "15rem", height: "4rem" }}
            label="Burn NFT"
            size={ESize.BIG}
            state={burnEnabled ? EState.ACTIVE : EState.DISABLED}
            onClick={() => burnNFT && burnNFT(userNFTs[0].token_id)}
          />
        </div>
      </main>
    </div>
  );
}
