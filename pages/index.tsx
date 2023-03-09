import Head from "next/head";
import Image from "next/image";

import {
  usePuzzletaskMintbaseContext,
  UserWalletMatchStates,
} from "../services/providers/PuzzletaskMintbaseContext";
import LinkWDisable from "../components/LinkWDisable";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { pztAuthenticated, associateWallet, userWalletMatches } =
    usePuzzletaskMintbaseContext();

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
      <Head>
        <title>Puzzletask X Mintbase NFT Demo </title>
        <meta name="description" content="Puzzletask X Mintbase NFT Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the demo!</h1>

        {renderPageHeader()}

        <div className={styles.grid}>
          <LinkWDisable
            disabled={!actionsEnabled}
            enabledHref={"/nft/mint"}
            enabledClassName={styles.card}
            disabledClassName={styles.card}
          >
            <h2>Mint NFT &rarr;</h2>
            <p>WIP</p>
          </LinkWDisable>
          <LinkWDisable
            disabled={!actionsEnabled}
            enabledHref={"/nft/transfer"}
            enabledClassName={styles.card}
            disabledClassName={styles.card}
          >
            <h2>Transfer NFT &rarr;</h2>
            <p>WIP</p>
          </LinkWDisable>
          <LinkWDisable
            disabled={!actionsEnabled}
            enabledHref={"/nft/burn"}
            enabledClassName={styles.card}
            disabledClassName={styles.card}
          >
            <h2>Burn NFT &rarr;</h2>
            <p>WIP</p>
          </LinkWDisable>
          <LinkWDisable
            disabled={pztAuthenticated}
            enabledHref={"/login"}
            enabledClassName={styles.card}
            disabledClassName={styles.card}
          >
            <h2>Log In &rarr;</h2>
            <p>WIP</p>
          </LinkWDisable>
        </div>
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
}
