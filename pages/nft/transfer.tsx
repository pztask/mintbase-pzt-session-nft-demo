import { useSession } from "next-auth/react";

export default function TransferPage() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <div>{isSignedIn ? <p>Signed IN</p> : <p>Please sign in first</p>}</div>
  );
}
