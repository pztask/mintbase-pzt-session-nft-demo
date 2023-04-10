export default function NFTViewer({ nft }: any) {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #eaeaea",
        borderRadius: "10px",
      }}
    >
      <p>
        <b>Your NFT</b>
      </p>
      <p>Token Id: {nft.token_id}</p>
      <p>Title: {nft.metadata.title}</p>
      <p>Description: {nft.metadata.description}</p>
      <p>Wallet: {nft.owner_id}</p>
    </div>
  );
}
