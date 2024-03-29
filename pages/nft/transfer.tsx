import { useCallback, useEffect, useState } from "react";
import NFTViewer from "../../components/NFTViewer";
import {
  usePuzzletaskMintbaseContext,
  UserWalletMatchStates,
} from "../../services/providers/PuzzletaskMintbaseContext";
import styles from "../../styles/Home.module.css";

export default function TransferPage() {
  const {
    mntbWallet,
    associateWallet,
    userWalletMatches,
    contractReady,
    getUserNFTs,
    transferNFT,
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

  const nftAlreadyInWallet =
    userNFTs &&
    userNFTs.length > 0 &&
    userNFTs[0].owner_id === mntbWallet?.activeAccountId;

  const actionsEnabled =
    userWalletMatches === UserWalletMatchStates.USER_WALLET_MATCHES &&
    contractReady;

  function renderPageHeader() {
    let header = null;
    switch (userWalletMatches) {
      case UserWalletMatchStates.USER_WALLET_MATCHES:
        header = (
          <h1 className={styles.description}>
            Press the button to transfer your NFT (TODO: Check if there is an
            NFT)
          </h1>
        );
        if (userNFTs && userNFTs.length > 0) {
          header =
            userNFTs[0].owner_id === mntbWallet?.activeAccountId ? (
              <h1 className={styles.description}>
                Your NFT is already in this wallet
              </h1>
            ) : (
              <h1 className={styles.description}>
                Press the button to transfer your NFT to this wallet
              </h1>
            );
        } else {
          header = (
            <h1 className={styles.description}>Please mint your NFT first</h1>
          );
        }
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
        {actionsEnabled &&
          userNFTs &&
          userNFTs.length > 0 &&
          !nftAlreadyInWallet && (
            <input
              type="button"
              value="Transfer NFT"
              onClick={() => transferNFT && transferNFT(userNFTs[0].token_id)}
            />
          )}
      </main>
    </div>
  );
}
