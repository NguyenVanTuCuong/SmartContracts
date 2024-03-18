import { ethers } from "hardhat"
async function main() {
    const nft = await ethers.deployContract("OrchidNFTCollectible", [])
    await nft.waitForDeployment()
    const nftAddress = await nft.getAddress()
    console.log(`Nft ${nftAddress}`)

    const factory = await ethers.deployContract("OrchidAuctionFactory", [nftAddress])
    await factory.waitForDeployment()
    const factorytAddress = await factory.getAddress()
    console.log(`Factory ${factorytAddress}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

//npx hardhat run --network baobap deploy/main.ts