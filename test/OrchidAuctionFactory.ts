import { ethers } from "hardhat";
import { InitializeResult, initialize } from "./Initialize";
import { expect } from "chai";

describe("OrchidAuctionFactory", () => {
  let _initialize: InitializeResult;

  before("initialize", async () => {
    _initialize = await initialize();
  });

  it("should create auction successfully", async () => {
    const { factory, nft, signers } = _initialize;
    await nft.contract.mint(signers[1].address, "cuongdeptrai");
    await nft.contract.connect(signers[1]).approve(factory.address, BigInt(0));
    const auctionAddress = await factory.contract.connect(signers[1]).getFunction("initializeAuction").staticCall(BigInt(0), "1000000000000000000", {
      value: "100000000000000000"
    });
    await factory.contract.connect(signers[1]).initializeAuction(BigInt(0), "1000000000000000000", {
      value: "100000000000000000"
    });
    const auctionContract = await ethers.getContractAt("OrchidAuction", auctionAddress)
    expect(await auctionContract._initialAmount()).to.be.eq("1000000000000000000")
  });
});
