import { useSession } from "next-auth/react";

export default function BurnPage() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <div>{isSignedIn ? <p>Signed IN</p> : <p>Please sign in first</p>}</div>
  );
}
