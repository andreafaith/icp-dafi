// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DAFIPriceOracle is AccessControl, Pausable {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct PriceData {
        uint256 price;
        uint256 timestamp;
        uint256 confidence;
    }

    struct AssetConfig {
        bool isActive;
        uint256 heartbeat;  // Maximum time between updates
        uint256 deviationThreshold;  // Minimum % price movement required for update
        address chainlinkFeed;  // Optional Chainlink price feed
    }

    mapping(bytes32 => PriceData) public prices;  // Asset identifier => Price data
    mapping(bytes32 => AssetConfig) public assetConfigs;
    mapping(bytes32 => mapping(address => bool)) public trustedSources;
    
    uint256 public constant PRECISION = 1e18;
    uint256 public minimumSourceCount = 3;
    
    event PriceUpdated(bytes32 indexed assetId, uint256 price, uint256 confidence);
    event AssetConfigured(bytes32 indexed assetId, uint256 heartbeat, uint256 deviationThreshold);
    event SourceAdded(bytes32 indexed assetId, address indexed source);
    event SourceRemoved(bytes32 indexed assetId, address indexed source);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    function submitPrice(
        bytes32 assetId,
        uint256 price,
        uint256 confidence
    ) external whenNotPaused onlyRole(ORACLE_ROLE) {
        require(assetConfigs[assetId].isActive, "Asset not configured");
        require(trustedSources[assetId][msg.sender], "Source not trusted");
        
        PriceData storage data = prices[assetId];
        
        // Check if update is needed based on heartbeat and deviation
        bool timeUpdate = (block.timestamp - data.timestamp) >= assetConfigs[assetId].heartbeat;
        bool priceUpdate = calculateDeviation(data.price, price) >= assetConfigs[assetId].deviationThreshold;
        
        require(timeUpdate || priceUpdate, "Update not needed");
        
        data.price = price;
        data.timestamp = block.timestamp;
        data.confidence = confidence;
        
        emit PriceUpdated(assetId, price, confidence);
    }

    function getPrice(bytes32 assetId) external view returns (
        uint256 price,
        uint256 timestamp,
        uint256 confidence
    ) {
        require(assetConfigs[assetId].isActive, "Asset not configured");
        PriceData memory data = prices[assetId];
        
        if (assetConfigs[assetId].chainlinkFeed != address(0)) {
            // If Chainlink feed exists, use it as primary source
            try AggregatorV3Interface(assetConfigs[assetId].chainlinkFeed).latestRoundData() returns (
                uint80,
                int256 answer,
                uint256,
                uint256 updatedAt,
                uint80
            ) {
                return (uint256(answer), updatedAt, PRECISION);  // Chainlink feeds have highest confidence
            } catch {
                // Fallback to oracle data if Chainlink fails
            }
        }
        
        require(block.timestamp - data.timestamp <= assetConfigs[assetId].heartbeat, "Price too old");
        return (data.price, data.timestamp, data.confidence);
    }

    function configureAsset(
        bytes32 assetId,
        uint256 heartbeat,
        uint256 deviationThreshold,
        address chainlinkFeed
    ) external onlyRole(ADMIN_ROLE) {
        require(heartbeat > 0, "Invalid heartbeat");
        require(deviationThreshold > 0, "Invalid deviation threshold");
        
        assetConfigs[assetId] = AssetConfig({
            isActive: true,
            heartbeat: heartbeat,
            deviationThreshold: deviationThreshold,
            chainlinkFeed: chainlinkFeed
        });
        
        emit AssetConfigured(assetId, heartbeat, deviationThreshold);
    }

    function addTrustedSource(bytes32 assetId, address source) external onlyRole(ADMIN_ROLE) {
        require(!trustedSources[assetId][source], "Source already trusted");
        trustedSources[assetId][source] = true;
        emit SourceAdded(assetId, source);
    }

    function removeTrustedSource(bytes32 assetId, address source) external onlyRole(ADMIN_ROLE) {
        require(trustedSources[assetId][source], "Source not trusted");
        trustedSources[assetId][source] = false;
        emit SourceRemoved(assetId, source);
    }

    function setMinimumSourceCount(uint256 count) external onlyRole(ADMIN_ROLE) {
        require(count > 0, "Invalid count");
        minimumSourceCount = count;
    }

    function calculateDeviation(uint256 oldPrice, uint256 newPrice) internal pure returns (uint256) {
        if (oldPrice == 0) return PRECISION;
        
        uint256 difference = oldPrice > newPrice ? 
            oldPrice - newPrice : 
            newPrice - oldPrice;
            
        return (difference * PRECISION) / oldPrice;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
