import { InitializeResult, initialize } from "./Initialize";
import { expect } from "chai"

describe("OrchidNFTCollectible", () => {
  let _initialize: InitializeResult;

  before("initialize", async () => {
    _initialize = await initialize();
  });

  it("should mint NFT successfully", async () => {
    const { nft, signers } = _initialize
    await nft.contract.mint(signers[1].address, "cuongdeptrai")
    const owner = await nft.contract.ownerOf(BigInt(0))
    expect(owner).to.be.eq(signers[1].address)
  })
});