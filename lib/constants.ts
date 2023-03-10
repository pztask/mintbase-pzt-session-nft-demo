import { utils } from "near-api-js";

export const GAS = "200000000000000";
export const ONE_YOCTO = "1";
export const DEPOSIT_FOR_BURN = ONE_YOCTO;
export const DEPOSIT_FOR_TRANSFER = ONE_YOCTO;
export const DEPOSIT_FOR_PERMIT_REQUEST = utils.format.parseNearAmount("0.1");

export const CONTRACT_METHOD_NAMES = {
  MINT: "nft_mint",
  TRANSFER: "nft_transfer",
  BURN: "nft_burn",
  PERMIT_REQUEST: "permit_request",
};

export const STORAGE_BYTES = {
  COMMON: 80, // one royalty owner, one split owner, or one approval
  TOKEN_BASE: 440,
  MINTING_BASE: 92,
  MINTING_FEE: 100, // minting fee of 1 milliNEAR expressed as bytes
};

// currently 19, meaning that 1 bytes costs 1e19 yoctoNEAR
export const STORAGE_PRICE_PER_BYTE_EXPONENT = 19;
