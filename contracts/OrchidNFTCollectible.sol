// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract OrchidNFTCollectible is ERC721, Ownable {
    mapping(uint256 => string) private _tokenURIs;
    uint256 private tokenIdNext;

    constructor() Ownable(_msgSender()) ERC721("Orchid Collectible", "ORC") {}

    function mint(address to, string memory tokenURI) external onlyOwner {
        _mint(to, tokenIdNext);
        _tokenURIs[tokenIdNext] = tokenURI;
    }

    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }
}
