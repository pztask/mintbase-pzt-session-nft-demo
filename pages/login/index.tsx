import { EState, MbButton, ESize } from "mintbase-ui";
import { useState } from "react";
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";

import styles from "../../styles/Home.module.css";

export default function LogInPage() {
  const { status } = useSession();
  const [emailText, setemailText] = useState("");
  const [passwordText, setPasswordText] = useState("");

  function renderAlreadyAuthenticated() {
    return <h1 className={styles.description}>You are already logged in</h1>;
  }

  function renderLogInForm() {
    return (
      <>
        <h1 className={styles.description}>Please fill in your credentials</h1>

        <div className={styles.grid}>
          <div className={styles["login-card"]}>
            <form className={styles["login-form"]}>
              <label>
                Email:
                <input
                  type="text"
                  name="email"
                  value={emailText}
                  onChange={(e) => setemailText(e.target.value)}
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
              <MbButton
                style={{ width: "100%" }}
                label="Link Wallet"
                size={ESize.BIG}
                state={EState.ACTIVE}
                onClick={() =>
                  signIn("credentials", {
                    email: emailText,
                    password: passwordText,
                    callbackUrl: "/",
                  })
                }
              />
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Log in</title>
        <meta name="description" content="Log in page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {status === "authenticated"
          ? renderAlreadyAuthenticated()
          : renderLogInForm()}
      </main>
    </div>
  );
}
