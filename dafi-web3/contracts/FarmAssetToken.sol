// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FarmAssetToken is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct FarmAsset {
        string location;
        uint256 size; // in square meters
        string assetType; // e.g., "Farm", "Orchard", "Vineyard"
        uint256 valuation;
        string metadataURI;
        bool isVerified;
    }
    
    mapping(uint256 => FarmAsset) public farmAssets;
    mapping(address => bool) public isVerifier;
    
    event AssetMinted(uint256 indexed tokenId, address indexed owner, string assetType);
    event AssetVerified(uint256 indexed tokenId, address indexed verifier);
    event AssetUpdated(uint256 indexed tokenId, uint256 newValuation);
    
    constructor() ERC721("DAFI Farm Asset", "FARM") {
        isVerifier[msg.sender] = true;
    }
    
    function addVerifier(address _verifier) external onlyOwner {
        isVerifier[_verifier] = true;
    }
    
    function removeVerifier(address _verifier) external onlyOwner {
        isVerifier[_verifier] = false;
    }
    
    function mintAsset(
        address to,
        string memory location,
        uint256 size,
        string memory assetType,
        uint256 valuation,
        string memory metadataURI
    ) external returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        farmAssets[newTokenId] = FarmAsset({
            location: location,
            size: size,
            assetType: assetType,
            valuation: valuation,
            metadataURI: metadataURI,
            isVerified: false
        });
        
        _mint(to, newTokenId);
        emit AssetMinted(newTokenId, to, assetType);
        
        return newTokenId;
    }
    
    function verifyAsset(uint256 tokenId) external {
        require(isVerifier[msg.sender], "Only verifiers can verify assets");
        require(_exists(tokenId), "Asset does not exist");
        
        farmAssets[tokenId].isVerified = true;
        emit AssetVerified(tokenId, msg.sender);
    }
    
    function updateValuation(uint256 tokenId, uint256 newValuation) external {
        require(_exists(tokenId), "Asset does not exist");
        require(ownerOf(tokenId) == msg.sender || isVerifier[msg.sender], "Not authorized");
        
        farmAssets[tokenId].valuation = newValuation;
        emit AssetUpdated(tokenId, newValuation);
    }
    
    function getAsset(uint256 tokenId) external view returns (FarmAsset memory) {
        require(_exists(tokenId), "Asset does not exist");
        return farmAssets[tokenId];
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Asset does not exist");
        return farmAssets[tokenId].metadataURI;
    }
}
