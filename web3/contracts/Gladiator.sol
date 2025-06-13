// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Gladiator is ERC721URIStorage {
    /* Custom Errors */
    error Gladiator__OnlyOwner();
    error Gladiator__AlreadyClaimed();
    error Gladiator__InvalidGladiatorId();
    error Gladiator__NotClaimed();
    error Gladiator__NoGladiatorOwned();

    using EnumerableSet for EnumerableSet.AddressSet;

    // State Variables
    mapping(address => bool) public hasClaimed;
    EnumerableSet.AddressSet private claimedPlayers;
    uint256 public nextGladiatorId = 0;
    address public owner;

    // Events
    event GladiatorMinted(
        address indexed player,
        uint256 indexed gladiatorId,
        string metadataURI
    );
    event GladiatorUpdated(uint256 indexed gladiatorId, string newMetadataURI);

    constructor() ERC721("GladiatorNFT", "GLAD") {
        owner = msg.sender;
    }

    /* Main Functions */
    function mintGladiator(string memory metadataURI) external {
        if (hasClaimed[msg.sender]) revert Gladiator__AlreadyClaimed();

        uint256 gladiatorId = nextGladiatorId++;
        _safeMint(msg.sender, gladiatorId);
        _setTokenURI(gladiatorId, metadataURI);
        hasClaimed[msg.sender] = true;
        claimedPlayers.add(msg.sender);

        emit GladiatorMinted(msg.sender, gladiatorId, metadataURI);
    }

    function updateGladiator(
        uint256 gladiatorId,
        string memory newMetadataURI
    ) external {
        if (gladiatorId >= nextGladiatorId) {
            revert Gladiator__InvalidGladiatorId();
        }

        _setTokenURI(gladiatorId, newMetadataURI);
        emit GladiatorUpdated(gladiatorId, newMetadataURI);
    }

    /* Getter Functions */
    function hasClaimedNFT(address player) external view returns (bool) {
        return hasClaimed[player];
    }

    function getAllClaimedPlayers() external view returns (address[] memory) {
        return claimedPlayers.values();
    }

    function getGladiatorForPlayer(
        address player
    ) external view returns (uint256, string memory) {
        if (!hasClaimed[player]) revert Gladiator__NotClaimed();

        for (uint256 i = 0; i < nextGladiatorId; i++) {
            if (ownerOf(i) == player) {
                return (i, tokenURI(i));
            }
        }
        revert Gladiator__NoGladiatorOwned();
    }
}
