import {
  DEPOSIT_FOR_BURN,
  DEPOSIT_FOR_PERMIT_REQUEST,
  DEPOSIT_FOR_TRANSFER,
  GAS,
  STORAGE_BYTES,
  STORAGE_PRICE_PER_BYTE_EXPONENT,
  CONTRACT_METHOD_NAMES,
} from "./constants";
import { Contract } from "near-api-js";
import type { NearContractCall, TokenMetadata } from "@mintbase-js/sdk";
import { v4 as uuid } from "uuid";

type mintUserBoundNFTArgs = {
  contractAddress: string;
  receiverId: string;
  metadata: TokenMetadata;
  userId: string;
};

type mintUserBoundNFTArgsResponse = {
  receiver_id: string;
  token_id: string;
  metadata: TokenMetadata;
};

type transferUserBoundNFTArgs = {
  contractAddress: string;
  receiverId: string;
  tokenId: string;
};

type transferUserBoundNFTArgsResponse = {
  receiver_id: string;
  token_id: string;
};

type burnUserBoundNFTArgs = {
  contractAddress: string;
  tokenId: string;
};

type burnUserBoundNFTArgsResponse = {
  token_id: string;
};

type permitRequestArgs = {
  contractAddress: string;
  userId: string;
};

type permitRequestArgsResponse = {
  user_id: string;
};

type getUserNFTsArgs = {
  nearContract: Contract | any;
  userId: string;
};

type getUserPermitArgs = {
  nearContract: Contract | any;
  userId: string;
};

function mintingDeposit({ metadata }: { metadata: TokenMetadata }): string {
  const bytesPerToken = STORAGE_BYTES.TOKEN_BASE * STORAGE_BYTES.COMMON;
  const metadataBytesEstimate = JSON.stringify(metadata).length;

  const totalBytes =
    STORAGE_BYTES.MINTING_BASE +
    STORAGE_BYTES.MINTING_FEE +
    metadataBytesEstimate +
    bytesPerToken +
    STORAGE_BYTES.COMMON;

  return `${Math.ceil(totalBytes)}${"0".repeat(
    STORAGE_PRICE_PER_BYTE_EXPONENT
  )}`;
}

export const mintUserBoundNFT = function (
  args: mintUserBoundNFTArgs
): NearContractCall<mintUserBoundNFTArgsResponse> {
  const { contractAddress, receiverId, metadata, userId } = args;
  metadata["extra"] = JSON.stringify({
    user_id: userId,
  });
  return {
    contractAddress: contractAddress,
    args: {
      receiver_id: receiverId,
      token_id: uuid(),
      metadata: metadata,
    },
    methodName: CONTRACT_METHOD_NAMES.MINT,
    gas: GAS,
    deposit: mintingDeposit({ metadata }),
  };
};

export const transferUserBoundNFT = function (
  args: transferUserBoundNFTArgs
): NearContractCall<transferUserBoundNFTArgsResponse> {
  const { contractAddress, receiverId, tokenId } = args;
  return {
    contractAddress: contractAddress,
    args: {
      receiver_id: receiverId,
      token_id: tokenId,
    },
    methodName: CONTRACT_METHOD_NAMES.TRANSFER,
    gas: GAS,
    deposit: DEPOSIT_FOR_TRANSFER,
  };
};

export const burnUserBoundNFT = function (
  args: burnUserBoundNFTArgs
): NearContractCall<burnUserBoundNFTArgsResponse> {
  const { contractAddress, tokenId } = args;
  return {
    contractAddress: contractAddress,
    args: {
      token_id: tokenId,
    },
    methodName: CONTRACT_METHOD_NAMES.BURN,
    gas: GAS,
    deposit: DEPOSIT_FOR_BURN,
  };
};

export const permitRequest = function (
  args: permitRequestArgs
): NearContractCall<permitRequestArgsResponse> {
  const { contractAddress, userId } = args;
  return {
    contractAddress: contractAddress,
    args: {
      user_id: userId,
    },
    methodName: CONTRACT_METHOD_NAMES.PERMIT_REQUEST,
    gas: GAS,
    deposit: DEPOSIT_FOR_PERMIT_REQUEST,
  };
};

export const getUserNFTs = async function (
  args: getUserNFTsArgs
): Promise<Array<any>> {
  /*
  We used the near-api-js for this call because
  we couldn't find a way to make call without
  signing them through @mintbase-js/sdk
  */
  const response = await args.nearContract
    .nft_tokens_for_user({
      user_id: args.userId,
    })
    .catch((e: any) => {
      alert(e);
    });
  return response;
};

export const getUserPermit = async function (
  args: getUserPermitArgs
): Promise<Array<any>> {
  /*
  We used the near-api-js for this call because
  we couldn't find a way to make call without
  signing them through @mintbase-js/sdk
  */
  const response = await args.nearContract
    .permit_for_user({
      user_id: args.userId,
    })
    .catch((e: any) => {
      alert(e);
    });
  return response;
};
