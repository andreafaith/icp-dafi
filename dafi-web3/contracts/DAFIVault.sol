// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract DAFIVault is ReentrancyGuard, Ownable, Pausable {
    IERC20 public dafiToken;
    
    struct Investment {
        uint256 amount;
        uint256 shares;
        uint256 timestamp;
        bool active;
    }
    
    struct Asset {
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare;
        uint256 totalInvestment;
        bool active;
    }
    
    mapping(uint256 => Asset) public assets; // assetId => Asset
    mapping(address => mapping(uint256 => Investment)) public investments; // investor => assetId => Investment
    mapping(uint256 => mapping(address => uint256)) public returns; // assetId => investor => returns
    
    uint256 public totalAssets;
    uint256 public constant MINIMUM_INVESTMENT = 100 * 10**18; // 100 tokens
    uint256 public constant LOCK_PERIOD = 30 days;
    
    event AssetCreated(uint256 indexed assetId, uint256 totalShares, uint256 pricePerShare);
    event InvestmentMade(address indexed investor, uint256 indexed assetId, uint256 amount, uint256 shares);
    event ReturnsDistributed(uint256 indexed assetId, uint256 totalAmount);
    event ReturnsWithdrawn(address indexed investor, uint256 indexed assetId, uint256 amount);
    event InvestmentWithdrawn(address indexed investor, uint256 indexed assetId, uint256 amount);
    
    constructor(address _dafiToken) {
        dafiToken = IERC20(_dafiToken);
    }
    
    function createAsset(
        uint256 _totalShares,
        uint256 _pricePerShare
    ) external onlyOwner whenNotPaused {
        totalAssets++;
        assets[totalAssets] = Asset({
            totalShares: _totalShares,
            availableShares: _totalShares,
            pricePerShare: _pricePerShare,
            totalInvestment: 0,
            active: true
        });
        
        emit AssetCreated(totalAssets, _totalShares, _pricePerShare);
    }
    
    function invest(uint256 _assetId, uint256 _shares) external nonReentrant whenNotPaused {
        require(assets[_assetId].active, "Asset not active");
        require(_shares <= assets[_assetId].availableShares, "Insufficient available shares");
        
        uint256 investmentAmount = _shares * assets[_assetId].pricePerShare;
        require(investmentAmount >= MINIMUM_INVESTMENT, "Investment below minimum");
        
        require(dafiToken.transferFrom(msg.sender, address(this), investmentAmount), "Transfer failed");
        
        investments[msg.sender][_assetId] = Investment({
            amount: investmentAmount,
            shares: _shares,
            timestamp: block.timestamp,
            active: true
        });
        
        assets[_assetId].availableShares -= _shares;
        assets[_assetId].totalInvestment += investmentAmount;
        
        emit InvestmentMade(msg.sender, _assetId, investmentAmount, _shares);
    }
    
    function distributeReturns(uint256 _assetId, uint256 _totalAmount) external onlyOwner whenNotPaused {
        require(assets[_assetId].active, "Asset not active");
        require(_totalAmount > 0, "Amount must be greater than 0");
        require(dafiToken.transferFrom(msg.sender, address(this), _totalAmount), "Transfer failed");
        
        uint256 totalShares = assets[_assetId].totalShares - assets[_assetId].availableShares;
        require(totalShares > 0, "No active investments");
        
        uint256 returnPerShare = _totalAmount / totalShares;
        
        emit ReturnsDistributed(_assetId, _totalAmount);
    }
    
    function withdrawReturns(uint256 _assetId) external nonReentrant whenNotPaused {
        uint256 returnAmount = returns[_assetId][msg.sender];
        require(returnAmount > 0, "No returns available");
        
        returns[_assetId][msg.sender] = 0;
        require(dafiToken.transfer(msg.sender, returnAmount), "Transfer failed");
        
        emit ReturnsWithdrawn(msg.sender, _assetId, returnAmount);
    }
    
    function withdrawInvestment(uint256 _assetId) external nonReentrant whenNotPaused {
        Investment storage investment = investments[msg.sender][_assetId];
        require(investment.active, "No active investment");
        require(block.timestamp >= investment.timestamp + LOCK_PERIOD, "Lock period not ended");
        
        uint256 amount = investment.amount;
        investment.active = false;
        assets[_assetId].availableShares += investment.shares;
        assets[_assetId].totalInvestment -= amount;
        
        require(dafiToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit InvestmentWithdrawn(msg.sender, _assetId, amount);
    }
    
    function getAssetDetails(uint256 _assetId) external view returns (
        uint256 totalShares,
        uint256 availableShares,
        uint256 pricePerShare,
        uint256 totalInvestment,
        bool active
    ) {
        Asset memory asset = assets[_assetId];
        return (
            asset.totalShares,
            asset.availableShares,
            asset.pricePerShare,
            asset.totalInvestment,
            asset.active
        );
    }
    
    function getInvestmentDetails(address _investor, uint256 _assetId) external view returns (
        uint256 amount,
        uint256 shares,
        uint256 timestamp,
        bool active
    ) {
        Investment memory investment = investments[_investor][_assetId];
        return (
            investment.amount,
            investment.shares,
            investment.timestamp,
            investment.active
        );
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
