// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Celestial is ERC721URIStorage {
    /* Custom Errors */
    error Celestial__OnlyOwner();
    error Celestial__NotForSale();
    error Celestial__PriceMustBeAboveZero();
    error Celestial__NotOwner();
    error Celestial__PriceNotMet(uint256 tokenId, uint256 price);
    error Celestial__TokenAlreadyListed(uint256 tokenId);

    struct Listing {
        uint256 price;
        address seller;
    }

    uint256 private _nextTokenId;
    address public owner;
    mapping(uint256 => Listing) private s_listings;

    event TokenListed(uint256 indexed tokenId, address seller, uint256 price);
    event TokenSold(
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price
    );
    event TokenDelisted(uint256 indexed tokenId);

    constructor() ERC721("Celestial", "GOD") {
        _nextTokenId = 0;
        owner = msg.sender;
    }

    function mintNFT(address to, string memory tokenURI) public {
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _nextTokenId++;
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        if (ownerOf(tokenId) != msg.sender) revert Celestial__NotOwner();
        if (price <= 0) revert Celestial__PriceMustBeAboveZero();
        if (s_listings[tokenId].price > 0)
            revert Celestial__TokenAlreadyListed(tokenId);

        s_listings[tokenId] = Listing(price, msg.sender);
        approve(address(this), tokenId);

        emit TokenListed(tokenId, msg.sender, price);
    }

    function buyNFT(uint256 tokenId) public payable {
        Listing memory listing = s_listings[tokenId];
        if (listing.price <= 0) revert Celestial__NotForSale();
        if (msg.value < listing.price)
            revert Celestial__PriceNotMet(tokenId, listing.price);

        address seller = listing.seller;
        delete s_listings[tokenId];

        _transfer(seller, msg.sender, tokenId);
        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "Transfer failed");

        emit TokenSold(tokenId, seller, msg.sender, msg.value);
    }

    function cancelListing(uint256 tokenId) public {
        if (ownerOf(tokenId) != msg.sender) revert Celestial__NotOwner();
        delete s_listings[tokenId];
        emit TokenDelisted(tokenId);
    }

    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return s_listings[tokenId];
    }

    function getAllListings() public view returns (Listing[] memory) {
        Listing[] memory listings = new Listing[](_nextTokenId);
        for (uint256 i = 0; i < _nextTokenId; i++) {
            listings[i] = s_listings[i];
        }
        return listings;
    }

    function getListingsForAddress(
        address addy
    ) public view returns (uint256[] memory tokenIds, uint256[] memory prices) {
        if (addy == address(0)) revert("Invalid address");

        uint256 listingCount = 0;
        // First, count the number of listings for this address
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (s_listings[i].seller == addy && s_listings[i].price > 0) {
                listingCount++;
            }
        }

        // Create arrays of the correct size
        tokenIds = new uint256[](listingCount);
        prices = new uint256[](listingCount);

        // Fill the arrays with listing data
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (s_listings[i].seller == addy && s_listings[i].price > 0) {
                tokenIds[currentIndex] = i;
                prices[currentIndex] = s_listings[i].price;
                currentIndex++;
            }
        }

        return (tokenIds, prices);
    }

    function getNFTs(
        address addy
    ) public view returns (string[] memory, uint256[] memory) {
        if (addy == address(0)) revert("Invalid address");

        string[] memory uris = new string[](_nextTokenId);
        uint256 tokenCount = 0;

        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (ownerOf(i) == addy) {
                uris[tokenCount] = tokenURI(i);
                tokenCount++;
            }
        }

        string[] memory result = new string[](tokenCount);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            result[i] = uris[i];
            tokenIds[i] = i;
        }

        return (result, tokenIds);
    }
}
