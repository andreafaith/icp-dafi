// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract YieldFarming is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct Pool {
        IERC20 stakingToken;
        IERC20 rewardToken;
        uint256 rewardRate;
        uint256 lastUpdateTime;
        uint256 rewardPerTokenStored;
        uint256 totalStaked;
        bool active;
    }

    struct UserInfo {
        uint256 stakedAmount;
        uint256 rewardDebt;
        uint256 lastUpdateTime;
        uint256 unclaimedRewards;
    }

    mapping(uint256 => Pool) public pools;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    mapping(address => bool) public verifiedFarmers;
    
    uint256 public poolCount;
    uint256 public constant REWARD_PRECISION = 1e12;
    uint256 public lockPeriod = 7 days;
    
    event PoolCreated(uint256 indexed poolId, address stakingToken, address rewardToken);
    event Staked(uint256 indexed poolId, address indexed user, uint256 amount);
    event Withdrawn(uint256 indexed poolId, address indexed user, uint256 amount);
    event RewardsClaimed(uint256 indexed poolId, address indexed user, uint256 amount);
    event PoolUpdated(uint256 indexed poolId, uint256 rewardRate);

    constructor() {}

    function createPool(
        address _stakingToken,
        address _rewardToken,
        uint256 _rewardRate
    ) external onlyOwner returns (uint256) {
        require(_stakingToken != address(0) && _rewardToken != address(0), "Invalid tokens");
        
        uint256 poolId = poolCount++;
        pools[poolId] = Pool({
            stakingToken: IERC20(_stakingToken),
            rewardToken: IERC20(_rewardToken),
            rewardRate: _rewardRate,
            lastUpdateTime: block.timestamp,
            rewardPerTokenStored: 0,
            totalStaked: 0,
            active: true
        });
        
        emit PoolCreated(poolId, _stakingToken, _rewardToken);
        return poolId;
    }

    function stake(uint256 poolId, uint256 amount) external nonReentrant {
        require(pools[poolId].active, "Pool not active");
        require(amount > 0, "Amount must be positive");
        
        updatePool(poolId);
        Pool storage pool = pools[poolId];
        UserInfo storage user = userInfo[poolId][msg.sender];
        
        if (user.stakedAmount > 0) {
            uint256 pending = calculateRewards(poolId, msg.sender);
            user.unclaimedRewards = user.unclaimedRewards.add(pending);
        }
        
        pool.stakingToken.transferFrom(msg.sender, address(this), amount);
        user.stakedAmount = user.stakedAmount.add(amount);
        pool.totalStaked = pool.totalStaked.add(amount);
        user.lastUpdateTime = block.timestamp;
        
        emit Staked(poolId, msg.sender, amount);
    }

    function withdraw(uint256 poolId, uint256 amount) external nonReentrant {
        UserInfo storage user = userInfo[poolId][msg.sender];
        require(user.stakedAmount >= amount, "Insufficient balance");
        require(block.timestamp >= user.lastUpdateTime + lockPeriod, "Still locked");
        
        updatePool(poolId);
        Pool storage pool = pools[poolId];
        
        uint256 pending = calculateRewards(poolId, msg.sender);
        user.unclaimedRewards = user.unclaimedRewards.add(pending);
        
        user.stakedAmount = user.stakedAmount.sub(amount);
        pool.totalStaked = pool.totalStaked.sub(amount);
        pool.stakingToken.transfer(msg.sender, amount);
        
        emit Withdrawn(poolId, msg.sender, amount);
    }

    function claimRewards(uint256 poolId) external nonReentrant {
        updatePool(poolId);
        UserInfo storage user = userInfo[poolId][msg.sender];
        Pool storage pool = pools[poolId];
        
        uint256 pending = calculateRewards(poolId, msg.sender).add(user.unclaimedRewards);
        require(pending > 0, "No rewards to claim");
        
        user.unclaimedRewards = 0;
        user.lastUpdateTime = block.timestamp;
        pool.rewardToken.transfer(msg.sender, pending);
        
        emit RewardsClaimed(poolId, msg.sender, pending);
    }

    function updatePool(uint256 poolId) public {
        Pool storage pool = pools[poolId];
        if (block.timestamp <= pool.lastUpdateTime) {
            return;
        }

        if (pool.totalStaked == 0) {
            pool.lastUpdateTime = block.timestamp;
            return;
        }

        uint256 timeElapsed = block.timestamp.sub(pool.lastUpdateTime);
        uint256 reward = timeElapsed.mul(pool.rewardRate);
        pool.rewardPerTokenStored = pool.rewardPerTokenStored.add(
            reward.mul(REWARD_PRECISION).div(pool.totalStaked)
        );
        pool.lastUpdateTime = block.timestamp;
    }

    function calculateRewards(uint256 poolId, address user) public view returns (uint256) {
        Pool memory pool = pools[poolId];
        UserInfo memory info = userInfo[poolId][user];
        
        if (info.stakedAmount == 0) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp.sub(pool.lastUpdateTime);
        uint256 currentRewardPerToken = pool.rewardPerTokenStored.add(
            timeElapsed.mul(pool.rewardRate).mul(REWARD_PRECISION).div(pool.totalStaked)
        );
        
        return info.stakedAmount.mul(currentRewardPerToken).div(REWARD_PRECISION);
    }

    function getUserInfo(uint256 poolId, address user) external view returns (UserInfo memory) {
        UserInfo memory info = userInfo[poolId][user];
        return info;
    }

    function setLockPeriod(uint256 _lockPeriod) external onlyOwner {
        lockPeriod = _lockPeriod;
    }

    function updateRewardRate(uint256 poolId, uint256 _rewardRate) external onlyOwner {
        updatePool(poolId);
        pools[poolId].rewardRate = _rewardRate;
        emit PoolUpdated(poolId, _rewardRate);
    }

    function emergencyWithdraw(uint256 poolId) external nonReentrant {
        UserInfo storage user = userInfo[poolId][msg.sender];
        Pool storage pool = pools[poolId];
        
        uint256 amount = user.stakedAmount;
        user.stakedAmount = 0;
        user.unclaimedRewards = 0;
        pool.totalStaked = pool.totalStaked.sub(amount);
        
        pool.stakingToken.transfer(msg.sender, amount);
        emit Withdrawn(poolId, msg.sender, amount);
    }
}
