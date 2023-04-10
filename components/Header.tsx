import Link from "next/link";
import { useRouter } from "next/router";

import PuzzletaskMintbaseProvider, {
  SignInButton,
  WalletConnectButton,
} from "../services/providers/PuzzletaskMintbaseContext";
import styles from "../styles/Home.module.css";

export default function Header() {
  const router = useRouter();

  return (
    <header className={styles["header"]}>
      <Link className={styles["header-title"]} href="/">
        Puzzletask + Mintbase / User Session NFT
      </Link>
      <div className={styles["header-card"]}>
        <SignInButton
        // isSignedIn={isSignedIn}
        // email={session?.user?.email ?? ""}
        />
        <WalletConnectButton
        // connect={connect}
        // disconnect={disconnect}
        // isConnected={isConnected}
        // activeAccountId={activeAccountId}
        />
      </div>
    </header>
  );
}
