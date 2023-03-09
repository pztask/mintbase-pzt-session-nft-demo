import { useCallback, useEffect, useMemo, useState } from "react";
import NFTViewer from "../../components/NFTViewer";
import {
  usePuzzletaskMintbaseContext,
  UserWalletMatchStates,
} from "../../services/providers/PuzzletaskMintbaseContext";
import styles from "../../styles/Home.module.css";

export default function MintPage() {
  const {
    associateWallet,
    userWalletMatches,
    getUserNFTs,
    contractReady,
    mintNFT,
  } = usePuzzletaskMintbaseContext();
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [userNFTs, setUserNFTs] = useState<any>(null);

  const onLoad = useCallback(async () => {
    const nfts = getUserNFTs && (await getUserNFTs());
    setUserNFTs(nfts);
  }, [getUserNFTs]);

  useEffect(() => {
    if (contractReady) {
      setIsLoadingNFTs(true);
      onLoad();
    }
  }, [onLoad, contractReady]);

  useEffect(() => {
    if (userNFTs !== null) {
      setIsLoadingNFTs(false);
    }
  }, [userNFTs]);

  const actionsEnabled =
    userWalletMatches === UserWalletMatchStates.USER_WALLET_MATCHES &&
    contractReady;

  function renderPageHeader() {
    let header = null;
    switch (userWalletMatches) {
      case UserWalletMatchStates.USER_WALLET_MATCHES:
        header =
          userNFTs && userNFTs.length === 0 ? (
            <h1 className={styles.description}>
              Press the button to mint your NFT (TODO: Check if there is an NFT)
            </h1>
          ) : (
            <h1 className={styles.description}>
              You already minted an nft. Burn it to be able to mint again.
            </h1>
          );
        break;
      case UserWalletMatchStates.USER_WALLET_NOT_MATCHES:
        header = (
          <>
            <h1 className={styles.description}>
              Your Near wallet does not match the wallet associated with your
              account. Associate this wallet?
            </h1>
            <input
              type="button"
              value="Associate Wallet"
              onClick={() => associateWallet && associateWallet()}
            />
          </>
        );
        break;
      case UserWalletMatchStates.NO_USER_WALLET:
        header = <h1 className={styles.description}>Please login.</h1>;
        break;
      case UserWalletMatchStates.NO_MNTB_WALLET:
        header = (
          <h1 className={styles.description}>Please connect your wallet.</h1>
        );
        break;
      default:
        header = (
          <h1 className={styles.description}>
            Please login and connect your wallet.
          </h1>
        );
    }

    return header;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {isLoadingNFTs && <p>Loading NFT...</p>}
        {!isLoadingNFTs && userNFTs && userNFTs.length > 0 && (
          <NFTViewer nft={userNFTs[0]} />
        )}
        {renderPageHeader()}
        {/* {actionsEnabled && userNFTs && userNFTs.length === 0 || true && ( */}
        {true && (
          <input
            type="button"
            value="Mint NFT"
            onClick={() => mintNFT && mintNFT()}
          />
        )}
      </main>
    </div>
  );
}
