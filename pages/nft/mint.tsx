export default function Mint(props: {
  isSignedIn: boolean;
  setIsSignedIn: (value: boolean) => void;
}) {
  const { isSignedIn, setIsSignedIn } = props;
  return (
    <div>{isSignedIn ? <p>Signed IN</p> : <p>Please sign in first</p>}</div>
  );
}
