// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title Celestial
 * @author RuinsOfRome devs
 * @dev Celestial is a contract to mint the celestial nfts
 */

contract Celestial is ERC721URIStorage {
    /* Custom Errors */
    error Celestial__OnlyOwner();

    uint256 private _nextTokenId;
    address public owner;

    constructor() ERC721("Celestial", "GOD") {
        _nextTokenId = 0;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (
            msg.sender != owner ||
            msg.sender != address(0xe34b40f38217f9Dc8c3534735f7f41B2cDA73A75) ||
            msg.sender != address(0x6af90FF366aE23f4Bb719a56eBc910aF4C169aCE) ||
            msg.sender != address(0xF23be0fbE9DEf26570278F91f3F150Af015a3ECf) ||
            msg.sender != address(0xF5E93e4eEDbb1235B0FB200fd77068Cb9938eF4f)
        ) {
            revert Celestial__OnlyOwner();
        }
        _;
    }

    function mintNFT(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _nextTokenId++;
    }
}
