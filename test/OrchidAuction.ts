import { ethers } from "hardhat";
import { InitializeResult, initialize } from "./Initialize";
import { expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers"

describe("OrchidAuction", () => {
  let _initialize: InitializeResult;

  before("initialize", async () => {
    _initialize = await initialize();
  });

  it("should bid successfully", async () => {
    const { factory, nft, signers } = _initialize;
    await nft.contract.mint(signers[1].address, "cuongdeptrai");
    await nft.contract.connect(signers[1]).approve(factory.address, BigInt(0));
    const auctionAddress = await factory.contract
      .connect(signers[1])
      .getFunction("initializeAuction")
      .staticCall(BigInt(0), "1000000000000000000", {
        value: "100000000000000000"
      });
    await factory.contract
      .connect(signers[1])
      .initializeAuction(BigInt(0), "1000000000000000000", {
        value: "100000000000000000"
      });
    const auctionContract = await ethers.getContractAt(
      "OrchidAuction",
      auctionAddress
    );

    await expect(
      auctionContract.bid("1000000000000000", {
        value: ethers.parseEther("0.1"),
      })
    ).to.be.rejectedWith("Bid amount must exceed current amount.");

    await expect(
      auctionContract.bid("10000000000000000000", {
        value: ethers.parseEther("2"),
      })
    ).to.be.rejectedWith("Value must be equal to amount.");

    await auctionContract.bid("2000000000000000000", {
      value: ethers.parseEther("2"),
    });

    const balance = await ethers.provider.getBalance(signers[0].address);
    console.log(balance);

    await expect(
      auctionContract.connect(signers[3]).bid("2000000000000000000", {
        value: ethers.parseEther("2"),
      })
    ).to.be.rejectedWith("Bid amount must exceed current amount.");

    await auctionContract.connect(signers[3]).bid("3000000000000000000", {
      value: ethers.parseEther("3"),
    });

    const balance2 = await ethers.provider.getBalance(signers[0].address);
    console.log(balance2);

    await expect(
        auctionContract.endAuction()
      ).to.be.rejectedWith("You can only end the auction after a day since last bid.");
    
    await time.increase(60 * 60 * 24)
    await auctionContract.endAuction()

    const owner = await nft.contract.ownerOf(BigInt(0))
    console.log("owner" + await auctionContract.owner() + "  " + signers[1].address)
    console.log(owner)
    expect(owner).to.be.eq(signers[3].address)

    const balance3 = await ethers.provider.getBalance(signers[1].address);
    console.log(balance3)

    const balanceFollower = await ethers.provider.getBalance(signers[0].address);

    console.log(await factory.contract._protocolFee())

    console.log("before collect fee", balanceFollower)

    await factory.contract.collectProtocol()

    console.log(await factory.contract._protocolFee())

    const balanceFollower2 = await ethers.provider.getBalance(signers[0].address);
    console.log("after collect fee", balanceFollower2)
  });
});
