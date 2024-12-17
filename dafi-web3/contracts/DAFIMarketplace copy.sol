// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DAFIMarketplace is ReentrancyGuard, ERC1155Holder, Ownable {
    IERC20 public usdcToken;
    IERC1155 public farmAssetToken;
    
    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 pricePerUnit;
        bool active;
    }

    struct Offer {
        address buyer;
        uint256 amount;
        uint256 pricePerUnit;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => mapping(address => Offer)) public offers;
    mapping(address => uint256) public farmerRewards;
    
    uint256 public listingCount;
    uint256 public platformFee = 25; // 0.25% fee (basis points)
    
    event Listed(uint256 indexed listingId, address indexed seller, uint256 tokenId, uint256 amount, uint256 pricePerUnit);
    event OfferMade(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 pricePerUnit);
    event OfferAccepted(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 amount);
    event ListingCancelled(uint256 indexed listingId);
    event OfferCancelled(uint256 indexed listingId, address indexed buyer);
    
    constructor(address _usdcToken, address _farmAssetToken) {
        usdcToken = IERC20(_usdcToken);
        farmAssetToken = IERC1155(_farmAssetToken);
    }

    function createListing(
        uint256 tokenId,
        uint256 amount,
        uint256 pricePerUnit
    ) external nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be positive");
        require(pricePerUnit > 0, "Price must be positive");
        
        farmAssetToken.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        
        uint256 listingId = listingCount++;
        listings[listingId] = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            amount: amount,
            pricePerUnit: pricePerUnit,
            active: true
        });
        
        emit Listed(listingId, msg.sender, tokenId, amount, pricePerUnit);
        return listingId;
    }

    function makeOffer(uint256 listingId, uint256 amount, uint256 pricePerUnit) external nonReentrant {
        require(listings[listingId].active, "Listing not active");
        require(amount <= listings[listingId].amount, "Amount exceeds listing");
        
        uint256 totalPrice = amount * pricePerUnit;
        require(usdcToken.balanceOf(msg.sender) >= totalPrice, "Insufficient USDC balance");
        
        offers[listingId][msg.sender] = Offer({
            buyer: msg.sender,
            amount: amount,
            pricePerUnit: pricePerUnit,
            active: true
        });
        
        emit OfferMade(listingId, msg.sender, amount, pricePerUnit);
    }

    function acceptOffer(uint256 listingId, address buyer) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(msg.sender == listing.seller, "Not seller");
        require(listing.active, "Listing not active");
        
        Offer storage offer = offers[listingId][buyer];
        require(offer.active, "Offer not active");
        
        uint256 totalPrice = offer.amount * offer.pricePerUnit;
        uint256 fee = (totalPrice * platformFee) / 10000;
        uint256 sellerAmount = totalPrice - fee;
        
        // Transfer USDC from buyer to seller and platform
        require(usdcToken.transferFrom(buyer, listing.seller, sellerAmount), "USDC transfer failed");
        require(usdcToken.transferFrom(buyer, address(this), fee), "Fee transfer failed");
        
        // Transfer farm asset tokens to buyer
        farmAssetToken.safeTransferFrom(address(this), buyer, listing.tokenId, offer.amount, "");
        
        // Update listing
        listing.amount -= offer.amount;
        if (listing.amount == 0) {
            listing.active = false;
        }
        
        // Add rewards for the farmer
        farmerRewards[listing.seller] += fee;
        
        offer.active = false;
        
        emit OfferAccepted(listingId, buyer, listing.seller, offer.amount);
    }

    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(msg.sender == listing.seller, "Not seller");
        require(listing.active, "Listing not active");
        
        listing.active = false;
        farmAssetToken.safeTransferFrom(address(this), listing.seller, listing.tokenId, listing.amount, "");
        
        emit ListingCancelled(listingId);
    }

    function cancelOffer(uint256 listingId) external nonReentrant {
        require(offers[listingId][msg.sender].active, "No active offer");
        offers[listingId][msg.sender].active = false;
        
        emit OfferCancelled(listingId, msg.sender);
    }

    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
    }

    function withdrawRewards() external nonReentrant {
        uint256 amount = farmerRewards[msg.sender];
        require(amount > 0, "No rewards to claim");
        
        farmerRewards[msg.sender] = 0;
        require(usdcToken.transfer(msg.sender, amount), "Reward transfer failed");
    }
}
