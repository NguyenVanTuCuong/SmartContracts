import { ethers } from "hardhat";
import { BaseContract } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Address } from "web3";
import { OrchidAuctionFactory, OrchidNFTCollectible } from "../typechain-types";

export const initialize = async (): Promise<InitializeResult> => {
  const signers = await ethers.getSigners();

  //nft
  const nft = await ethers.getContractFactory("OrchidNFTCollectible");
  const nftContract = await nft.deploy();
  const nftContractAddress = await nftContract.getAddress();

  //factory
  const factory = await ethers.getContractFactory("OrchidAuctionFactory");
  const factoryContract = await factory.deploy(nftContractAddress);
  const factoryContractAddress = await factoryContract.getAddress();

  return {
    signers,
    nft: {
      contract: nftContract,
      address: nftContractAddress,
    },
    factory: {
      contract: factoryContract,
      address: factoryContractAddress,
    },
  };
};

export interface InitializeResult {
  signers: Array<HardhatEthersSigner>;
  nft: {
    contract: OrchidNFTCollectible;
    address: Address;
  };
  factory: {
    contract: OrchidAuctionFactory ;
    address: Address;
  };
}
