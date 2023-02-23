import {
  usePuzzletaskMintbaseContext,
  UserWalletMatchStates,
} from "../../services/providers/PuzzletaskMintbaseContext";
import styles from "../../styles/Home.module.css";

export default function BurnPage() {
  const { associateWallet, userWalletMatches } = usePuzzletaskMintbaseContext();

  const actionsEnabled =
    userWalletMatches === UserWalletMatchStates.USER_WALLET_MATCHES;

  function renderPageHeader() {
    let header = null;
    switch (userWalletMatches) {
      case UserWalletMatchStates.USER_WALLET_MATCHES:
        header = (
          <h1 className={styles.description}>
            Press the button to burn your NFT (TODO: Check if there is an NFT)
          </h1>
        );
        break;
      case UserWalletMatchStates.USER_WALLET_NOT_MATCHES:
        header = (
          <>
            <h1 className={styles.description}>
              Your near wallet does not match the wallet associated with your
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
        {renderPageHeader()}
        {actionsEnabled && (
          <input
            type="button"
            value="Burn NFT"
            onClick={() => alert("TODO!")}
          />
        )}
      </main>
    </div>
  );
}
