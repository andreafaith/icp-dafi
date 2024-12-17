// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract DAFIMarketplace is ReentrancyGuard, Ownable, Pausable {
    IERC20 public dafiToken;
    IERC721 public farmAssetToken;
    
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }
    
    mapping(uint256 => Listing) public listings; // tokenId => Listing
    
    uint256 public platformFee = 250; // 2.5% in basis points
    uint256 public totalVolume;
    uint256 public totalFees;
    
    event AssetListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event AssetSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    event PlatformFeeUpdated(uint256 newFee);
    
    constructor(address _dafiToken, address _farmAssetToken) {
        dafiToken = IERC20(_dafiToken);
        farmAssetToken = IERC721(_farmAssetToken);
    }
    
    function listAsset(uint256 _tokenId, uint256 _price) external whenNotPaused {
        require(_price > 0, "Price must be greater than 0");
        require(farmAssetToken.ownerOf(_tokenId) == msg.sender, "Not token owner");
        require(farmAssetToken.getApproved(_tokenId) == address(this), "Marketplace not approved");
        
        listings[_tokenId] = Listing({
            seller: msg.sender,
            price: _price,
            active: true
        });
        
        emit AssetListed(_tokenId, msg.sender, _price);
    }
    
    function buyAsset(uint256 _tokenId) external nonReentrant whenNotPaused {
        Listing storage listing = listings[_tokenId];
        require(listing.active, "Listing not active");
        require(listing.seller != msg.sender, "Cannot buy own asset");
        
        uint256 price = listing.price;
        address seller = listing.seller;
        
        uint256 platformFeeAmount = (price * platformFee) / 10000;
        uint256 sellerAmount = price - platformFeeAmount;
        
        require(dafiToken.transferFrom(msg.sender, address(this), platformFeeAmount), "Platform fee transfer failed");
        require(dafiToken.transferFrom(msg.sender, seller, sellerAmount), "Seller payment failed");
        
        farmAssetToken.safeTransferFrom(seller, msg.sender, _tokenId);
        
        totalVolume += price;
        totalFees += platformFeeAmount;
        delete listings[_tokenId];
        
        emit AssetSold(_tokenId, seller, msg.sender, price);
    }
    
    function cancelListing(uint256 _tokenId) external whenNotPaused {
        Listing storage listing = listings[_tokenId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not seller");
        
        delete listings[_tokenId];
        
        emit ListingCancelled(_tokenId, msg.sender);
    }
    
    function updatePrice(uint256 _tokenId, uint256 _newPrice) external whenNotPaused {
        require(_newPrice > 0, "Price must be greater than 0");
        Listing storage listing = listings[_tokenId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not seller");
        
        listing.price = _newPrice;
        
        emit PriceUpdated(_tokenId, _newPrice);
    }
    
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }
    
    function getListing(uint256 _tokenId) external view returns (
        address seller,
        uint256 price,
        bool active
    ) {
        Listing memory listing = listings[_tokenId];
        return (listing.seller, listing.price, listing.active);
    }
    
    function withdrawFees() external onlyOwner {
        uint256 balance = dafiToken.balanceOf(address(this));
        require(dafiToken.transfer(owner(), balance), "Fee withdrawal failed");
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw(address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Transfer failed");
    }
}
