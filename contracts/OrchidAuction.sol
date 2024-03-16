// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OrchidNFTCollectible} from "./OrchidNFTCollectible.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol";

contract OrchidAuction is Ownable, IERC721Receiver {
    receive() external payable {}

    address public _orchidNFTCollectible;
    uint256 public _tokenId;

    address public _factory;
    bool public _isTerminated;
    uint256 public _initialAmount;
    uint256 public _currentAmount;

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    Bid[] _bids;

    function _lastBid() internal view returns (Bid memory) {
        require(_bids.length >= 1);
        return _bids[_bids.length - 1];
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    constructor(
        uint256 initialAmount,
        address orchidNFTCollectible,
        uint16 tokenId
    ) Ownable(_msgSender()) {
        _factory = _msgSender();
        _isTerminated = false;
        _initialAmount = initialAmount;
        _currentAmount = _initialAmount;

        _orchidNFTCollectible = orchidNFTCollectible;
        _tokenId = tokenId;
    }

    modifier moreThanCurrentAmount(uint256 amount) {
        require(
            amount > _currentAmount,
            "Bid amount must exceed current amount."
        );
        _;
    }

    function bid(uint256 amount) public payable moreThanCurrentAmount(amount) {
        require(msg.value == amount, "Value must be equal to amount.");
        
        if (_bids.length >= 1) {
            Bid memory lastBid = _lastBid();
            (bool success, ) = lastBid.bidder.call{value: lastBid.amount}("");
            require(success);
        }
        Bid memory newBid = Bid({
            bidder: _msgSender(),
            amount: amount,
            timestamp: block.timestamp
        });

        _bids.push(newBid);

        _currentAmount = amount;
    }

    modifier mustAfterADay() {
        require(
            block.timestamp >= _lastBid().timestamp + 60 * 60 * 24,
            "You can only end the auction after a day since last bid."
        );
        _;
    }

    //creator can end any
    function endAuction() public payable mustAfterADay {
        _isTerminated = true;
        Bid memory lastBid = _lastBid();
        OrchidNFTCollectible(_orchidNFTCollectible).safeTransferFrom(
            address(this),
            lastBid.bidder,
            _tokenId
        );

        (bool success, ) = owner().call{value: lastBid.amount}("");
        require(success);
    }
}
