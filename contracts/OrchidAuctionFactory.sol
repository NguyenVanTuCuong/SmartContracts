// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OrchidNFTCollectible} from "./OrchidNFTCollectible.sol";
import {OrchidAuction} from "./OrchidAuction.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract OrchidAuctionFactory is Ownable {
    receive() external payable {}
    OrchidAuction[] public auctionContracts;

    //0.1 ETH for each 
    uint256 public immutable BASE_FEE = 100000000000000000;

    uint256 public _protocolFee;
    address public _orchidNFTCollectible;

    constructor(address orchidNFTCollectible) Ownable(_msgSender()) {
        _orchidNFTCollectible = orchidNFTCollectible;
    }

    function collectProtocol() onlyOwner() external payable returns (uint256 protocolFee) {  
        (bool success, ) = owner().call{value: _protocolFee}("");
        require(success);

        protocolFee = _protocolFee;
        _protocolFee = 0;
    }

    function initializeAuction(uint16 tokenId, uint initialAmount) external payable returns (address auction) {
        require(msg.value == BASE_FEE, "Value must be equal to BASE_FEE.");
        _protocolFee += BASE_FEE;
        
        OrchidAuction auctionContract = new OrchidAuction(
            initialAmount,
            _orchidNFTCollectible,
            tokenId
        );

        auctionContract.transferOwnership(_msgSender());

        auction = address(auctionContract);

        auctionContracts.push(auctionContract);

        OrchidNFTCollectible(_orchidNFTCollectible).safeTransferFrom(
            _msgSender(),
            auction,
            tokenId
        );
    }
}
