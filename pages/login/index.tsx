import { useState } from "react";
import Head from "next/head";

import styles from "../../styles/Home.module.css";

export default function LogInPage(props: {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
}) {
  const { isSignedIn, setIsSignedIn } = props;
  const [usernameText, setUsernameText] = useState("");
  const [passwordText, setPasswordText] = useState("");

  return (
    <div className={styles.container}>
      <Head>
        <title>Log in</title>
        <meta name="description" content="Log in page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.description}>
          Please login and connect your wallet.
        </h1>

        <div className={styles.grid}>
          <div className={styles["login-card"]}>
            <form className={styles["login-form"]}>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={usernameText}
                  onChange={(e) => setUsernameText(e.target.value)}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={passwordText}
                  onChange={(e) => setPasswordText(e.target.value)}
                />
              </label>
              <input
                type="button"
                value="Submit"
                onClick={() => setIsSignedIn(true)}
              />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
