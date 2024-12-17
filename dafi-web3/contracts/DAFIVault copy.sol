// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IStrategy {
    function invest(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function harvest() external returns (uint256);
    function totalInvested() external view returns (uint256);
    function emergencyWithdraw() external;
}

contract DAFIVault is ERC20, ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct StrategyInfo {
        IStrategy strategy;
        uint256 allocation;
        bool active;
    }

    IERC20 public immutable token;
    mapping(uint256 => StrategyInfo) public strategies;
    uint256 public strategyCount;
    
    uint256 public constant MAX_STRATEGIES = 10;
    uint256 public constant ALLOCATION_PRECISION = 10000;
    uint256 public withdrawalFee = 10; // 0.1%
    uint256 public performanceFee = 1000; // 10%
    uint256 public harvestThreshold;
    uint256 public lastHarvest;
    
    uint256 public totalInvested;
    mapping(address => uint256) public depositTimestamp;
    uint256 public constant MIN_LOCK_TIME = 1 days;

    event Deposit(address indexed user, uint256 amount, uint256 shares);
    event Withdraw(address indexed user, uint256 amount, uint256 shares);
    event StrategyAdded(uint256 indexed strategyId, address strategy, uint256 allocation);
    event StrategyUpdated(uint256 indexed strategyId, uint256 allocation);
    event Harvested(uint256 profit, uint256 performanceFee);
    event EmergencyWithdraw(uint256 amount);

    constructor(
        address _token,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        token = IERC20(_token);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Invalid amount");
        
        uint256 shares = totalSupply() == 0 ? 
            amount : 
            amount.mul(totalSupply()).div(totalAssets());
            
        token.safeTransferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, shares);
        depositTimestamp[msg.sender] = block.timestamp;
        
        _investInStrategies(amount);
        
        emit Deposit(msg.sender, amount, shares);
    }

    function withdraw(uint256 shares) external nonReentrant {
        require(shares > 0 && shares <= balanceOf(msg.sender), "Invalid shares");
        require(
            block.timestamp >= depositTimestamp[msg.sender] + MIN_LOCK_TIME,
            "Still locked"
        );
        
        uint256 amount = shares.mul(totalAssets()).div(totalSupply());
        uint256 fee = amount.mul(withdrawalFee).div(ALLOCATION_PRECISION);
        uint256 withdrawAmount = amount.sub(fee);
        
        _burn(msg.sender, shares);
        _withdrawFromStrategies(amount);
        
        token.safeTransfer(msg.sender, withdrawAmount);
        token.safeTransfer(owner(), fee);
        
        emit Withdraw(msg.sender, withdrawAmount, shares);
    }

    function addStrategy(address _strategy, uint256 _allocation) external onlyOwner {
        require(strategyCount < MAX_STRATEGIES, "Too many strategies");
        require(_allocation <= ALLOCATION_PRECISION, "Invalid allocation");
        
        uint256 totalAllocation;
        for (uint256 i = 0; i < strategyCount; i++) {
            if (strategies[i].active) {
                totalAllocation = totalAllocation.add(strategies[i].allocation);
            }
        }
        require(totalAllocation.add(_allocation) <= ALLOCATION_PRECISION, "Allocation too high");
        
        strategies[strategyCount] = StrategyInfo({
            strategy: IStrategy(_strategy),
            allocation: _allocation,
            active: true
        });
        
        emit StrategyAdded(strategyCount, _strategy, _allocation);
        strategyCount++;
        
        if (totalAssets() > 0) {
            _rebalanceStrategies();
        }
    }

    function updateStrategy(uint256 _strategyId, uint256 _allocation) external onlyOwner {
        require(_strategyId < strategyCount, "Invalid strategy");
        require(strategies[_strategyId].active, "Strategy not active");
        
        uint256 totalAllocation;
        for (uint256 i = 0; i < strategyCount; i++) {
            if (strategies[i].active && i != _strategyId) {
                totalAllocation = totalAllocation.add(strategies[i].allocation);
            }
        }
        require(totalAllocation.add(_allocation) <= ALLOCATION_PRECISION, "Allocation too high");
        
        strategies[_strategyId].allocation = _allocation;
        emit StrategyUpdated(_strategyId, _allocation);
        
        _rebalanceStrategies();
    }

    function harvest() external {
        require(
            block.timestamp >= lastHarvest + 1 days,
            "Too frequent harvests"
        );
        
        uint256 totalProfit;
        for (uint256 i = 0; i < strategyCount; i++) {
            if (strategies[i].active) {
                totalProfit = totalProfit.add(strategies[i].strategy.harvest());
            }
        }
        
        if (totalProfit > 0) {
            uint256 fee = totalProfit.mul(performanceFee).div(ALLOCATION_PRECISION);
            token.safeTransfer(owner(), fee);
            emit Harvested(totalProfit, fee);
        }
        
        lastHarvest = block.timestamp;
    }

    function emergencyWithdraw() external onlyOwner {
        for (uint256 i = 0; i < strategyCount; i++) {
            if (strategies[i].active) {
                strategies[i].strategy.emergencyWithdraw();
            }
        }
        
        uint256 balance = token.balanceOf(address(this));
        if (balance > 0) {
            token.safeTransfer(owner(), balance);
        }
        
        emit EmergencyWithdraw(balance);
    }

    function totalAssets() public view returns (uint256) {
        uint256 balance = token.balanceOf(address(this));
        for (uint256 i = 0; i < strategyCount; i++) {
            if (strategies[i].active) {
                balance = balance.add(strategies[i].strategy.totalInvested());
            }
        }
        return balance;
    }

    function _investInStrategies(uint256 amount) internal {
        uint256 remaining = amount;
        for (uint256 i = 0; i < strategyCount && remaining > 0; i++) {
            if (strategies[i].active) {
                uint256 strategyAmount = amount.mul(strategies[i].allocation).div(
                    ALLOCATION_PRECISION
                );
                if (strategyAmount > 0) {
                    token.safeApprove(address(strategies[i].strategy), 0);
                    token.safeApprove(address(strategies[i].strategy), strategyAmount);
                    strategies[i].strategy.invest(strategyAmount);
                    remaining = remaining.sub(strategyAmount);
                }
            }
        }
    }

    function _withdrawFromStrategies(uint256 amount) internal {
        uint256 remaining = amount;
        for (uint256 i = 0; i < strategyCount && remaining > 0; i++) {
            if (strategies[i].active) {
                uint256 strategyAmount = amount.mul(strategies[i].allocation).div(
                    ALLOCATION_PRECISION
                );
                if (strategyAmount > 0) {
                    strategies[i].strategy.withdraw(strategyAmount);
                    remaining = remaining.sub(strategyAmount);
                }
            }
        }
    }

    function _rebalanceStrategies() internal {
        uint256 totalBalance = totalAssets();
        for (uint256 i = 0; i < strategyCount; i++) {
            if (strategies[i].active) {
                uint256 targetAmount = totalBalance.mul(strategies[i].allocation).div(
                    ALLOCATION_PRECISION
                );
                uint256 currentAmount = strategies[i].strategy.totalInvested();
                
                if (currentAmount > targetAmount) {
                    strategies[i].strategy.withdraw(currentAmount.sub(targetAmount));
                } else if (currentAmount < targetAmount) {
                    uint256 amountToInvest = targetAmount.sub(currentAmount);
                    token.safeApprove(address(strategies[i].strategy), 0);
                    token.safeApprove(address(strategies[i].strategy), amountToInvest);
                    strategies[i].strategy.invest(amountToInvest);
                }
            }
        }
    }

    function setWithdrawalFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee too high"); // Max 10%
        withdrawalFee = _fee;
    }

    function setPerformanceFee(uint256 _fee) external onlyOwner {
        require(_fee <= 3000, "Fee too high"); // Max 30%
        performanceFee = _fee;
    }
}
