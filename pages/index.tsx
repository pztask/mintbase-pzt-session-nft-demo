import { EState, MbButton, ESize } from "mintbase-ui";
import Head from "next/head";
import Image from "next/image";

import {
  usePuzzletaskMintbaseContext,
  UserWalletMatchStates,
} from "../services/providers/PuzzletaskMintbaseContext";
import LinkWDisable from "../components/LinkWDisable";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Puzzletask X Mintbase NFT Demo </title>
        <meta name="description" content="Puzzletask X Mintbase NFT Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* <h1 className={styles.title}>Welcome to the demo!</h1> */}

        {renderPageHeader()}

        <div className={styles.grid}>
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
          {/* <LinkWDisable
            disabled={!actionsEnabled}
            enabledHref={"/nft/mint"}
            enabledClassName={styles.card}
            disabledClassName={styles.card}
          >
            <h2>Mint NFT &rarr;</h2>
          </LinkWDisable>
          <LinkWDisable
            disabled={!actionsEnabled}
            enabledHref={"/nft/transfer"}
            enabledClassName={styles.card}
            disabledClassName={styles.card}
          >
            <h2>Transfer NFT &rarr;</h2>
          </LinkWDisable>
          <LinkWDisable
            disabled={!actionsEnabled}
            enabledHref={"/nft/burn"}
            enabledClassName={styles.card}
            disabledClassName={styles.card}
          >
            <h2>Burn NFT &rarr;</h2>
          </LinkWDisable> */}
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
