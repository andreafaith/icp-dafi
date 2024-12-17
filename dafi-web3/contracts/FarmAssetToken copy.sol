// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FarmAssetToken is ERC1155, Ownable, ReentrancyGuard {
    enum AssetType { CROP, LIVESTOCK, LAND }
    
    struct Asset {
        string name;
        AssetType assetType;
        uint256 price;  // in USDC
        address farmer;
        uint256 quantity;
        uint256 maturityDate;
        bool isInsured;
    }

    mapping(uint256 => Asset) public assets;
    uint256 private _nextTokenId;
    address public usdcToken;  // USDC contract address

    event AssetTokenized(
        uint256 indexed tokenId,
        address indexed farmer,
        string name,
        AssetType assetType,
        uint256 quantity
    );

    event AssetTraded(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 price
    );

    constructor(address _usdcToken) ERC1155("https://api.dafi.com/assets/{id}.json") {
        usdcToken = _usdcToken;
    }

    function tokenizeAsset(
        string memory name,
        AssetType assetType,
        uint256 price,
        uint256 quantity,
        uint256 maturityDays
    ) external nonReentrant returns (uint256) {
        require(quantity > 0, "Quantity must be positive");
        
        uint256 tokenId = _nextTokenId++;
        uint256 maturityDate = block.timestamp + (maturityDays * 1 days);

        assets[tokenId] = Asset({
            name: name,
            assetType: assetType,
            price: price,
            farmer: msg.sender,
            quantity: quantity,
            maturityDate: maturityDate,
            isInsured: false
        });

        _mint(msg.sender, tokenId, quantity, "");

        emit AssetTokenized(tokenId, msg.sender, name, assetType, quantity);
        return tokenId;
    }

    function setInsurance(uint256 tokenId, bool insured) external {
        require(msg.sender == assets[tokenId].farmer, "Only farmer can set insurance");
        assets[tokenId].isInsured = insured;
    }

    function updatePrice(uint256 tokenId, uint256 newPrice) external {
        require(msg.sender == assets[tokenId].farmer, "Only farmer can update price");
        assets[tokenId].price = newPrice;
    }

    function getAssetDetails(uint256 tokenId) external view returns (
        string memory name,
        AssetType assetType,
        uint256 price,
        address farmer,
        uint256 quantity,
        uint256 maturityDate,
        bool isInsured
    ) {
        Asset memory asset = assets[tokenId];
        return (
            asset.name,
            asset.assetType,
            asset.price,
            asset.farmer,
            asset.quantity,
            asset.maturityDate,
            asset.isInsured
        );
    }

    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return super.uri(tokenId);
    }
}
